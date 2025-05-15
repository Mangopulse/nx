package com.mangox.newsletterx.service;

import com.mangox.newsletterx.exception.ErrorException;
import com.mangox.newsletterx.model.entities.EmailNewsletterSubscriptions;
import com.mangox.newsletterx.model.enums.EnvVariables;
import com.mangox.newsletterx.model.responses.SubscriberResponse;
import com.mangox.newsletterx.model.subscribe.*;
import com.mangox.newsletterx.repositories.EmailNewsletterSubscriptionsRepository;
import com.mangox.newsletterx.sender.service.SendGridService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.SqlFragmentAlias;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {
    @Value("${application.main.sender}")
    private String sender;

    private static final String DOMAIN = "@DOMAIN";
    private static final String TOKEN = "@TOKEN";
    private static final String DOMAIN_TMP = "Domain";
    private static final String LINK = "ConfirmationLink";
    private static final String CONFIRMATION_API = "/subscription-service/confirm-newsletter-subscriber?token=@TOKEN&domain=@DOMAIN";

    private static final String CONFIRMATION_TEMPLATE = "subscriber-email-confirmation.html";
    private static final String CONFIRMATION_EMAIL_SUBJECT = "NewsletterX Email Confirmation";


    private final EmailNewsletterSubscriptionsRepository emailNewsletterSubscriptionsRepository;
    private final SendGridService emailSenderService;
    private final EnvVarsService envVarsService;

    public SubscriberResponse subscribeUser(String appDomain, String email, String userId) throws Exception {
        //Check if user has already subscribed
        if(emailNewsletterSubscriptionsRepository.existsByEmailAndAppDomain(email, appDomain)){
            //Get the email newsletter subscription and check if it is verified
            EmailNewsletterSubscriptions emailNewsletterSubscription = emailNewsletterSubscriptionsRepository.findByEmailAndAppDomain(email,appDomain);
            if(Objects.isNull(emailNewsletterSubscription))
                throw new ErrorException("User seems to be exist before but not found!");
            if(!emailNewsletterSubscription.isVerified() && !emailNewsletterSubscription.isUnsubscribed()){
                if(emailNewsletterSubscription.getVerificationToken() == null || emailNewsletterSubscription.getVerificationToken().isEmpty()){
                    String token = UUID.randomUUID().toString();
                    emailNewsletterSubscription.setVerificationToken(token);
                    emailNewsletterSubscription = emailNewsletterSubscriptionsRepository.save(emailNewsletterSubscription);
                }
                sendSubscriptionEmail(emailNewsletterSubscription.getEmail(), emailNewsletterSubscription.getVerificationToken(), emailNewsletterSubscription.getAppDomain());
                return new SubscriberResponse(generateSubscriber(emailNewsletterSubscription));
            }
            if(emailNewsletterSubscription.isVerified() && emailNewsletterSubscription.isUnsubscribed()){
                emailNewsletterSubscription.setUnsubscribed(false);
                emailNewsletterSubscription.setLastModifiedDate(new Date());
                emailNewsletterSubscriptionsRepository.save(emailNewsletterSubscription);
                return new SubscriberResponse(generateSubscriber(emailNewsletterSubscription));
            }

            if(emailNewsletterSubscription.isVerified())
                throw new ErrorException("User already subscribed and verified");
        }
        //create email subscription and user preferences;
        String token = UUID.randomUUID().toString();
        EmailNewsletterSubscriptions emailNewsletterSubscription = new EmailNewsletterSubscriptions(appDomain, userId, email, token);
        emailNewsletterSubscription.setLastModifiedDate(new Date());
        emailNewsletterSubscriptionsRepository.save(emailNewsletterSubscription);
        boolean sent = sendSubscriptionEmail(email, token,appDomain);
        if(!sent)
            log.error("Failed to send user verification email for"+email, "failed to send verification email in domain "+appDomain+" for user with email "+email);
        return new SubscriberResponse(generateSubscriber(emailNewsletterSubscription));
    }

    public SubscribersResponse BatchSubscribe(List<BatchSubscriber> subscribers, String website){
        List<EmailNewsletterSubscriptions> subscriptions = new ArrayList<>();
        List<String> savedEmail = new ArrayList<>();
        for(BatchSubscriber subscriber : subscribers){
            if(!emailNewsletterSubscriptionsRepository.existsByEmailAndAppDomain(subscriber.getEmail(), website) && !savedEmail.contains(subscriber.getEmail())){
                subscriptions.add(new EmailNewsletterSubscriptions(website, subscriber.getEmail(), subscriber.getFirstName(), subscriber.getLastName(), subscriber.getCountry(), subscriber.getPhone()));
                savedEmail.add(subscriber.getEmail());
            }

        }

        emailNewsletterSubscriptionsRepository.saveAll(subscriptions);
        return new SubscribersResponse(generateSubscribers(subscriptions));
    }

    public boolean sendSubscriptionEmail(String email, String token, String domain) throws IOException {
        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put(LINK, envVarsService.getEnvironmentVariable(EnvVariables.LINK.name())+CONFIRMATION_API.replace(DOMAIN,domain).replace(TOKEN,token));
        templateModel.put(DOMAIN_TMP, domain);
        return emailSenderService.sendHtmlTemplateEmail(sender,email,CONFIRMATION_EMAIL_SUBJECT, CONFIRMATION_TEMPLATE, templateModel);
    }

    public EmailNewsletterSubscriptions confirmSubscriber(String token) throws Exception {
        EmailNewsletterSubscriptions emailNewsletterSubscriptions = emailNewsletterSubscriptionsRepository.findByVerificationToken(token);
        if(Objects.isNull(emailNewsletterSubscriptions)){
            log.error("Failed to confirm user with token "+token);
            throw new ErrorException("User not found ; Unable to Confirm");
        }

        emailNewsletterSubscriptions.setVerified(true);
        emailNewsletterSubscriptions.setLastModifiedDate(new Date());
        emailNewsletterSubscriptionsRepository.save(emailNewsletterSubscriptions);
        return emailNewsletterSubscriptions;
    }

    public EmailNewsletterSubscriptions unsubscribeUser(String email, String domain) throws Exception {
        EmailNewsletterSubscriptions emailNewsletterSubscription = emailNewsletterSubscriptionsRepository.findByEmailAndAppDomain(email,domain);
        if(Objects.isNull(emailNewsletterSubscription)){
            log.error("Failed to unsubscribe user with email "+email+" from domain "+domain);
            throw new ErrorException("Failed to unsubscribe user with email "+email+" from domain "+domain);
        }

        emailNewsletterSubscription.setUnsubscribed(true);
        emailNewsletterSubscription.setLastModifiedDate(new Date());
        emailNewsletterSubscriptionsRepository.save(emailNewsletterSubscription);
        return emailNewsletterSubscription;
    }

    public SubscribersResponse getSubscriptionsByWebsite(String website, int limit, int offset){
        return  new SubscribersResponse(generateSubscribers(emailNewsletterSubscriptionsRepository.getSubscriptionsByDomainWithPagination(website, limit, offset)));
    }


    public Subscriber generateSubscriber(EmailNewsletterSubscriptions emailNewsletterSubscriptions){
        return new Subscriber(
                emailNewsletterSubscriptions.getEmail(),
                emailNewsletterSubscriptions.getFirstName(),
                emailNewsletterSubscriptions.getLastName(),
                emailNewsletterSubscriptions.getCountry(),
                emailNewsletterSubscriptions.getPhone(),
                emailNewsletterSubscriptions.getSubscriptionDate().toString(),
                emailNewsletterSubscriptions.getLastModifiedDate().toString()
        );
    }

    public List<Subscriber> generateSubscribers(List<EmailNewsletterSubscriptions> emailNewsletterSubscriptions){
        List<Subscriber> subscribers = new ArrayList<>();
        for(EmailNewsletterSubscriptions emailNewsletterSubscription : emailNewsletterSubscriptions)
            subscribers.add(generateSubscriber(emailNewsletterSubscription));
        return subscribers;
    }

    public SubscriberStatusResponse getStatus(String email, String website) throws Exception {
        EmailNewsletterSubscriptions emailNewsletterSubscriptions = emailNewsletterSubscriptionsRepository.findByEmailAndAppDomain(email,website);
        if(emailNewsletterSubscriptions == null)
            throw new ErrorException("No Subscription was found with the following email!");
        return new SubscriberStatusResponse(emailNewsletterSubscriptions.isVerified(), emailNewsletterSubscriptions.isUnsubscribed());
    }

    public SubscribersCountResponse getSubscribersCountByWebsite(String website){
        return new SubscribersCountResponse(emailNewsletterSubscriptionsRepository.countVerifiedAndSubscribedUsers(website));
    }
}

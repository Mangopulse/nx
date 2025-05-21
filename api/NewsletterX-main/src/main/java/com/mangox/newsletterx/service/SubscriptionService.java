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

    /**
     * Subscribes a user to the newsletter service.
     * This method handles both new subscriptions and existing user reprocessing.
     *
     * @param appDomain The application domain for the subscription
     * @param email     The user's email address
     * @param userId    The user's ID
     * @return SubscriberResponse containing the subscriber information and
     *         confirmation link
     * @throws Exception if subscription process fails
     */
    public SubscriberResponse subscribeUser(String appDomain, String email, String userId) throws Exception {
        // Validate input parameters
        validateSubscriptionInput(appDomain, email, userId);

        // Check for existing subscription
        EmailNewsletterSubscriptions existingSubscription = findExistingSubscription(email, appDomain);
        if (existingSubscription != null) {
            return handleExistingSubscription(existingSubscription, appDomain);
        }

        // Create and process new subscription
        return createNewSubscription(appDomain, email, userId);
    }

    /**
     * Validates the input parameters for subscription.
     *
     * @param appDomain The application domain
     * @param email     The user's email
     * @param userId    The user's ID
     * @throws IllegalArgumentException if any parameter is invalid
     */
    private void validateSubscriptionInput(String appDomain, String email, String userId) {
        if (appDomain == null || appDomain.trim().isEmpty()) {
            throw new IllegalArgumentException("App domain cannot be null or empty");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        if (userId == null || userId.trim().isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }
    }

    /**
     * Finds an existing subscription for the given email and app domain.
     *
     * @param email     The user's email
     * @param appDomain The application domain
     * @return Existing subscription or null if not found
     */
    private EmailNewsletterSubscriptions findExistingSubscription(String email, String appDomain) {
        return emailNewsletterSubscriptionsRepository.findByEmailAndAppDomain(email, appDomain);
    }

    /**
     * Handles the case of an existing subscription.
     *
     * @param existingSubscription The existing subscription
     * @param appDomain            The application domain
     * @return SubscriberResponse for the existing subscription
     * @throws Exception if reprocessing fails
     */
    private SubscriberResponse handleExistingSubscription(
            EmailNewsletterSubscriptions existingSubscription,
            String appDomain) throws Exception {
        Subscriber subscriber = reprocessExistingSubscriber(existingSubscription);
        String confirmationLink = generateConfirmationLink(
                existingSubscription.getEmail(),
                existingSubscription.getVerificationToken(),
                appDomain);
        return new SubscriberResponse(subscriber, confirmationLink);
    }

    /**
     * Creates a new subscription for the user.
     *
     * @param appDomain The application domain
     * @param email     The user's email
     * @param userId    The user's ID
     * @return SubscriberResponse for the new subscription
     * @throws Exception if subscription creation fails
     */
    private SubscriberResponse createNewSubscription(String appDomain, String email, String userId) throws Exception {
        // Generate verification token
        String token = UUID.randomUUID().toString();
        String confirmationLink = generateConfirmationLink(email, token, appDomain);

        // Create and save new subscription
        EmailNewsletterSubscriptions subscription = createSubscriptionEntity(appDomain, userId, email, token);
        emailNewsletterSubscriptionsRepository.save(subscription);

        // Send verification email
        sendVerificationEmail(email, confirmationLink, appDomain);

        return new SubscriberResponse(generateSubscriber(subscription), confirmationLink);
    }

    /**
     * Creates a new subscription entity.
     *
     * @param appDomain The application domain
     * @param userId    The user's ID
     * @param email     The user's email
     * @param token     The verification token
     * @return New EmailNewsletterSubscriptions entity
     */
    private EmailNewsletterSubscriptions createSubscriptionEntity(
            String appDomain,
            String userId,
            String email,
            String token) {
        EmailNewsletterSubscriptions subscription = new EmailNewsletterSubscriptions(appDomain, userId, email, token);
        subscription.setLastModifiedDate(new Date());
        return subscription;
    }

    /**
     * Sends the verification email to the user.
     *
     * @param email            The user's email
     * @param confirmationLink The confirmation link
     * @param appDomain        The application domain
          * @throws IOException 
          */
         private void sendVerificationEmail(String email, String confirmationLink, String appDomain) throws IOException {
        boolean sent = sendSubscriptionEmail(email, confirmationLink, appDomain);
        if (!sent) {
            log.error("Failed to send verification email for user {} in domain {}", email, appDomain);
        }
    }

    /**
     * Reprocesses an existing subscriber based on their current subscription state.
     * This method handles three main cases:
     * 1. Unverified subscribers - sends new verification email
     * 2. Unsubscribed but verified users - resubscribes them
     * 3. Already verified and subscribed users - throws error
     *
     * @param emailNewsletterSubscription The subscription to reprocess
     * @return Subscriber object representing the processed subscription
     * @throws Exception if the subscription cannot be processed
     */
    public Subscriber reprocessExistingSubscriber(EmailNewsletterSubscriptions emailNewsletterSubscription)
            throws Exception {
        // Validate input
        if (Objects.isNull(emailNewsletterSubscription)) {
            throw new ErrorException("User seems to exist before but not found!");
        }

        // Check if user is already verified and subscribed
        if (emailNewsletterSubscription.isVerified() && !emailNewsletterSubscription.isUnsubscribed()) {
            throw new ErrorException("User already subscribed and verified");
        }

        // Handle unverified subscribers
        if (!emailNewsletterSubscription.isVerified() && !emailNewsletterSubscription.isUnsubscribed()) {
            return handleUnverifiedSubscriber(emailNewsletterSubscription);
        }

        // Handle resubscription for verified but unsubscribed users
        if (emailNewsletterSubscription.isVerified() && emailNewsletterSubscription.isUnsubscribed()) {
            return handleResubscription(emailNewsletterSubscription);
        }

        // This should never happen if the subscription states are properly managed
        throw new ErrorException("Invalid subscription state");
    }

    /**
     * Handles the case of an unverified subscriber by:
     * 1. Generating a new verification token if needed
     * 2. Sending a confirmation email
     * 3. Creating a subscriber object
     *
     * @param subscription The unverified subscription to process
     * @return Subscriber object for the unverified subscription
     * @throws Exception if email sending fails
     */
    private Subscriber handleUnverifiedSubscriber(EmailNewsletterSubscriptions subscription) throws Exception {
        // Generate new verification token if needed
        if (subscription.getVerificationToken() == null || subscription.getVerificationToken().isEmpty()) {
            String token = UUID.randomUUID().toString();
            subscription.setVerificationToken(token);
            subscription = emailNewsletterSubscriptionsRepository.save(subscription);
        }

        // Generate confirmation link and send verification email
        String confirmationLink = generateConfirmationLink(
                subscription.getEmail(),
                subscription.getAppDomain(),
                subscription.getAppDomain());

        sendSubscriptionEmail(
                subscription.getEmail(),
                confirmationLink,
                subscription.getAppDomain());

        return generateSubscriber(subscription);
    }

    /**
     * Handles the resubscription process for previously unsubscribed users by:
     * 1. Marking them as subscribed
     * 2. Updating the last modified date
     * 3. Creating a new subscriber object
     *
     * @param subscription The subscription to resubscribe
     * @return Subscriber object for the resubscribed user
     */
    private Subscriber handleResubscription(EmailNewsletterSubscriptions subscription) {
        // Update subscription status
        subscription.setUnsubscribed(false);
        subscription.setLastModifiedDate(new Date());

        // Save changes and generate subscriber object
        emailNewsletterSubscriptionsRepository.save(subscription);
        return generateSubscriber(subscription);
    }

    public SubscribersResponse BatchSubscribe(List<BatchSubscriber> subscribers, String website) {
        List<EmailNewsletterSubscriptions> subscriptions = new ArrayList<>();
        List<String> savedEmail = new ArrayList<>();
        for (BatchSubscriber subscriber : subscribers) {
            if (!emailNewsletterSubscriptionsRepository.existsByEmailAndAppDomain(subscriber.getEmail(), website)
                    && !savedEmail.contains(subscriber.getEmail())) {
                subscriptions
                        .add(new EmailNewsletterSubscriptions(website, subscriber.getEmail(), subscriber.getFirstName(),
                                subscriber.getLastName(), subscriber.getCountry(), subscriber.getPhone()));
                savedEmail.add(subscriber.getEmail());
            }

        }

        emailNewsletterSubscriptionsRepository.saveAll(subscriptions);
        return new SubscribersResponse(generateSubscribers(subscriptions));
    }

    public String generateConfirmationLink(String email, String token, String domain) throws IOException {

        var link = envVarsService.getEnvironmentVariable(EnvVariables.LINK.name())
                + CONFIRMATION_API.replace(DOMAIN, domain).replace(TOKEN, token);
        return link;
    }

    public boolean sendSubscriptionEmail(String email, String confirmationLink, String domain) throws IOException {
        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put(LINK, confirmationLink);
        templateModel.put(DOMAIN_TMP, domain);

        return emailSenderService.sendHtmlTemplateEmail(sender, email, CONFIRMATION_EMAIL_SUBJECT,
                CONFIRMATION_TEMPLATE,
                templateModel);
    }

    public EmailNewsletterSubscriptions confirmSubscriber(String token) throws Exception {
        EmailNewsletterSubscriptions emailNewsletterSubscriptions = emailNewsletterSubscriptionsRepository
                .findByVerificationToken(token);
        if (Objects.isNull(emailNewsletterSubscriptions)) {
            log.error("Failed to confirm user with token " + token);
            throw new ErrorException("User not found ; Unable to Confirm");
        }

        emailNewsletterSubscriptions.setVerified(true);
        emailNewsletterSubscriptions.setLastModifiedDate(new Date());
        emailNewsletterSubscriptionsRepository.save(emailNewsletterSubscriptions);
        return emailNewsletterSubscriptions;
    }

    public EmailNewsletterSubscriptions unsubscribeUser(String email, String domain) throws Exception {
        EmailNewsletterSubscriptions emailNewsletterSubscription = emailNewsletterSubscriptionsRepository
                .findByEmailAndAppDomain(email, domain);
        if (Objects.isNull(emailNewsletterSubscription)) {
            log.error("Failed to unsubscribe user with email " + email + " from domain " + domain);
            throw new ErrorException("Failed to unsubscribe user with email " + email + " from domain " + domain);
        }

        emailNewsletterSubscription.setUnsubscribed(true);
        emailNewsletterSubscription.setLastModifiedDate(new Date());
        emailNewsletterSubscriptionsRepository.save(emailNewsletterSubscription);
        return emailNewsletterSubscription;
    }

    public SubscribersResponse getSubscriptionsByWebsite(String website, int limit, int offset) {
        return new SubscribersResponse(generateSubscribers(
                emailNewsletterSubscriptionsRepository.getSubscriptionsByDomainWithPagination(website, limit, offset)));
    }

    public Subscriber generateSubscriber(EmailNewsletterSubscriptions emailNewsletterSubscriptions) {
        return new Subscriber(
                emailNewsletterSubscriptions.getEmail(),
                emailNewsletterSubscriptions.getFirstName(),
                emailNewsletterSubscriptions.getLastName(),
                emailNewsletterSubscriptions.getCountry(),
                emailNewsletterSubscriptions.getPhone(),
                emailNewsletterSubscriptions.getSubscriptionDate().toString(),
                emailNewsletterSubscriptions.getLastModifiedDate().toString());
    }

    public List<Subscriber> generateSubscribers(List<EmailNewsletterSubscriptions> emailNewsletterSubscriptions) {
        List<Subscriber> subscribers = new ArrayList<>();
        for (EmailNewsletterSubscriptions emailNewsletterSubscription : emailNewsletterSubscriptions)
            subscribers.add(generateSubscriber(emailNewsletterSubscription));
        return subscribers;
    }

    public SubscriberStatusResponse getStatus(String email, String website) throws Exception {
        EmailNewsletterSubscriptions emailNewsletterSubscriptions = emailNewsletterSubscriptionsRepository
                .findByEmailAndAppDomain(email, website);
        if (emailNewsletterSubscriptions == null)
            throw new ErrorException("No Subscription was found with the following email!");
        return new SubscriberStatusResponse(emailNewsletterSubscriptions.isVerified(),
                emailNewsletterSubscriptions.isUnsubscribed());
    }

    public SubscribersCountResponse getSubscribersCountByWebsite(String website) {
        return new SubscribersCountResponse(
                emailNewsletterSubscriptionsRepository.countVerifiedAndSubscribedUsers(website));
    }
}

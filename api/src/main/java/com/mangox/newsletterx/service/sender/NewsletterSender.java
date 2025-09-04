package com.mangox.newsletterx.service.sender;

import com.mangox.newsletterx.exception.ErrorException;
import com.mangox.newsletterx.helper.GsonHelper;
import com.mangox.newsletterx.helper.ScheduleHelper;
import com.mangox.newsletterx.model.components.HtmlComponent;
import com.mangox.newsletterx.model.components.Post;
import com.mangox.newsletterx.model.entities.*;
import com.mangox.newsletterx.model.enums.EnvVariables;
import com.mangox.newsletterx.model.responses.ScheduledEmailsResponse;
import com.mangox.newsletterx.repositories.EmailNewsletterRepository;
import com.mangox.newsletterx.repositories.EmailNewsletterSubscriptionsRepository;
import com.mangox.newsletterx.repositories.ScheduledEmailsRepository;
import com.mangox.newsletterx.repositories.SenderRepository;
import com.mangox.newsletterx.sender.SenderFactory;
import com.mangox.newsletterx.sender.ThirdPartyEmailSender;
import com.mangox.newsletterx.service.EnvVarsService;
import com.mangox.newsletterx.service.NewsletterService;
import com.mangox.newsletterx.service.WebsiteService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NewsletterSender {
    private final EnvVarsService envVarsService;
    private final PostService postService;
    private final EmailNewsletterRepository emailNewsletterRepository;
    private final EmailNewsletterSubscriptionsRepository emailNewsletterSubscriptionsRepository;
    private final ScheduleHelper scheduleHelper;
    private final SenderRepository senderRepository;
    private final NewsletterService newsletterService;
    private final SenderFactory senderFactory;
    private final WebsiteService websiteService;
    private final GsonHelper gsonHelper;
    private final ScheduledEmailsRepository scheduledEmailsRepository;
    private static final String UNSUBSCRIBE_API = "/subscription-service/unsubscribe?email=@EMAIL&domain=@DOMAIN";
    private static final String DOMAIN = "@DOMAIN";
    private static final String EMAIL = "@EMAIL";

    public void previewEmailSender(String appDomain, List<HtmlComponent> htmlComponents, String email, String subject) throws Exception {
        Integer postsCount = getTotalPostsCount(htmlComponents);
        List<Post> posts = postService.getPostResponse(appDomain, postsCount, email);
        Sender sender = senderRepository.findByWebsite(appDomain);
        String unsubscribe_api = envVarsService.getEnvironmentVariable(EnvVariables.LINK.name())+ UNSUBSCRIBE_API.replace(DOMAIN, appDomain).replace(EMAIL, email);
        List<String> titles = new ArrayList<>();
        String html = newsletterService.generateHTML(htmlComponents, postsCount, posts, unsubscribe_api, titles);
        ThirdPartyEmailSender emailSender = senderFactory.getService(sender.getSenderType());
        if (emailSender == null)
            throw new ErrorException("Failed to get the sender Type!");
        boolean sent = emailSender.sendHtmlEmail(createDisplayName(appDomain, sender.getEmail()), email, subject, html, sender);

        if (!sent)
            throw new ErrorException("Failed to send the email, please specify or verify the sender !");
    }

    @Transactional
    public ScheduledEmailsResponse scheduledEmailSender() throws Exception {
        // Get the current date and time
        LocalDateTime now = LocalDateTime.now();

        // Get senders
        HashMap<String, Sender> senders = generateSenders();

        // Log information about when the scheduled emails are being checked
        log.info("Checking for scheduled emails @" + now.getHour() + " o'clock on day " +
                now.getDayOfWeek().getValue() + " of the week or on day " + now.getDayOfMonth() + " of the month!");

        // Initialize the response object
        ScheduledEmailsResponse scheduledEmailsResponse = new ScheduledEmailsResponse("html-component");

        // Retrieve active email newsletters
        List<EmailNewsletter> emailNewsletters = emailNewsletterRepository.getActiveNewsletters();

        // Iterate through active newsletters
        for (EmailNewsletter emailNewsletter : emailNewsletters) {

            // Check if the sender is available for the website
            if (!senders.containsKey(emailNewsletter.getWebsite())) {
                scheduledEmailsResponse.errors.add("This website has no sender: " + emailNewsletter.getWebsite());
                continue;
            }

            // Check if the newsletter is scheduled to be sent now and if there are widgets to include
            if (!scheduleHelper.scheduledNow(emailNewsletter)) {
                log.info("The Email Newsletter Service is not active for domain " + emailNewsletter.getWebsite());
                continue;
            }

            log.info("The Email Newsletter Service is active for domain " + emailNewsletter.getWebsite());

            // Retrieve subscriptions for the newsletter
            List<EmailNewsletterSubscriptions> emailNewsletterSubscriptions =
                    emailNewsletterSubscriptionsRepository.getSubscriptionsByDomain(emailNewsletter.getWebsite());

            // Initialize a ScheduledEmails object for tracking
            ScheduledEmails scheduledEmails = new ScheduledEmails("html-component", emailNewsletter.getWebsite());

            log.info("Active Subscribers Number for " + emailNewsletter.getWebsite() + " is " + emailNewsletterSubscriptions.size());

            // Iterate through subscribers and send emails
            Website website = websiteService.getWebsite(emailNewsletter.getWebsite());
            int quota = website.getEmailsQuota()!=null? website.getEmailsQuota() : 10;
            for (EmailNewsletterSubscriptions emailNewsletterSubscription : emailNewsletterSubscriptions) {
                if(quota-- == 0)
                    break;
                try {
                    // Retrieve widget responses for the subscriber
                    List<HtmlComponent> htmlComponents = gsonHelper.htmlComponentsDeserialize(emailNewsletter.getHtmlComponents());
                    int postsCount = getTotalPostsCount(htmlComponents);
                    List<Post> posts = postService.getPostResponse(emailNewsletter.getWebsite(), postsCount, emailNewsletterSubscription.getUserId());

                    // Check if widget responses are available
                    if (Objects.isNull(posts) || posts.isEmpty() || posts.size() != postsCount) {
                        log.info("Failed to send email for user with email " + emailNewsletterSubscription.getEmail() + " No posts to send!");
                        scheduledEmailsResponse.errors.add("No posts were found for " + emailNewsletterSubscription.getEmail() +
                                " to send by " + emailNewsletterSubscription.getAppDomain());
                        continue;
                    }

                    log.info("Sending for user with email " + emailNewsletterSubscription.getEmail());

                    // Generate HTML content for the email
                    String unsubscribeApi = envVarsService.getEnvironmentVariable(EnvVariables.LINK.name()) +  UNSUBSCRIBE_API.replace(DOMAIN, emailNewsletter.getWebsite()).replace(EMAIL, emailNewsletterSubscription.getEmail());
                    List<String> titles = new ArrayList<>();
                    String html = newsletterService.generateHTML(htmlComponents,postsCount,posts,unsubscribeApi,titles);

                    // Retrieve the sender's email from cache
                    Sender sender = senders.get(emailNewsletter.getWebsite());
                    String fromEmail = createDisplayName(sender.getWebsite(), sender.getEmail());

                    // Send the email using a third-party email sender
                    ThirdPartyEmailSender senderType = senderFactory.getService(senders.get(emailNewsletter.getWebsite()).getSenderType());
                    if(senderType == null)
                        throw new ErrorException("Failed to get the sender Type!");
                    boolean sent = senderType.sendHtmlEmail(fromEmail, emailNewsletterSubscription.getEmail(), generateSubject(emailNewsletter.getSubject(),titles), html,  senders.get(emailNewsletter.getWebsite()));
                    if(!sent)
                        throw new ErrorException("Failed to send email!");

                    // Update the response and track the  email
                    updateResponse(scheduledEmailsResponse, emailNewsletter.getWebsite(), emailNewsletterSubscription.getEmail());
                    scheduledEmails.getEmails().add(emailNewsletterSubscription.getEmail());
                    scheduledEmails.setCount(scheduledEmails.getCount() + 1);
                } catch (Exception e) {
                    // Log and handle any exceptions
                    log.error(e.getMessage());
                    scheduledEmailsResponse.errors.add(emailNewsletterSubscription.getEmail() + " ; error: " + e.getMessage());
                }
            }

            // Save the details of sent emails in the database
            scheduledEmailsRepository.save(scheduledEmails);
        }

        // Return the final response
        return scheduledEmailsResponse;
    }

    private int getTotalPostsCount(List<HtmlComponent> htmlComponents) {
        int totalPostsCount = 0;

        for (HtmlComponent component : htmlComponents) {
            if (component.getExtra() != null && component.getExtra().getPostsCount() != null) {
                totalPostsCount += component.getExtra().getPostsCount();
            }
        }

        return totalPostsCount;
    }

    private String createDisplayName(String domain, String email){
        // Split the string by '.'
        String[] parts = domain.split("\\.");

        // Get the last string
        String name = parts[parts.length - 2];
        if (name == null || name.isEmpty())
            return "Newsletter <"+email+">";

        name = Character.toUpperCase(name.charAt(0)) + name.substring(1);
        return  name + " News <"+email+">";
    }

    private static String generateSubject(String subjectString, List<String> titles){
        String subject = subjectString+" : ";
        subject += titles.stream().limit(2).collect(Collectors.joining(" ... "));
        return subject;
    }

    private HashMap<String, Sender> generateSenders() {
        List<Sender> senders = senderRepository.findAllByVerified(true);
        HashMap<String, Sender> map = new HashMap<>();
        for (Sender sender : senders)
            map.put(sender.getWebsite(), sender);
        return map;
    }

    private void updateResponse(ScheduledEmailsResponse scheduledEmails, String domain, String email) {
        if (scheduledEmails.sentMails.containsKey(domain)) {
            List<String> mails = scheduledEmails.sentMails.get(domain);
            mails.add(email);
        } else {
            List<String> mails = new ArrayList<>();
            mails.add(email);
            scheduledEmails.sentMails.put(domain, mails);
        }
    }

}

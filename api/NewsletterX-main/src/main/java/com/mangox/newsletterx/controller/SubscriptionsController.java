package com.mangox.newsletterx.controller;

import com.mangox.newsletterx.exception.ErrorException;
import com.mangox.newsletterx.model.entities.EmailNewsletterSubscriptions;
import com.mangox.newsletterx.model.enums.EnvVariables;
import com.mangox.newsletterx.model.responses.SubscriberResponse;
import com.mangox.newsletterx.model.responses.main.ErrorResponse;
import com.mangox.newsletterx.model.subscribe.SubscriberRequest;
import com.mangox.newsletterx.model.subscribe.SubscriberStatusRequest;
import com.mangox.newsletterx.service.EnvVarsService;
import com.mangox.newsletterx.service.SubscriptionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Objects;

@Slf4j
@RestController
@RequestMapping("/subscription-service")
@RequiredArgsConstructor
@CrossOrigin
public class SubscriptionsController {
    private final SubscriptionService subscriptionService;
    private final EnvVarsService envVarsService;

    // Inject the active Spring profile
    @Value("${spring.profiles.active:}")
    private String activeProfile;

    @PostMapping("/subscribe")
    public ResponseEntity<?> userSubscribe(@RequestBody SubscriberRequest subscriber) {
        try {
            // Get the original response (including the confirmation link)
            SubscriberResponse subscriberResponse = subscriptionService.subscribeUser(
                subscriber.getAppDomain(), 
                subscriber.getEmail(),
                subscriber.getUserId()
            );

            // If in production, remove the confirmation link
            if ("prod".equalsIgnoreCase(activeProfile)) {
                subscriberResponse.setConfirmationLink(null);
            }

            return ResponseEntity.ok(subscriberResponse);

        } catch (ErrorException e) {
            return new ResponseEntity<>(
                new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()),
                HttpStatus.BAD_REQUEST
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                new ErrorResponse(HttpStatus.BAD_REQUEST,
                    "Operation Failed , if this happens again please contact the support team"),
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @GetMapping("/confirm-newsletter-subscriber")
    public RedirectView verifyEmailSubscriber(@RequestParam("token") String confirmationToken,
                                              @RequestParam("domain") String domain) {
        try {
            subscriptionService.confirmSubscriber(confirmationToken);
            log.info("user with token is successfully verified !");
            return new RedirectView(
                envVarsService.getEnvironmentVariable(EnvVariables.LINK.name()) + "/status/subscribed");
        } catch (Exception e) {
            log.error("Failed to confirm email of user.");
            return new RedirectView(
                envVarsService.getEnvironmentVariable(EnvVariables.LINK.name()) + "/status/confirmationFailure");
        }
    }

    @GetMapping("/unsubscribe")
    public RedirectView userUnsubscribe(@RequestParam("email") String email,
                                        @RequestParam("domain") String domain) {
        try {
            EmailNewsletterSubscriptions emailNewsletterSubscriptions = subscriptionService.unsubscribeUser(email, domain);
            if (Objects.nonNull(emailNewsletterSubscriptions)) {
                log.info("Successfully unsubscribed user with email: {}", email);
                return new RedirectView(
                    envVarsService.getEnvironmentVariable(EnvVariables.LINK.name()) + "/status/unsubscribed");
            }
            log.warn("Failed to unsubscribe user with email: {} - subscription not found", email);
            return new RedirectView(
                envVarsService.getEnvironmentVariable(EnvVariables.LINK.name()) + "/status/confirmationFailure");
        } catch (Exception e) {
            log.error("Error unsubscribing user with email: {} - {}", email, e.getMessage());
            return new RedirectView(
                envVarsService.getEnvironmentVariable(EnvVariables.LINK.name()) + "/status/confirmationFailure");
        }
    }

    @PostMapping("/status")
    public ResponseEntity<?> checkStatus(@RequestBody SubscriberStatusRequest subscriberStatusRequest) {
        try {
            return ResponseEntity.ok(subscriptionService.getStatus(
                subscriberStatusRequest.getEmail(),
                subscriberStatusRequest.getAppDomain()
            ));
        } catch (ErrorException e) {
            return new ResponseEntity<>(
                new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()),
                HttpStatus.BAD_REQUEST
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                new ErrorResponse(HttpStatus.BAD_REQUEST,
                    "Operation Failed , if this happens again please contact the support team"),
                HttpStatus.BAD_REQUEST
            );
        }
    }
}

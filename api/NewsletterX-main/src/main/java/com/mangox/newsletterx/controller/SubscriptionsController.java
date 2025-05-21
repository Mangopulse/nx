package com.mangox.newsletterx.controller;

import com.mangox.newsletterx.exception.ErrorException;
import com.mangox.newsletterx.model.entities.EmailNewsletterSubscriptions;
import com.mangox.newsletterx.model.enums.EnvVariables;
import com.mangox.newsletterx.model.responses.main.ErrorResponse;
import com.mangox.newsletterx.model.subscribe.SubscriberRequest;
import com.mangox.newsletterx.model.subscribe.SubscriberStatusRequest;
import com.mangox.newsletterx.service.EnvVarsService;
import com.mangox.newsletterx.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;
import java.util.Objects;

@Slf4j
@RestController
@RequestMapping("/subscription-service")
@RequiredArgsConstructor
@CrossOrigin
public class SubscriptionsController {
    private final SubscriptionService subscriptionService;
    private final EnvVarsService envVarsService;

    @PostMapping("/subscribe")
    public ResponseEntity<?> userSubscribe(@RequestBody SubscriberRequest subscriber) {
        try {
            // Call subscribeUser method from subscriptionService to insert a record in the database and send a confirmation email 
            var subscriberResponse = subscriptionService.subscribeUser(subscriber.getAppDomain(), subscriber.getEmail(), subscriber.getUserId());
            return ResponseEntity.ok(subscriberResponse);


        } catch (ErrorException e) {
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ErrorResponse(HttpStatus.BAD_REQUEST,
                            "Operation Failed , if this happens again please contact the support team"),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/confirm-newsletter-subscriber")
    public RedirectView verifyEmailSubscriber(@RequestParam("token") String confirmationToken,
            @RequestParam("domain") String domain) {
        try {
            EmailNewsletterSubscriptions emailNewsletterSubscriptions = subscriptionService
                    .confirmSubscriber(confirmationToken);
            log.info("user with token : " + confirmationToken + " is successfully verified !");
            return new RedirectView(
                    envVarsService.getEnvironmentVariable(EnvVariables.LINK.name()) + "/status/subscribed");
        } catch (Exception e) {
            log.error("Failed to confirm email of user having token : " + confirmationToken);
            return new RedirectView(
                    envVarsService.getEnvironmentVariable(EnvVariables.LINK.name()) + "/status/confirmationFailure");
        }
    }

    @GetMapping("/unsubscribe")
    public RedirectView userUnsubscribe(@RequestParam("email") String email, @RequestParam("domain") String domain) {
        try {
            EmailNewsletterSubscriptions emailNewsletterSubscriptions = subscriptionService.unsubscribeUser(email,
                    domain);
            if (Objects.nonNull(emailNewsletterSubscriptions))
                return new RedirectView(
                        envVarsService.getEnvironmentVariable(EnvVariables.LINK.name()) + "/status/unsubscribed");
            return new RedirectView(
                    envVarsService.getEnvironmentVariable(EnvVariables.LINK.name()) + "/status/confirmationFailure");
        } catch (Exception e) {
            return new RedirectView(
                    envVarsService.getEnvironmentVariable(EnvVariables.LINK.name()) + "/status/confirmationFailure");
        }
    }

    @PostMapping("/status")
    public ResponseEntity<?> checkStatus(@RequestBody SubscriberStatusRequest subscriberStatusRequest) {
        try {
            return ResponseEntity.ok(subscriptionService.getStatus(subscriberStatusRequest.getEmail(),
                    subscriberStatusRequest.getAppDomain()));
        } catch (ErrorException e) {
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ErrorResponse(HttpStatus.BAD_REQUEST,
                            "Operation Failed , if this happens again please contact the support team"),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/get-confirmation-link")
    public ResponseEntity<?> getConfirmationLink(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String token = request.get("token");
            String domain = request.get("domain");
            String link = subscriptionService.generateConfirmationLink(email, token, domain);
            return ResponseEntity.ok(Map.of("confirmationLink", link));
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ErrorResponse(HttpStatus.BAD_REQUEST,
                            "Failed to generate confirmation link"),
                    HttpStatus.BAD_REQUEST);
        }
    }
}

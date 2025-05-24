package com.mangox.newsletterx.controller;

import com.mangox.newsletterx.exception.ErrorException;
import com.mangox.newsletterx.model.components.HtmlComponentsUpdate;
import com.mangox.newsletterx.model.entities.User;
import com.mangox.newsletterx.model.entities.Website;
import com.mangox.newsletterx.model.newsletter.CollectorResponse;
import com.mangox.newsletterx.model.newsletter.NewsletterId;
import com.mangox.newsletterx.model.newsletter.ToggleNewsletterRequest;
import com.mangox.newsletterx.model.request.*;
import com.mangox.newsletterx.model.responses.main.ErrorResponse;
import com.mangox.newsletterx.model.responses.main.SuperResponse;
import com.mangox.newsletterx.model.subscribe.BatchSubscription;
import com.mangox.newsletterx.service.NewsletterService;
import com.mangox.newsletterx.service.SubscriptionService;
import com.mangox.newsletterx.service.WebsiteService;
import com.mangox.newsletterx.service.sender.NewsletterSender;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/website")
@RequiredArgsConstructor
@CrossOrigin
@PreAuthorize("hasAnyRole('USER')")
public class WebsiteController {

    private final WebsiteService websiteService;
    private final NewsletterService newsletterService;
    private final NewsletterSender newsletterSender;
    private final SubscriptionService subscriptionService;

    @PostMapping(value = "/collector-update", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> collectorUpdate(@RequestBody String requestBody, Principal connectedUser){
        try{
            var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            Website website = websiteService.updateWebsiteCollector(user.getWebsite(), requestBody);
            return new ResponseEntity<>(new CollectorResponse(website.getCollector()), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/collector-read", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> collectorGet(Principal connectedUser){
        try{
            var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            Website website = websiteService.getWebsite(user.getWebsite());
            return new ResponseEntity<>(new CollectorResponse(website.getCollector()), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/newsletters-read")
    public ResponseEntity<?> emailNewsletterGet(Principal connectedUser){
        try{
            var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            return ResponseEntity.ok( newsletterService.getEmailNewsletters(user.getWebsite()));
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/newsletter-read")
    public ResponseEntity<?> emailNewsletterRead(@RequestBody NewsletterId newsletter){
        try{
            return ResponseEntity.ok( newsletterService.getNewsletter(newsletter.getId()));
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/newsletter-update")
    public ResponseEntity<?> updateHtmlComponents(@RequestBody HtmlComponentsUpdate htmlComponentsUpdate, Principal connectedUser){
        try{
            return ResponseEntity.ok( newsletterService.updateNewsletter(htmlComponentsUpdate.getHtmlComponents(), htmlComponentsUpdate.getId(), htmlComponentsUpdate.getTitle()));
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/toggle-newsletter")
    public ResponseEntity<?> updateNewsletterState(@RequestBody ToggleNewsletterRequest toggleNewsletterRequest){
        try{
            return ResponseEntity.ok( newsletterService.toggleNewsletter(toggleNewsletterRequest.id(), toggleNewsletterRequest.isActive()));
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/schedule-newsletter")
    public ResponseEntity<?> scheduleNewsletterState(@RequestBody ScheduleRequest scheduleRequest){
        try{
            return ResponseEntity.ok( newsletterService.scheduleNewsletter(scheduleRequest.getId(), scheduleRequest.getType(), scheduleRequest.getHour(), scheduleRequest.getDay()));
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/send-preview-email")
    public ResponseEntity<?> sendConfiguredTemplate(@RequestBody ManualComponentGeneratedEmail manualComponentGeneratedEmail, Principal connectedUser) throws Exception {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        String link = user.getWebsite();
        try{
            newsletterSender.previewEmailSender(
                    link,
                    manualComponentGeneratedEmail.getComponents(),
                    manualComponentGeneratedEmail.getEmail(),
                    manualComponentGeneratedEmail.getSubject()
            );
            return new ResponseEntity<>(new SuperResponse(), HttpStatus.OK);
        }catch (ErrorException e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, "Operation Failed , if this happens again please contact the support team"), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/subscribers-list")
    public ResponseEntity<?> updateHtmlComponents(@RequestBody PaginationRequest paginationRequest, Principal connectedUser) {
        try {
            var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            return ResponseEntity.ok(subscriptionService.getSubscriptionsByWebsite(user.getWebsite(), paginationRequest.getLimit(), paginationRequest.getOffset()));
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/batch-subscribe")
    public ResponseEntity<?> batchSubscription(@RequestBody BatchSubscription batchSubscription, Principal connectedUser){
        try{
            var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            return ResponseEntity.ok(subscriptionService.BatchSubscribe(batchSubscription.getSubscribers(), user.getWebsite()));
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/get-sender")
    public ResponseEntity<?> getSender(@RequestBody SenderRequest senderRequest, Principal connectedUser){
        try{
            var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            return ResponseEntity.ok(websiteService.getSender(senderRequest.getId(), user.getWebsite()));
        }catch (ErrorException e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, "Operation Failed , if this happens again please contact the support team"), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/update-sender")
    public ResponseEntity<?> deleteSender(@RequestBody UpdateSenderRequest senderRequest, Principal connectedUser){
        try{
            var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            return ResponseEntity.ok(websiteService.updateSender(user.getWebsite(), user.getEmail(), senderRequest));
        }catch (ErrorException e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST,e.getMessage()), HttpStatus.BAD_REQUEST);
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, "Operation Failed , if this happens again please contact the support team"), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/subscribers-count")
    public ResponseEntity<?> getSubscribersCount(Principal connectedUser){
        try{
            var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            return ResponseEntity.ok(subscriptionService.getSubscribersCountByWebsite(user.getWebsite()));
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST,  e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

}

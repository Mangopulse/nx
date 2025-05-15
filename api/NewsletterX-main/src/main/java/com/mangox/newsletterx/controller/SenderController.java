package com.mangox.newsletterx.controller;

import com.mangox.newsletterx.model.responses.main.ErrorResponse;
import com.mangox.newsletterx.service.sender.NewsletterSender;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sender")
@RequiredArgsConstructor
@CrossOrigin
public class SenderController {
    private final NewsletterSender newsletterSender;

    @GetMapping("/send-scheduled-emails")
    public ResponseEntity<?> sendScheduledEmails(){
        try{
            return ResponseEntity.ok(newsletterSender.scheduledEmailSender());
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}

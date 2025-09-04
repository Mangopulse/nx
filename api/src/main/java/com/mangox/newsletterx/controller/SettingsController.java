package com.mangox.newsletterx.controller;

import com.mangox.newsletterx.model.entities.User;
import com.mangox.newsletterx.model.request.SenderUpdateRequest;
import com.mangox.newsletterx.model.responses.main.ErrorResponse;
import com.mangox.newsletterx.service.WebsiteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Slf4j
@RestController
@RequestMapping("/settings")
@RequiredArgsConstructor
@CrossOrigin
@PreAuthorize("hasAnyRole('USER')")
public class SettingsController {
    private final WebsiteService websiteService;

    @GetMapping(value = "/website-configs", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getWebsiteConfigs(Principal connectedUser){
        try{
            var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            return ResponseEntity.ok(websiteService.getUserWebsiteConfigs(user.getWebsite()));
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/update-settings", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateWebsiteSenderConfigs(@RequestBody SenderUpdateRequest senderUpdateRequest, Principal connectedUser){
        try{
            var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            return ResponseEntity.ok(websiteService.updateSenderSettings(user.getWebsite(), senderUpdateRequest.getSenderType(), senderUpdateRequest.getApiKey(), senderUpdateRequest.getEmail() ,
                    senderUpdateRequest.getSmtpUserName(), senderUpdateRequest.getSmtpPassword(), senderUpdateRequest.getSmtpHost(), senderUpdateRequest.getSmtpPort(),
                    senderUpdateRequest.isUseAuth(), senderUpdateRequest.getSecurityType(),user.getEmail()));
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}

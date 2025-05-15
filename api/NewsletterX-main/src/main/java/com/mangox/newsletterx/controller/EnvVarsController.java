package com.mangox.newsletterx.controller;

import com.mangox.newsletterx.model.responses.main.ErrorResponse;
import com.mangox.newsletterx.service.EnvVarsService;
import com.mangox.newsletterx.service.NewsletterService;
import com.mangox.newsletterx.service.WebsiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/vars")
@RequiredArgsConstructor
@CrossOrigin
public class EnvVarsController {
    private final EnvVarsService envVarsService;
    private final NewsletterService newsletterService;

    @GetMapping(value = "/get-vars",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getVariables() {
        try{
            return ResponseEntity
                    .ok()
                    .body(envVarsService.getVariables());
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.CONFLICT, e.getMessage()), HttpStatus.CONFLICT);
        }
    }

    @GetMapping(value = "/update-var",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateVariable(@RequestParam("key")String key, @RequestParam("value")String value) {
        try{
            return ResponseEntity
                    .ok()
                    .body(envVarsService.addVariable(key, value));
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.CONFLICT, e.getMessage()), HttpStatus.CONFLICT);
        }
    }

    @GetMapping(value = "/refresh-vars",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> refreshVariables() {
        try{
            envVarsService.refreshMap();
            return ResponseEntity
                    .ok()
                    .body("done");
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.CONFLICT, e.getMessage()), HttpStatus.CONFLICT);
        }
    }

}

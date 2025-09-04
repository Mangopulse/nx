package com.mangox.newsletterx.controller;

import com.mangox.newsletterx.model.responses.main.ErrorResponse;
import com.mangox.newsletterx.service.WebsiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/config")
@RequiredArgsConstructor
@CrossOrigin
public class ConfigController {

    private final WebsiteService websiteService;
    @GetMapping(value = "/get-configs",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> confirmUserAccount(@RequestParam("website")String website) {
        try{
            return ResponseEntity
                    .ok()
                    .cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS))
                    .eTag(website)
                    .body(websiteService.getConfigs(website));

        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.CONFLICT, e.getMessage()), HttpStatus.CONFLICT);
        }
    }
}

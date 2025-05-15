package com.mangox.newsletterx.controller;

import com.mangox.newsletterx.model.entities.User;
import com.mangox.newsletterx.model.request.AnalyticsRequest;
import com.mangox.newsletterx.model.responses.AnalyticsResponse;
import com.mangox.newsletterx.model.responses.main.ErrorResponse;
import com.mangox.newsletterx.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.TreeMap;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@CrossOrigin
@PreAuthorize("hasAnyRole('USER')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    @GetMapping(value = "/subscribers-count")
    public ResponseEntity<?> subscribersCount(@ModelAttribute AnalyticsRequest analyticsRequest, Principal connectedUser){
        try{
            var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            if (analyticsRequest.getTo() == null || analyticsRequest.getFrom() == null){
                return ResponseEntity.ok(new AnalyticsResponse(analyticsService.getVerifiedSubscribersCount(user.getWebsite())));
            }else{
                Long totalCount = analyticsService.getVerifiedSubscribersCount(user.getWebsite());
                TreeMap<String, Long> countWithDate = analyticsService.getVerifiedSubscribersCountByDate(user.getWebsite(), sdf.parse(analyticsRequest.getFrom()), sdf.parse(analyticsRequest.getTo()));
                return ResponseEntity.ok(new AnalyticsResponse(totalCount, new ArrayList<>(countWithDate.keySet()), new ArrayList<>(countWithDate.values())));
            }
        }catch (Exception e){

            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/subscribers-count-unverified")
    public ResponseEntity<?> subscribersCountUnVerified(@ModelAttribute AnalyticsRequest analyticsRequest, Principal connectedUser){
        try{
            var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            if (analyticsRequest.getTo() == null || analyticsRequest.getFrom() == null){
                return ResponseEntity.ok(new AnalyticsResponse(analyticsService.getUnverifiedSubscribersCount(user.getWebsite())));
            }else{
                Long totalCount = analyticsService.getUnverifiedSubscribersCount(user.getWebsite());
                TreeMap<String, Long> countWithDate = analyticsService.getUnVerifiedSubscribersCountByDate(user.getWebsite(), sdf.parse(analyticsRequest.getFrom()), sdf.parse(analyticsRequest.getTo()));
                return ResponseEntity.ok(new AnalyticsResponse(totalCount, new ArrayList<>(countWithDate.keySet()), new ArrayList<>(countWithDate.values())));
            }
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/un-subscribers-count")
    public ResponseEntity<?> unSubscribersCount(@ModelAttribute AnalyticsRequest analyticsRequest, Principal connectedUser){
        try{
            var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            if (analyticsRequest.getTo() == null || analyticsRequest.getFrom() == null){
                return ResponseEntity.ok(new AnalyticsResponse(analyticsService.getUnSubscribersCount(user.getWebsite())));
            }else{
                Long totalCount = analyticsService.getUnSubscribersCount(user.getWebsite());
                TreeMap<String, Long> countWithDate = analyticsService.getUnSubscribersCountByDate(user.getWebsite(), sdf.parse(analyticsRequest.getFrom()), sdf.parse(analyticsRequest.getTo()));

                return ResponseEntity.ok(new AnalyticsResponse(totalCount, new ArrayList<>(countWithDate.keySet()), new ArrayList<>(countWithDate.values())));
            }
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getStackTrace().toString()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/newsletters-count")
    public ResponseEntity<?> sentMailCount(@ModelAttribute AnalyticsRequest analyticsRequest, Principal connectedUser){
        try{
            var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            if (analyticsRequest.getTo() == null || analyticsRequest.getFrom() == null){
                return ResponseEntity.ok(new AnalyticsResponse(analyticsService.getSentEmailCount(user.getWebsite())));
            }else{
                long totalDateCount = analyticsService.getSentEmailCountAndDate(user.getWebsite(), sdf.parse(analyticsRequest.getFrom()), sdf.parse(analyticsRequest.getTo()));
                return ResponseEntity.ok(new AnalyticsResponse(totalDateCount));
            }
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getStackTrace().toString()), HttpStatus.BAD_REQUEST);
        }
    }
}

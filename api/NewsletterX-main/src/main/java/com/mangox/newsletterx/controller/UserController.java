package com.mangox.newsletterx.controller;

import com.mangox.newsletterx.model.entities.User;
import com.mangox.newsletterx.model.request.ChangePasswordRequest;
import com.mangox.newsletterx.model.responses.main.ErrorResponse;
import com.mangox.newsletterx.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@CrossOrigin
@PreAuthorize("hasAnyRole('USER')")
public class UserController {
    private final UserService userService;

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, Principal connectedUser) {
        try{
            return ResponseEntity.ok(userService.changePassword(request, connectedUser));
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/walkthrough-update", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> walkthroughUpdate(@RequestBody String requestBody, Principal connectedUser){
        try{
            var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            return ResponseEntity.ok(userService.updateWalkthrough(user, requestBody));
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

}

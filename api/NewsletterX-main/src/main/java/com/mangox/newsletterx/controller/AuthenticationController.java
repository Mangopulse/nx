package com.mangox.newsletterx.controller;

import com.mangox.newsletterx.exception.ErrorException;
import com.mangox.newsletterx.model.entities.User;
import com.mangox.newsletterx.model.enums.EnvVariables;
import com.mangox.newsletterx.model.request.*;
import com.mangox.newsletterx.model.responses.main.ErrorResponse;
import com.mangox.newsletterx.model.responses.main.SuperResponse;
import com.mangox.newsletterx.service.AuthenticationService;
import com.mangox.newsletterx.service.EnvVarsService;
import com.mangox.newsletterx.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.io.IOException;
import java.util.Objects;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin
@Slf4j
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserService userService;
    private final EnvVarsService envVarsService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) throws Exception {
        try {
            return ResponseEntity.ok(service.register(request));
        } catch (ErrorException e) {
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, "Operation Failed , if this happens again please contact the support team"), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody AuthenticationRequest request) {
        try {
            return ResponseEntity.ok(service.authenticate(request));
        } catch (DisabledException e) {
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, "Please verify your email and try again!"), HttpStatus.BAD_REQUEST);
        } catch (ErrorException e) {
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, "your email or password are not correct!"), HttpStatus.BAD_REQUEST);
        }

    }

    @PostMapping("/authenticate-admin")
    public ResponseEntity<?> authenticate(@RequestBody AdminAuthenticateRequest request){
        try{
            return ResponseEntity.ok(service.authenticateAdmin(request));
        }catch (DisabledException e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, "Please verify your email and try again!"), HttpStatus.BAD_REQUEST);
        }catch (ErrorException e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, "your email or password are not correct!"), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            service.refreshToken(request, response);
        } catch (Exception e) {
            log.error(e.getMessage());
        }

    }

    @GetMapping(value = "/confirm-email", produces = MediaType.APPLICATION_JSON_VALUE)
    public RedirectView confirmUserAccount(@RequestParam("token") String confirmationToken) {
        try {
            User websiteUsers = service.confirmEmail(confirmationToken);
            if (Objects.nonNull(websiteUsers)) {
                return new RedirectView(envVarsService.getEnvironmentVariable(EnvVariables.LINK.name())+"/status/confirmationSuccess");
            }
            return new RedirectView(envVarsService.getEnvironmentVariable(EnvVariables.LINK.name())+"/status/confirmationFailure");
        } catch (Exception e) {
            log.error(e.getMessage());
            return new RedirectView(envVarsService.getEnvironmentVariable(EnvVariables.LINK.name())+"/status/confirmationFailure");
        }
    }

    @PostMapping(value = "/forget-password", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> forgetPassword(@RequestBody ForgetPasswordRequest request){
        try{
            service.forgetPasswordEmail(request.getEmail());
            return ResponseEntity.ok(new SuperResponse());
        }catch (ErrorException e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, "Operation Failed , if this happens again please contact the support team"), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request){
        try{
            return ResponseEntity.ok(userService.resetPassword(request.getToken(), request.getPassword()));
        }catch (ErrorException e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }catch (Exception e){
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, "Operation Failed , if this happens again please contact the support team"), HttpStatus.BAD_REQUEST);
        }
    }
}

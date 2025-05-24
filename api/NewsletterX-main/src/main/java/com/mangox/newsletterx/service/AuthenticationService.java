package com.mangox.newsletterx.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mangox.newsletterx.exception.ErrorException;
import com.mangox.newsletterx.helper.AuthenticationHelper;
import com.mangox.newsletterx.helper.StaticFileHelper;
import com.mangox.newsletterx.model.entities.*;
import com.mangox.newsletterx.model.enums.EnvVariables;
import com.mangox.newsletterx.model.enums.Role;
import com.mangox.newsletterx.model.enums.TokenType;
import com.mangox.newsletterx.model.request.AdminAuthenticateRequest;
import com.mangox.newsletterx.model.request.AuthenticationRequest;
import com.mangox.newsletterx.model.request.RegisterRequest;
import com.mangox.newsletterx.model.responses.AuthenticationResponse;
import com.mangox.newsletterx.model.responses.UserResponse;
import com.mangox.newsletterx.repositories.*;
import com.mangox.newsletterx.security.JwtService;
import com.mangox.newsletterx.sender.service.SendGridService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final JwtService jwtService;
    private final SendGridService senderService;
    private final UserRepository userRepository;
    private final EnvVarsService envVarsService;
    private final SenderRepository senderRepository;
    private final WebsiteRepository websiteRepository;
    private final UserTokenRepository userTokenRepository;
    private final AuthenticationManager authenticationManager;
    private final EmailNewsletterRepository emailNewsletterRepository;
    private final ConfirmationTokenRepository confirmationTokenRepository;


    private final PasswordEncoder passwordEncoder;

    @Value("${application.main.sender}")
    private String sender;

    private static final String EMPTY_ARRAY = "[]";

    public UserResponse register(RegisterRequest request) throws Exception {
        User user = null;
        if (userRepository.existsByEmailAndEnabled(request.getEmail(), true))
            throw new ErrorException("Email is Already in use");
        else if (userRepository.existsByWebsiteAndEnabled(request.getWebsite(), true))
            throw new ErrorException("Website Link is Already in use");
        else if (userRepository.existsByEmailAndEnabled(request.getEmail(), false)) {
            Optional<User> disabledUser = userRepository.findByEmail(request.getEmail());
            if (disabledUser.isPresent()) {
                user = disabledUser.get();
                user.setWebsite(request.getWebsite());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setAdmin(false);
                user = userRepository.save(user);
            }
        } else {
            user = User.builder()
                    .email(request.getEmail())
                    .website(request.getWebsite())
                    .referral(request.getReferral() == null ? "" : request.getReferral())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(Role.USER)
                    .enabled(false)
                    .walkthrough("[{\"page\": \"NEWSLETTERS_LIST\",\"shouldShow\": \"true\"},{\"page\": \"COLLECTORS_LIST\",\"shouldShow\": \"true\"}]")
                    .build();
            user = userRepository.save(user);
        }

        if (user == null)
            throw new ErrorException("Failed to create user, please contact us");

        ConfirmationToken confirmationToken = new ConfirmationToken(user);
        confirmationToken = confirmationTokenRepository.save(confirmationToken);

        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("ConfirmationLink", envVarsService.getEnvironmentVariable(EnvVariables.LINK.name()) + "/auth/confirm-email?token=" + confirmationToken.getToken());
        System.out.println(templateModel.get("ConfirmationLink"));
        templateModel.put("Name", user.getWebsite());
        senderService.sendHtmlTemplateEmail(sender, user.getEmail(), "NewsletterX Email Confirmation", "email-confirmation.html", templateModel);

        return UserResponse.builder()
                .email(user.getEmail())
                .website(user.getWebsite())
                .enabled(user.isEnabled())
                .build();
    }

    public User confirmEmail(String token) throws Exception {
        try {
            Optional<ConfirmationToken> confirmationToken = confirmationTokenRepository.findByToken(token);
            if (confirmationToken.isPresent()) {
                Optional<User> userResult = userRepository.findById(confirmationToken.get().getUser().getId());
                if (userResult.isPresent() && !userResult.get().isEnabled()) {
                    User user = userResult.get();
                    if (userRepository.existsByWebsiteAndEnabled(user.getWebsite(), true))
                        throw new ErrorException("Website Link is Already in use ; you cant confirm this account");

                    user.setEnabled(true);
                    userRepository.save(user);
                    Sender websiteSender = senderRepository.save(new Sender(user.getWebsite()));
                    EmailNewsletter emailNewsletter = new EmailNewsletter(user.getWebsite(), "Default Basic", StaticFileHelper.getFileContent("initial-newsletter.json"));
                    emailNewsletterRepository.save(emailNewsletter);
                    Website newWebsite = websiteRepository.save(new Website(user.getWebsite(), user, websiteSender, emailNewsletter));

                    Map<String, Object> templateModel = new HashMap<>();
                    String script = "<script> (function (s, l, d, a) {\n" +
                            "      var h = d.location.protocol, td = new Date(),\n" +
                            "          dt = td.getFullYear() + '-' + (td.getMonth() + 1) + '-' + td.getDate(),\n" +
                            "          f = d.getElementsByTagName(s)[0],\n" +
                            "          e = d.getElementById(l);\n" +
                            "      if (e) return;\n" +
                            "      e = d.createElement(s); e.id = l; e.async = true; e.dataset.vendor = l; e.dataset.domain = a;\n" +
                            "      e.src = h + \"//nx-cdn.cognativex.com/scripts/nx_script.js\" + \"?v=\" + dt; e.setAttribute('data-domain', a);\n" +
                            "      f.parentNode.insertBefore(e, f);\n" +
                            "    })(\"script\", \"newsletterx\", document, \"" + user.getWebsite() + "\"); </script>";
                    templateModel.put("script", script);
                    senderService.sendHtmlTemplateEmail(sender, user.getEmail(), "NewsletterX Script Installation", "script-installation.html", templateModel);
                    senderService.sendText(sender, "mhmd.ahmad.fhs@gmail.com", "New NewsletterX Client Subscribed", "a new client signed up & confirmed with domain: " + user.getWebsite() + " using the email " + user.getEmail());
                }
                if (userResult.isPresent())
                    return userResult.get();
            }
            return null;
        } catch (Exception e) {
            throw new ErrorException("Error: Couldn't verify email");
        }

    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) throws Exception {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        if (user.isAdmin()) {
            SecretKey secretKey = AuthenticationHelper.generateKeyString();
            String currentDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
            String hashedString = AuthenticationHelper.encrypt(request.getEmail() + ";" + request.getPassword() + ";" + currentDate, secretKey);
            return AuthenticationResponse.builder()
                    .email(user.getEmail())
                    .website(null)
                    .superUser(hashedString)
                    .build();
        }

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        saveUserToken(user, jwtToken);
        Website website = websiteRepository.findByLink(user.getWebsite()).orElse(null);
        if (website == null)
            throw new ErrorException("Failed to authenticate ; no website issued for this user");
        Sender sender = senderRepository.findByWebsite(website.getLink());
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .website(user.getWebsite())
                .sender(sender.generateSender())
                .walkthrough(new ObjectMapper().readValue(Objects.nonNull(user.getWalkthrough()) ? user.getWalkthrough() : EMPTY_ARRAY, List.class))
                .build();
    }

    public AuthenticationResponse authenticateAdmin(AdminAuthenticateRequest request) throws Exception {
        SecretKey secretKey = AuthenticationHelper.generateKeyString();
        String decryptedString = AuthenticationHelper.decrypt(request.getHash(), secretKey);
        String[] splitStrings = decryptedString.split(";");
        String email = splitStrings[0];
        String password = splitStrings[1];
        String date = splitStrings[2];
        if (AuthenticationHelper.hasExceededOneMinute(date))
            throw new ErrorException("You have exceeded 1 minute to login as admin ; try again");

        var user = userRepository.findByEmail(email)
                .orElseThrow();
        user.setWebsite(request.getWebsite());
        userRepository.save(user);

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        password
                )
        );

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(user, jwtToken);
        Website website = websiteRepository.findByLink(user.getWebsite()).orElse(null);
        if (website == null)
            throw new ErrorException("Failed to authenticate ; no website issued for this user");
        Sender sender = senderRepository.findByWebsite(website.getLink());
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .website(user.getWebsite())
                .sender(sender.generateSender())
                .walkthrough(new ObjectMapper().readValue(Objects.nonNull(user.getWalkthrough()) ? user.getWalkthrough() : EMPTY_ARRAY, List.class))
                .build();
    }


    private void saveUserToken(User user, String jwtToken) {
        var token = UserToken.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        userTokenRepository.save(token);
    }

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            var user = this.userRepository.findByEmail(userEmail)
                    .orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                //revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .email(user.getEmail())
                        .website(user.getWebsite())
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }

    public void forgetPasswordEmail(String email) throws Exception {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty())
            throw new ErrorException("No user was found with the following Email");
        User user = userOptional.get();

        ConfirmationToken confirmationToken = new ConfirmationToken(user);
        confirmationToken = confirmationTokenRepository.save(confirmationToken);

        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("ConfirmationLink",  envVarsService.getEnvironmentVariable(EnvVariables.LINK.name()) + "/reset/" + confirmationToken.getToken());
        senderService.sendHtmlTemplateEmail(sender, user.getEmail(), "NewsletterX Email Confirmation", "email-forget-password.html", templateModel);
    }

}

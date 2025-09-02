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
import lombok.extern.slf4j.Slf4j;
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

@Slf4j
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

    @Value("${spring.profiles.active:}")
    private String activeProfile;

    private static final String EMPTY_ARRAY = "[]";

    /**
     * Register a new user
     * 
     * @param request
     * @return
     * @throws Exception
     */
    public UserResponse register(RegisterRequest request) throws Exception {
        validateRequest(request);
        User user = processUserRegistration(request);
        ConfirmationToken confirmationToken = createConfirmationToken(user);
        sendConfirmationEmail(user, confirmationToken);
        return buildUserResponse(user, confirmationToken);
    }

    private void validateRequest(RegisterRequest request) throws ErrorException {
        // Validate the request
        var email = request.getEmail();
        var website = request.getWebsite();

        // Validate the email - only block if enabled user exists
        if (userRepository.existsByEmailAndEnabled(email, true)) {
            throw new ErrorException("Email is Already in use");
        } else if (userRepository.existsByWebsiteAndEnabled(website, true)) {
            throw new ErrorException("Website Link is Already in use");
        }
    }

    private User processUserRegistration(RegisterRequest request) throws ErrorException {

        // Get the request parameters
        var email = request.getEmail();
        var website = request.getWebsite();
        var referral = request.getReferral();
        var password = request.getPassword();

        // Check if the email is already in use but disabled
        Optional<User> disabledUser = userRepository.findByEmail(email);
        User user;

        // If the email is already in use but disabled, update the user
        if (disabledUser.isPresent() && !disabledUser.get().isEnabled()) {
            user = updateDisabledUser(disabledUser.get(), website, password);
        } else {
            user = createNewUser(email, website, referral, password);
        }

        // If the user is not created, throw an error
        if (user == null) {
            throw new ErrorException("Failed to create user, please contact us");
        }

        return user;
    }

    private User updateDisabledUser(User user, String website, String password) {
        user.setWebsite(website);
        user.setPassword(passwordEncoder.encode(password));
        user.setAdmin(false);
        return userRepository.save(user);
    }

    private User createNewUser(String email, String website, String referral, String password) {
        User user = User.builder()
                .email(email)
                .website(website)
                .referral(referral == null ? "" : referral)
                .password(passwordEncoder.encode(password))
                .role(Role.USER)
                .enabled(false)
                .walkthrough(
                        "[{\"page\": \"NEWSLETTERS_LIST\",\"shouldShow\": \"true\"},{\"page\": \"COLLECTORS_LIST\",\"shouldShow\": \"true\"}]")
                .build();
        return userRepository.save(user);
    }

    private ConfirmationToken createConfirmationToken(User user) {
        ConfirmationToken token = new ConfirmationToken(user);
        return confirmationTokenRepository.save(token);
    }

    private void sendConfirmationEmail(User user, ConfirmationToken token) throws IOException {
        Map<String, Object> templateModel = new HashMap<>();
        String confirmationLink = envVarsService.getEnvironmentVariable(EnvVariables.LINK.name())
                + "/auth/confirm-email?token=" + token.getToken();
        templateModel.put("ConfirmationLink", confirmationLink);
        templateModel.put("Name", user.getWebsite());

        System.out.println("Confirmation link: " + confirmationLink);
        log.info("Sending confirmation email to {} for website {}", user.getEmail(), user.getWebsite());

        try {
            senderService.sendHtmlTemplateEmail(
                    sender,
                    user.getEmail(),
                    "NewsletterX Email Confirmation",
                    "email-confirmation.html",
                    templateModel);
            log.info("Confirmation email sent successfully");
        } catch (Exception e) {
            log.error("Failed to send confirmation email", e);
            throw e;
        }
    }

    private UserResponse buildUserResponse(User user, ConfirmationToken token) {
        UserResponse response = UserResponse.builder()
                .email(user.getEmail())
                .website(user.getWebsite())
                .enabled(user.isEnabled())
                .build();

        // If not in production, include the confirmation link
        if (!"prod".equalsIgnoreCase(activeProfile)) {
            try {
                String confirmationLink = envVarsService.getEnvironmentVariable(EnvVariables.LINK.name())
                        + "/auth/confirm-email?token=" + token.getToken();
                response.setConfirmationLink(confirmationLink);
            } catch (Exception e) {
                log.error("Failed to generate confirmation link", e);
            }
        }

        return response;
    }

    /**
     * Confirm the email
     * 
     * @param token
     * @return
     * @throws Exception
     */
    public User confirmEmail(String token) throws Exception {
        try {
            Optional<ConfirmationToken> confirmationToken = confirmationTokenRepository.findByToken(token);

            if (confirmationToken.isEmpty())
                return null;

            // If the user is not found, return null
            Optional<User> userResult = getUserFromToken(confirmationToken.get());
            if (userResult.isEmpty())
                return null;

            User user = userResult.get();

            // If the user is not enabled, validate the website uniqueness, enable the user,
            // initialize the website data, and send the confirmation notifications
            if (!user.isEnabled()) {
                validateWebsiteUniqueness(user);
                enableUserAccount(user);
                initializeWebsiteData(user);
                sendConfirmationNotifications(user);
            }

            return user;
        } catch (Exception e) {
            throw new ErrorException("Error: Couldn't verify email");
        }
    }

    private Optional<User> getUserFromToken(ConfirmationToken token) {
        return userRepository.findById(token.getUser().getId());
    }

    private void validateWebsiteUniqueness(User user) throws ErrorException {
        if (userRepository.existsByWebsiteAndEnabled(user.getWebsite(), true)) {
            throw new ErrorException("Website Link is Already in use; you can't confirm this account");
        }
    }

    private void enableUserAccount(User user) {
        user.setEnabled(true);
        userRepository.save(user);
    }

    private void initializeWebsiteData(User user) {
        Sender websiteSender = senderRepository.save(new Sender(user.getWebsite()));

        String newsletterContent = StaticFileHelper.getFileContent("initial-newsletter.json");
        EmailNewsletter emailNewsletter = new EmailNewsletter(user.getWebsite(), "Default Basic", newsletterContent);
        emailNewsletterRepository.save(emailNewsletter);

        Website newWebsite = new Website(user.getWebsite(), user, websiteSender, emailNewsletter);
        websiteRepository.save(newWebsite);
    }

    private void sendConfirmationNotifications(User user) throws IOException {
        Map<String, Object> templateModel = new HashMap<>();
        String script = generateScript(user.getWebsite());
        templateModel.put("script", script);

        senderService.sendHtmlTemplateEmail(
                sender,
                user.getEmail(),
                "NewsletterX Script Installation",
                "script-installation.html",
                templateModel);

        senderService.sendText(
                sender,
                "mhmd.ahmad.fhs@gmail.com",
                "New NewsletterX Client Subscribed",
                "A new client signed up & confirmed with domain: " + user.getWebsite() +
                        " using the email " + user.getEmail());
    }

    private String generateScript(String website) {
        return "<script> (function (s, l, d, a) {\n" +
                "  var h = d.location.protocol, td = new Date(),\n" +
                "      dt = td.getFullYear() + '-' + (td.getMonth() + 1) + '-' + td.getDate(),\n" +
                "      f = d.getElementsByTagName(s)[0],\n" +
                "      e = d.getElementById(l);\n" +
                "  if (e) return;\n" +
                "  e = d.createElement(s); e.id = l; e.async = true; e.dataset.vendor = l; e.dataset.domain = a;\n" +
                "  e.src = h + \"//nx-cdn.cognativex.com/scripts/nx_script.js\" + \"?v=\" + dt; e.setAttribute('data-domain', a);\n"
                +
                "  f.parentNode.insertBefore(e, f);\n" +
                "})(\"script\", \"newsletterx\", document, \"" + website + "\"); </script>";
    }

    /**
     * Authenticate a user
     * 
     * @param request Authentication request containing email and password
     * @return AuthenticationResponse with appropriate tokens and user data
     * @throws Exception if authentication fails or user data is invalid
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request) throws Exception {

        authenticateCredentials(request.getEmail(), request.getPassword());

        User user = getUserByEmail(request.getEmail());

        if (user.isAdmin()) {
            return handleAdminAuthentication(user, request);
        }

        return handleRegularUserAuthentication(user);
    }

    private void authenticateCredentials(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));
    }

    private User getUserByEmail(String email) throws ErrorException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ErrorException("User not found"));
    }

    private AuthenticationResponse handleAdminAuthentication(User user, AuthenticationRequest request)
            throws Exception {
        SecretKey secretKey = AuthenticationHelper.generateKeyString();

        // Generate a hashed string with the email, password, and current date
        String currentDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));

        // Encrypt the string with the secret key
        String hashedString = AuthenticationHelper.encrypt(
                request.getEmail() + ";" + request.getPassword() + ";" + currentDate,
                secretKey);

        // Return the authentication response
        return AuthenticationResponse.builder()
                .email(user.getEmail())
                .website(null)
                .superUser(hashedString)
                .build();
    }

    private AuthenticationResponse handleRegularUserAuthentication(User user) throws Exception {

        // Generate a JWT token for the user
        String jwtToken = jwtService.generateToken(user);

        // Generate a refresh token for the user
        String refreshToken = jwtService.generateRefreshToken(user);

        // Save the user token
        saveUserToken(user, jwtToken);

        Website website = validateAndGetWebsite(user);
        Sender sender = senderRepository.findByWebsite(website.getLink());

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .website(user.getWebsite())
                .sender(sender.generateSender())
                .walkthrough(parseWalkthrough(user.getWalkthrough()))
                .build();
    }

    private Website validateAndGetWebsite(User user) throws ErrorException {
        return websiteRepository.findByLink(user.getWebsite())
                .orElseThrow(() -> new ErrorException("Failed to authenticate; no website issued for this user"));
    }

    // Parse the walkthrough string into a list of objects
    private List<Object> parseWalkthrough(String walkthrough) throws Exception {
        return new ObjectMapper().readValue(
                Objects.nonNull(walkthrough) ? walkthrough : EMPTY_ARRAY,
                List.class);
    }

    /**
     * Authenticate an admin user
     * 
     * @param request Admin authenticate request containing hash
     * @return AuthenticationResponse with appropriate tokens and user data
     * @throws Exception if authentication fails or user data is invalid
     */
    public AuthenticationResponse authenticateAdmin(AdminAuthenticateRequest request) throws Exception {

        AdminCredentials credentials = decryptAdminCredentials(request.getHash());
        validateAdminCredentials(credentials);

        // Authenticate and get user
        authenticateCredentials(credentials.getEmail(), credentials.getPassword());
        User user = getUserByEmail(credentials.getEmail());

        // Update user website and handle authentication
        updateUserWebsite(user, request.getWebsite());
        return handleRegularUserAuthentication(user);
    }

    private AdminCredentials decryptAdminCredentials(String hash) throws Exception {
        SecretKey secretKey = AuthenticationHelper.generateKeyString();
        String decryptedString = AuthenticationHelper.decrypt(hash, secretKey);
        String[] splitStrings = decryptedString.split(";");

        if (splitStrings.length != 3) {
            throw new ErrorException("Invalid admin credentials format");
        }

        return new AdminCredentials(
                splitStrings[0], // email
                splitStrings[1], // password
                splitStrings[2] // date
        );
    }

    private void validateAdminCredentials(AdminCredentials credentials) throws ErrorException {
        if (AuthenticationHelper.hasExceededOneMinute(credentials.getDate())) {
            throw new ErrorException("You have exceeded 1 minute to login as admin; try again");
        }
    }

    private void updateUserWebsite(User user, String website) {
        user.setWebsite(website);
        userRepository.save(user);
    }

    @lombok.Value
    private static class AdminCredentials {
        String email;
        String password;
        String date;
    }

    /**
     * Refresh the authentication token
     * 
     * @param request  HTTP request containing the refresh token
     * @param response HTTP response to write the new tokens to
     * @throws IOException if response writing fails
     */
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String refreshToken = extractRefreshToken(request);
        if (refreshToken == null) {
            return;
        }

        try {
            final String userEmail = jwtService.extractUsername(refreshToken);
            if (userEmail == null) {
                return;
            }

            User user = getUserByEmail(userEmail);
            if (!jwtService.isTokenValid(refreshToken, user)) {
                return;
            }

            AuthenticationResponse authResponse = generateRefreshResponse(user, refreshToken);
            writeResponse(response, authResponse);
        } catch (ErrorException e) {
            // Log error if needed
            return;
        }
    }

    private String extractRefreshToken(HttpServletRequest request) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.substring(7);
    }

    private AuthenticationResponse generateRefreshResponse(User user, String refreshToken) {
        String accessToken = jwtService.generateToken(user);
        saveUserToken(user, accessToken);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .website(user.getWebsite())
                .build();
    }

    private void writeResponse(HttpServletResponse response, AuthenticationResponse authResponse) throws IOException {
        new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
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

    /**
     * Send a password reset email to the user
     * 
     * @param email The email address of the user
     * @return UserResponse containing the reset link in debug mode
     * @throws Exception if user not found or email sending fails
     */
    public UserResponse forgetPasswordEmail(String email) throws Exception {
        User user = findUserByEmail(email);
        ConfirmationToken token = createConfirmationToken(user);
        sendPasswordResetEmail(user, token);

        UserResponse response = UserResponse.builder()
                .email(user.getEmail())
                .website(user.getWebsite())
                .enabled(user.isEnabled())
                .build();

        // If not in production, include the reset link
        if (!"prod".equalsIgnoreCase(activeProfile)) {
            try {
                String resetLink = buildResetLink(token.getToken());
                response.setConfirmationLink(resetLink);
            } catch (Exception e) {
                log.error("Failed to generate reset link", e);
            }
        }

        return response;
    }

    private User findUserByEmail(String email) throws ErrorException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ErrorException("No user was found with the following Email"));
    }

    private void sendPasswordResetEmail(User user, ConfirmationToken token) throws IOException {
        Map<String, Object> templateModel = new HashMap<>();
        String resetLink = buildResetLink(token.getToken());
        templateModel.put("ConfirmationLink", resetLink);

        senderService.sendHtmlTemplateEmail(
                sender,
                user.getEmail(),
                "NewsletterX Email Confirmation",
                "email-forget-password.html",
                templateModel);
    }

    private String buildResetLink(String token) {
        return envVarsService.getEnvironmentVariable(EnvVariables.LINK.name()) + "/reset/" + token;
    }

}

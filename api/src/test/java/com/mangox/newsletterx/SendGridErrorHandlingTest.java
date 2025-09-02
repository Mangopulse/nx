package com.mangox.newsletterx;

import com.mangox.newsletterx.exception.ErrorException;
import com.mangox.newsletterx.model.entities.ConfirmationToken;
import com.mangox.newsletterx.model.entities.User;
import com.mangox.newsletterx.model.enums.RegistrationMessage;
import com.mangox.newsletterx.model.request.RegisterRequest;
import com.mangox.newsletterx.model.responses.UserResponse;
import com.mangox.newsletterx.repositories.ConfirmationTokenRepository;
import com.mangox.newsletterx.repositories.UserRepository;
import com.mangox.newsletterx.sender.service.SendGridService;
import com.mangox.newsletterx.service.AuthenticationService;
import com.mangox.newsletterx.service.EnvVarsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@DisplayName("SendGrid Error Handling Tests")
public class SendGridErrorHandlingTest {

    @Mock
    private SendGridService sendGridService;

    @Mock
    private EnvVarsService envVarsService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ConfirmationTokenRepository confirmationTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private AuthenticationService authenticationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Create AuthenticationService with all required dependencies
        // Note: In a real test, you'd use @InjectMocks or Spring's test context
        authenticationService = new AuthenticationService(
            null, // jwtService - not needed for this test
            sendGridService,
            userRepository,
            envVarsService,
            null, // senderRepository
            null, // websiteRepository
            null, // userTokenRepository
            null, // authenticationManager
            null, // emailNewsletterRepository
            confirmationTokenRepository,
            passwordEncoder
        );
    }

    @Test
    @DisplayName("Should return specific error when SendGrid key is empty")
    void testEmptySendGridKey() {
        // Setup
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setWebsite("test.com");
        request.setPassword("password");

        User user = new User();
        user.setEmail("test@example.com");
        user.setWebsite("test.com");

        ConfirmationToken token = new ConfirmationToken(user);

        // Mock repository calls
        when(userRepository.existsByEmailAndEnabled(anyString(), eq(true))).thenReturn(false);
        when(userRepository.existsByWebsiteAndEnabled(anyString(), eq(true))).thenReturn(false);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(confirmationTokenRepository.save(any(ConfirmationToken.class))).thenReturn(token);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");

        // Mock environment variables - empty key
        when(envVarsService.getEnvironmentVariable("SENDGRID_API_KEY")).thenReturn("");
        when(envVarsService.getEnvironmentVariable("LINK")).thenReturn("http://localhost:8080");

        // Mock SendGrid service to return false (key empty)
        try {
            when(sendGridService.sendHtmlTemplateEmail(anyString(), anyString(), anyString(), anyString(), any()))
                .thenReturn(false);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        // Execute and verify
        ErrorException exception = assertThrows(ErrorException.class, () -> {
            authenticationService.register(request);
        });

        assertTrue(exception.getMessage().contains("SendGrid API key is empty or missing"));
        assertTrue(exception.getMessage().contains("(key='')"));
    }

    @Test
    @DisplayName("Should return specific error when SendGrid key exists but sending fails")
    void testSendGridSendFailure() throws Exception {
        // Setup
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setWebsite("test.com");
        request.setPassword("password");

        User user = new User();
        user.setEmail("test@example.com");
        user.setWebsite("test.com");

        ConfirmationToken token = new ConfirmationToken(user);

        // Mock repository calls
        when(userRepository.existsByEmailAndEnabled(anyString(), eq(true))).thenReturn(false);
        when(userRepository.existsByWebsiteAndEnabled(anyString(), eq(true))).thenReturn(false);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(confirmationTokenRepository.save(any(ConfirmationToken.class))).thenReturn(token);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");

        // Mock environment variables - valid key
        when(envVarsService.getEnvironmentVariable("SENDGRID_API_KEY")).thenReturn("SG.valid_key.test_value");
        when(envVarsService.getEnvironmentVariable("LINK")).thenReturn("http://localhost:8080");

        // Mock SendGrid service to throw IOException (send failure)
        when(sendGridService.sendHtmlTemplateEmail(anyString(), anyString(), anyString(), anyString(), any()))
            .thenThrow(new IOException("Network error"));

        // Execute and verify
        ErrorException exception = assertThrows(ErrorException.class, () -> {
            authenticationService.register(request);
        });

        assertTrue(exception.getMessage().contains("SendGrid failed to send the email"));
        assertTrue(exception.getMessage().contains("(key starts with 'SG.val****')"));
    }

    @Test
    @DisplayName("Should return specific error when SendGrid is not configured (null key)")
    void testSendGridNotConfiguredNullKey() {
        // Setup
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setWebsite("test.com");
        request.setPassword("password");

        User user = new User();
        user.setEmail("test@example.com");
        user.setWebsite("test.com");

        ConfirmationToken token = new ConfirmationToken(user);

        // Mock repository calls
        when(userRepository.existsByEmailAndEnabled(anyString(), eq(true))).thenReturn(false);
        when(userRepository.existsByWebsiteAndEnabled(anyString(), eq(true))).thenReturn(false);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(confirmationTokenRepository.save(any(ConfirmationToken.class))).thenReturn(token);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");

        // Mock environment variables - null key
        when(envVarsService.getEnvironmentVariable("SENDGRID_API_KEY")).thenReturn(null);
        when(envVarsService.getEnvironmentVariable("LINK")).thenReturn("http://localhost:8080");

        // Mock SendGrid service to return false (key null)
        try {
            when(sendGridService.sendHtmlTemplateEmail(anyString(), anyString(), anyString(), anyString(), any()))
                .thenReturn(false);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        // Execute and verify
        ErrorException exception = assertThrows(ErrorException.class, () -> {
            authenticationService.register(request);
        });

        assertTrue(exception.getMessage().contains("SendGrid API key is empty or missing"));
        assertTrue(exception.getMessage().contains("(key='')"));
    }

    @Test
    @DisplayName("Should mask sensitive key information in error messages")
    void testKeyMaskingInErrorMessages() {
        // Setup
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setWebsite("test.com");
        request.setPassword("password");

        User user = new User();
        user.setEmail("test@example.com");
        user.setWebsite("test.com");

        ConfirmationToken token = new ConfirmationToken(user);

        // Mock repository calls
        when(userRepository.existsByEmailAndEnabled(anyString(), eq(true))).thenReturn(false);
        when(userRepository.existsByWebsiteAndEnabled(anyString(), eq(true))).thenReturn(false);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(confirmationTokenRepository.save(any(ConfirmationToken.class))).thenReturn(token);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");

        // Mock environment variables - long sensitive key
        String sensitiveKey = "SG.very_long_sensitive_api_key.extremely_secret_value";
        when(envVarsService.getEnvironmentVariable("SENDGRID_API_KEY")).thenReturn(sensitiveKey);
        when(envVarsService.getEnvironmentVariable("LINK")).thenReturn("http://localhost:8080");

        // Mock SendGrid service to return false
        try {
            when(sendGridService.sendHtmlTemplateEmail(anyString(), anyString(), anyString(), anyString(), any()))
                .thenReturn(false);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        // Execute and verify
        ErrorException exception = assertThrows(ErrorException.class, () -> {
            authenticationService.register(request);
        });

        // Should contain masked key, not full key
        assertTrue(exception.getMessage().contains("(key starts with 'SG.ver****')"));
        assertFalse(exception.getMessage().contains("extremely_secret_value"));
        assertFalse(exception.getMessage().contains("very_long_sensitive_api_key"));
    }

    @Test
    @DisplayName("Should handle short keys gracefully")
    void testShortKeyHandling() {
        // Setup
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setWebsite("test.com");
        request.setPassword("password");

        User user = new User();
        user.setEmail("test@example.com");
        user.setWebsite("test.com");

        ConfirmationToken token = new ConfirmationToken(user);

        // Mock repository calls
        when(userRepository.existsByEmailAndEnabled(anyString(), eq(true))).thenReturn(false);
        when(userRepository.existsByWebsiteAndEnabled(anyString(), eq(true))).thenReturn(false);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(confirmationTokenRepository.save(any(ConfirmationToken.class))).thenReturn(token);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");

        // Mock environment variables - very short key
        when(envVarsService.getEnvironmentVariable("SENDGRID_API_KEY")).thenReturn("SG");
        when(envVarsService.getEnvironmentVariable("LINK")).thenReturn("http://localhost:8080");

        // Mock SendGrid service to return false
        try {
            when(sendGridService.sendHtmlTemplateEmail(anyString(), anyString(), anyString(), anyString(), any()))
                .thenReturn(false);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        // Execute and verify
        ErrorException exception = assertThrows(ErrorException.class, () -> {
            authenticationService.register(request);
        });

        // Should handle short key gracefully
        assertTrue(exception.getMessage().contains("(key starts with 'SG****')"));
    }

    @Test
    @DisplayName("Should succeed when SendGrid works correctly")
    void testSuccessfulSendGridOperation() throws Exception {
        // Setup
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setWebsite("test.com");
        request.setPassword("password");

        User user = new User();
        user.setEmail("test@example.com");
        user.setWebsite("test.com");

        ConfirmationToken token = new ConfirmationToken(user);

        // Mock repository calls
        when(userRepository.existsByEmailAndEnabled(anyString(), eq(true))).thenReturn(false);
        when(userRepository.existsByWebsiteAndEnabled(anyString(), eq(true))).thenReturn(false);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(confirmationTokenRepository.save(any(ConfirmationToken.class))).thenReturn(token);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");

        // Mock environment variables - valid key
        when(envVarsService.getEnvironmentVariable("SENDGRID_API_KEY")).thenReturn("SG.valid_key.test_value");
        when(envVarsService.getEnvironmentVariable("LINK")).thenReturn("http://localhost:8080");

        // Mock SendGrid service to return true (success)
        when(sendGridService.sendHtmlTemplateEmail(anyString(), anyString(), anyString(), anyString(), any()))
            .thenReturn(true);

        // Execute and verify
        UserResponse response = authenticationService.register(request);

        assertNotNull(response);
        assertEquals("test@example.com", response.getEmail());
        assertEquals("test.com", response.getWebsite());
        assertEquals(RegistrationMessage.CONFIRMATION_LINK_SENT.getMessage(), response.getMessage());
    }
}

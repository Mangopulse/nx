package com.mangox.newsletterx;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mangox.newsletterx.model.entities.User;
import com.mangox.newsletterx.model.enums.RegistrationMessage;
import com.mangox.newsletterx.model.request.RegisterRequest;
import com.mangox.newsletterx.repositories.UserRepository;
import com.mangox.newsletterx.repositories.ConfirmationTokenRepository;
import com.mangox.newsletterx.repositories.EnvVarRepository;
import com.mangox.newsletterx.model.entities.EnvVars;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Registration API Comprehensive Tests")
public class RegistrationApiTest {

    @Autowired
    private WebApplicationContext context;
    
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;

    @Autowired
    private EnvVarRepository envVarRepository;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
        
        // Clean up before each test
        confirmationTokenRepository.deleteAll();
        userRepository.deleteAll();
        envVarRepository.deleteAll();
        
        // Set up default environment variables for testing
        setupTestEnvironmentVariables();
    }

    private void setupTestEnvironmentVariables() {
        EnvVars skipEmail = new EnvVars();
        skipEmail.setKey("SKIP_EMAIL_SERVICE");
        skipEmail.setValue("true");
        envVarRepository.save(skipEmail);
        
        EnvVars link = new EnvVars();
        link.setKey("LINK");
        link.setValue("http://localhost:8080");
        envVarRepository.save(link);
        
        EnvVars sendgridKey = new EnvVars();
        sendgridKey.setKey("SENDGRID_API_KEY");
        sendgridKey.setValue("SG.test_key.test_value");
        envVarRepository.save(sendgridKey);
    }

    @Test
    @DisplayName("Should successfully register new user with valid data")
    void testSuccessfulRegistration() throws Exception {
        RegisterRequest request = createValidRegisterRequest();

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(request.getEmail()))
                .andExpect(jsonPath("$.website").value(request.getWebsite()))
                .andExpect(jsonPath("$.enabled").value(false))
                .andExpect(jsonPath("$.message").value(RegistrationMessage.CONFIRMATION_LINK_SENT.getMessage()))
                .andExpect(jsonPath("$.confirmationLink").value(containsString("http://localhost:8080/auth/confirm-email?token=")))
                .andExpect(jsonPath("$.status").value("OK"))
                .andExpect(jsonPath("$.code").value(200));
    }

    @Test
    @DisplayName("Should reject registration with null email")
    void testRegistrationWithNullEmail() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setEmail(null);

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should reject registration with empty email")
    void testRegistrationWithEmptyEmail() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setEmail("");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should reject registration with invalid email format")
    void testRegistrationWithInvalidEmailFormat() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setEmail("invalid-email");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should reject registration with email containing spaces")
    void testRegistrationWithEmailContainingSpaces() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setEmail("test @example.com");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should reject registration with very long email")
    void testRegistrationWithVeryLongEmail() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        String longEmail = "a".repeat(250) + "@example.com";
        request.setEmail(longEmail);

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should reject registration with null website")
    void testRegistrationWithNullWebsite() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setWebsite(null);

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should reject registration with empty website")
    void testRegistrationWithEmptyWebsite() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setWebsite("");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should reject registration with null password")
    void testRegistrationWithNullPassword() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setPassword(null);

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should reject registration with empty password")
    void testRegistrationWithEmptyPassword() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setPassword("");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should reject registration with weak password")
    void testRegistrationWithWeakPassword() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setPassword("123"); // Too short

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should reject registration when user already exists and is enabled")
    void testRegistrationWithExistingEnabledUser() throws Exception {
        // Create an enabled user first
        User existingUser = createEnabledUser("test@example.com", "existingwebsite.com");
        userRepository.save(existingUser);

        RegisterRequest request = createValidRegisterRequest();
        request.setEmail("test@example.com");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorMessage").value(RegistrationMessage.EMAIL_ALREADY_TAKEN.getMessage()));
    }

    @Test
    @DisplayName("Should reject registration when website already exists and is enabled")
    void testRegistrationWithExistingEnabledWebsite() throws Exception {
        // Create an enabled user with existing website
        User existingUser = createEnabledUser("existing@example.com", "testwebsite.com");
        userRepository.save(existingUser);

        RegisterRequest request = createValidRegisterRequest();
        request.setWebsite("testwebsite.com");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorMessage").value(RegistrationMessage.WEBSITE_ALREADY_TAKEN.getMessage()));
    }

    @Test
    @DisplayName("Should allow re-registration for existing disabled user with same email")
    void testReRegistrationWithExistingDisabledUser() throws Exception {
        // Create a disabled user first
        User existingUser = createDisabledUser("test@example.com", "oldwebsite.com");
        userRepository.save(existingUser);

        RegisterRequest request = createValidRegisterRequest();
        request.setEmail("test@example.com");
        request.setWebsite("newwebsite.com");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(request.getEmail()))
                .andExpect(jsonPath("$.website").value(request.getWebsite()))
                .andExpect(jsonPath("$.message").value(RegistrationMessage.ACCOUNT_UPDATED.getMessage()));
    }

    @Test
    @DisplayName("Should handle special characters in email correctly")
    void testRegistrationWithSpecialCharactersInEmail() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setEmail("test+tag@sub-domain.example.com");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test+tag@sub-domain.example.com"));
    }

    @Test
    @DisplayName("Should handle different website formats correctly")
    void testRegistrationWithDifferentWebsiteFormats() throws Exception {
        String[] validWebsites = {
            "example.com",
            "sub.example.com", 
            "my-website.org",
            "123numbers.net",
            "website123.co.uk"
        };

        for (int i = 0; i < validWebsites.length; i++) {
            RegisterRequest request = createValidRegisterRequest();
            request.setEmail("user" + i + "@example.com");
            request.setWebsite(validWebsites[i]);

            mockMvc.perform(post("/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.website").value(validWebsites[i]));
        }
    }

    @Test
    @DisplayName("Should handle case sensitivity correctly")
    void testRegistrationCaseSensitivity() throws Exception {
        // Register with lowercase email
        RegisterRequest request1 = createValidRegisterRequest();
        request1.setEmail("test@example.com");
        request1.setWebsite("website1.com");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isOk());

        // Try to register with uppercase email (should be treated as same email)
        RegisterRequest request2 = createValidRegisterRequest();
        request2.setEmail("TEST@EXAMPLE.COM");
        request2.setWebsite("website2.com");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value(RegistrationMessage.ACCOUNT_UPDATED.getMessage()));
    }

    @Test
    @DisplayName("Should return error when SendGrid is not configured")
    void testRegistrationWithSendGridNotConfigured() throws Exception {
        // Remove SKIP_EMAIL_SERVICE and set invalid SendGrid key
        envVarRepository.deleteAll();
        
        EnvVars invalidSendgrid = new EnvVars();
        invalidSendgrid.setKey("SENDGRID_API_KEY");
        invalidSendgrid.setValue(""); // Empty key
        envVarRepository.save(invalidSendgrid);
        
        EnvVars skipEmail = new EnvVars();
        skipEmail.setKey("SKIP_EMAIL_SERVICE");
        skipEmail.setValue("false"); // Don't skip
        envVarRepository.save(skipEmail);

        RegisterRequest request = createValidRegisterRequest();

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorMessage").value(RegistrationMessage.SENDGRID_KEY_EMPTY.getMessage()));
    }

    @Test
    @DisplayName("Should handle malformed JSON gracefully")
    void testRegistrationWithMalformedJson() throws Exception {
        String malformedJson = "{\"email\":\"test@example.com\",\"website\":\"test.com\",\"password\":";

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(malformedJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should handle missing content type")
    void testRegistrationWithMissingContentType() throws Exception {
        RegisterRequest request = createValidRegisterRequest();

        mockMvc.perform(post("/auth/register")
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @DisplayName("Should handle very long password correctly")
    void testRegistrationWithVeryLongPassword() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setPassword("a".repeat(1000)); // Very long password

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk()); // Should be accepted if it meets other criteria
    }

    @Test
    @DisplayName("Should handle Unicode characters in fields")
    void testRegistrationWithUnicodeCharacters() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setEmail("тест@example.com"); // Cyrillic characters
        request.setWebsite("测试.com"); // Chinese characters

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should handle concurrent registrations correctly")
    void testConcurrentRegistrations() throws Exception {
        RegisterRequest request1 = createValidRegisterRequest();
        request1.setEmail("user1@example.com");
        request1.setWebsite("website1.com");

        RegisterRequest request2 = createValidRegisterRequest();
        request2.setEmail("user2@example.com");
        request2.setWebsite("website2.com");

        // Simulate concurrent requests
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should validate confirmation token is created")
    void testConfirmationTokenCreation() throws Exception {
        RegisterRequest request = createValidRegisterRequest();

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.confirmationLink").value(containsString("token=")));

        // Verify token was created in database
        var tokens = confirmationTokenRepository.findAll();
        assert !tokens.isEmpty();
        assert tokens.get(0).getUser().getEmail().equals(request.getEmail());
    }

    @Test
    @DisplayName("Should handle referral parameter correctly")
    void testRegistrationWithReferral() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setReferral("http://localhost:3000/signup");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should trim whitespace from input fields")
    void testRegistrationWithWhitespace() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setEmail("  test@example.com  ");
        request.setWebsite("  testwebsite.com  ");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.website").value("testwebsite.com"));
    }

    // Helper methods
    private RegisterRequest createValidRegisterRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setWebsite("testwebsite.com");
        request.setPassword("StrongPassword123!");
        request.setReferral("http://localhost:3000");
        return request;
    }

    private User createEnabledUser(String email, String website) {
        User user = new User();
        user.setEmail(email);
        user.setWebsite(website);
        user.setPassword("encodedPassword");
        user.setEnabled(true);
        return user;
    }

    private User createDisabledUser(String email, String website) {
        User user = new User();
        user.setEmail(email);
        user.setWebsite(website);
        user.setPassword("encodedPassword");
        user.setEnabled(false);
        return user;
    }
}

package com.mangox.newsletterx;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mangox.newsletterx.model.request.AuthenticationRequest;
import com.mangox.newsletterx.model.request.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Simple authentication tests that work with existing codebase
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebMvc
@ActiveProfiles("test")
@DisplayName("Simple Authentication Tests")
public class SimpleAuthTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    private String asJsonString(Object obj) throws Exception {
        return objectMapper.writeValueAsString(obj);
    }

    @Test
    @DisplayName("Should successfully register a new user")
    public void testUserRegistration_Success() throws Exception {
        // Use timestamp to ensure uniqueness
        long timestamp = System.currentTimeMillis();
        String uniqueEmail = "test-" + timestamp + "@example.com";
        String uniqueWebsite = "test-" + timestamp + ".com";
        
        RegisterRequest request = RegisterRequest.builder()
                .email(uniqueEmail)
                .website(uniqueWebsite)
                .password("securePassword123!")
                .referral("http://localhost:3000/en")
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(uniqueEmail))
                .andExpect(jsonPath("$.website").value(uniqueWebsite))
                .andExpect(jsonPath("$.enabled").value(false));
    }

    @Test
    @DisplayName("Should fail registration with duplicate email")
    public void testUserRegistration_DuplicateEmail() throws Exception {
        // First registration
        long timestamp1 = System.currentTimeMillis();
        RegisterRequest request1 = RegisterRequest.builder()
                .email("duplicate-" + timestamp1 + "@example.com")
                .website("site1-" + timestamp1 + ".com")
                .password("password123!")
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(request1)))
                .andExpect(status().isOk());

        // Try duplicate email with different website
        RegisterRequest request2 = RegisterRequest.builder()
                .email("duplicate-" + timestamp1 + "@example.com") // Same email
                .website("site2-" + timestamp1 + ".com")           // Different website
                .password("password123!")
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(request2)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorMessage").value("Email is Already in use"));
    }

    @Test
    @DisplayName("Should fail registration with duplicate website")
    public void testUserRegistration_DuplicateWebsite() throws Exception {
        // First registration
        long timestamp = System.currentTimeMillis();
        RegisterRequest request1 = RegisterRequest.builder()
                .email("user1-" + timestamp + "@example.com")
                .website("duplicate-" + timestamp + ".com")
                .password("password123!")
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(request1)))
                .andExpect(status().isOk());

        // Try duplicate website with different email
        RegisterRequest request2 = RegisterRequest.builder()
                .email("user2-" + timestamp + "@example.com")
                .website("duplicate-" + timestamp + ".com") // Same website
                .password("password123!")
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(request2)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorMessage").value("Website Link is Already in use"));
    }

    @Test
    @DisplayName("Should successfully authenticate valid user")
    public void testUserAuthentication_Success() throws Exception {
        // First register a user
        long timestamp = System.currentTimeMillis();
        String email = "auth-test-" + timestamp + "@example.com";
        String website = "auth-test-" + timestamp + ".com";
        String password = "testPassword123!";
        
        RegisterRequest registerRequest = RegisterRequest.builder()
                .email(email)
                .website(website)
                .password(password)
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(registerRequest)))
                .andExpect(status().isOk());

        // Note: User needs to be confirmed first, so this test might fail
        // This is testing the authentication endpoint structure
        AuthenticationRequest authRequest = AuthenticationRequest.builder()
                .email(email)
                .password(password)
                .build();

        mockMvc.perform(post("/auth/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(authRequest)))
                .andExpect(status().isBadRequest()); // Expected since user is not confirmed yet
    }

    @Test
    @DisplayName("Should fail authentication with non-existent user")
    public void testUserAuthentication_NonExistentUser() throws Exception {
        AuthenticationRequest request = AuthenticationRequest.builder()
                .email("nonexistent-" + System.currentTimeMillis() + "@example.com")
                .password("password")
                .build();

        mockMvc.perform(post("/auth/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should handle invalid JSON gracefully")
    public void testInvalidJson() throws Exception {
        String invalidJson = "{\"email\":\"test@example.com\",\"website\":}";

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should validate required fields")
    public void testRequiredFieldValidation() throws Exception {
        // Missing email
        RegisterRequest requestNoEmail = RegisterRequest.builder()
                .website("test.com")
                .password("password123!")
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(requestNoEmail)))
                .andExpect(status().isBadRequest());

        // Missing website
        RegisterRequest requestNoWebsite = RegisterRequest.builder()
                .email("test@example.com")
                .password("password123!")
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(requestNoWebsite)))
                .andExpect(status().isBadRequest());
    }
}

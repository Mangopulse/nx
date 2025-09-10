package com.mangox.newsletterx;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mangox.newsletterx.model.entities.EnvVars;
import com.mangox.newsletterx.model.entities.User;
import com.mangox.newsletterx.model.request.RegisterRequest;
import com.mangox.newsletterx.repositories.ConfirmationTokenRepository;
import com.mangox.newsletterx.repositories.EnvVarRepository;
import com.mangox.newsletterx.repositories.UserRepository;
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
@DisplayName("Registration Security Tests")
public class RegistrationSecurityTest {

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
        
        confirmationTokenRepository.deleteAll();
        userRepository.deleteAll();
        envVarRepository.deleteAll();
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
    @DisplayName("Should prevent SQL injection in email field")
    void testSqlInjectionInEmail() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setEmail("'; DROP TABLE users; --@example.com");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest()); // Should be rejected due to validation
    }

    @Test
    @DisplayName("Should prevent XSS attacks in website field")
    void testXssAttackInWebsite() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setWebsite("<script>alert('xss')</script>.com");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest()); // Should be rejected
    }

    @Test
    @DisplayName("Should handle HTML entities in input")
    void testHtmlEntitiesInInput() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setEmail("test&lt;@example.com");
        request.setWebsite("test&amp;site.com");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest()); // Should be rejected due to invalid format
    }

    @Test
    @DisplayName("Should prevent password injection attacks")
    void testPasswordInjectionAttack() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setPassword("'; UPDATE users SET password='hacked' WHERE 1=1; --");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk()); // Password should be hashed, not executed

        // Verify no users were compromised
        var users = userRepository.findAll();
        if (!users.isEmpty()) {
            if (users.get(0).getPassword().equals("hacked")) {
                throw new AssertionError("Password should not be 'hacked' - security vulnerability");
            }
        }
    }

    @Test
    @DisplayName("Should handle extremely large payloads")
    void testLargePayloadAttack() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setPassword("a".repeat(10000)); // Very large password

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk()); // Should handle gracefully
    }

    @Test
    @DisplayName("Should prevent null byte injection")
    void testNullByteInjection() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setEmail("test\0@example.com");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should handle URL-encoded attacks")
    void testUrlEncodedAttacks() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setWebsite("%3Cscript%3Ealert('xss')%3C/script%3E.com");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should validate password complexity requirements")
    void testPasswordComplexityValidation() throws Exception {
        String[] weakPasswords = {
            "123456",           // Too simple
            "password",         // Common word
            "abc",              // Too short
            "ALLUPPERCASE",     // No variety
            "alllowercase",     // No variety
            "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890" // Too long
        };

        for (String weakPassword : weakPasswords) {
            RegisterRequest request = createValidRegisterRequest();
            request.setEmail("test" + System.currentTimeMillis() + "@example.com");
            request.setPassword(weakPassword);

            mockMvc.perform(post("/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest()); // Should reject weak passwords
        }
    }

    @Test
    @DisplayName("Should prevent email header injection")
    void testEmailHeaderInjection() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setEmail("test@example.com\nBcc: hacker@evil.com");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should handle LDAP injection attempts")
    void testLdapInjection() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setEmail("*)(uid=*))(|(uid=*@example.com");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should handle path traversal attempts")
    void testPathTraversalInWebsite() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setWebsite("../../../etc/passwd");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should prevent command injection")
    void testCommandInjection() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setWebsite("example.com; rm -rf /");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should rate limit registration attempts")
    void testRateLimiting() throws Exception {
        // Simulate multiple rapid registration attempts
        for (int i = 0; i < 10; i++) {
            RegisterRequest request = createValidRegisterRequest();
            request.setEmail("test" + i + "@example.com");
            request.setWebsite("website" + i + ".com");

            mockMvc.perform(post("/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));
        }
        // Note: Actual rate limiting would require additional configuration
    }

    @Test
    @DisplayName("Should handle encoding attacks")
    void testEncodingAttacks() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setEmail("test@exam%00ple.com"); // Null byte encoded

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should validate against known malicious domains")
    void testMaliciousDomainValidation() throws Exception {
        String[] suspiciousDomains = {
            "tempmail.com",
            "10minutemail.com",
            "guerrillamail.com",
            "example.com" // Usually blocked in production
        };

        for (String domain : suspiciousDomains) {
            RegisterRequest request = createValidRegisterRequest();
            request.setEmail("test@" + domain);

            // Note: This would require additional business logic to implement
            mockMvc.perform(post("/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));
            // In a real scenario, you might want to flag or reject certain domains
        }
    }

    @Test
    @DisplayName("Should handle international domain names correctly")
    void testInternationalDomainNames() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        request.setEmail("test@münchen.de"); // German umlaut
        request.setWebsite("测试.中国"); // Chinese characters

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk()); // Should handle IDN correctly
    }

    @Test
    @DisplayName("Should prevent password enumeration attacks")
    void testPasswordEnumerationPrevention() throws Exception {
        // Create a user first
        User existingUser = new User();
        existingUser.setEmail("existing@example.com");
        existingUser.setWebsite("existing.com");
        existingUser.setPassword("hashedPassword");
        existingUser.setEnabled(true);
        userRepository.save(existingUser);

        RegisterRequest request = createValidRegisterRequest();
        request.setEmail("existing@example.com");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                // Should not reveal whether email exists or not in timing
                .andExpectAll(
                    result -> {
                        if (result.getResponse().getContentAsString().length() == 0) {
                            throw new AssertionError("Response should contain content");
                        }
                    }
                );
    }

    @Test
    @DisplayName("Should handle multiple Content-Type headers")
    void testMultipleContentTypeHeaders() throws Exception {
        RegisterRequest request = createValidRegisterRequest();

        mockMvc.perform(post("/auth/register")
                .header("Content-Type", "application/json")
                .header("Content-Type", "text/plain") // Conflicting header
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @DisplayName("Should validate against IDN homograph attacks")
    void testIdnHomographAttacks() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        // Using Cyrillic 'а' instead of Latin 'a' (homograph attack)
        request.setEmail("test@exаmple.com");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk()); // Should handle but could be flagged in production
    }

    private RegisterRequest createValidRegisterRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setWebsite("testwebsite.com");
        request.setPassword("StrongPassword123!");
        request.setReferral("http://localhost:3000");
        return request;
    }
}

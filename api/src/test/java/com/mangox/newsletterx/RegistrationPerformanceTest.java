package com.mangox.newsletterx;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mangox.newsletterx.model.entities.EnvVars;
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

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Registration Performance Tests")
public class RegistrationPerformanceTest {

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
    @DisplayName("Should handle single registration within acceptable time")
    void testSingleRegistrationPerformance() throws Exception {
        RegisterRequest request = createValidRegisterRequest();

        long startTime = System.currentTimeMillis();

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        // Should complete within 2 seconds (adjust based on requirements)
        assertTrue(duration < 2000, "Registration took too long: " + duration + "ms");
    }

    @Test
    @DisplayName("Should handle multiple sequential registrations efficiently")
    void testSequentialRegistrationsPerformance() throws Exception {
        int numberOfRegistrations = 10;
        long startTime = System.currentTimeMillis();

        for (int i = 0; i < numberOfRegistrations; i++) {
            RegisterRequest request = createValidRegisterRequest();
            request.setEmail("user" + i + "@example.com");
            request.setWebsite("website" + i + ".com");

            mockMvc.perform(post("/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());
        }

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        long averageTime = duration / numberOfRegistrations;

        System.out.println("Sequential registrations - Total time: " + duration + "ms, Average: " + averageTime + "ms");
        
        // Average should be reasonable
        assertTrue(averageTime < 1000, "Average registration time too high: " + averageTime + "ms");
    }

    @Test
    @DisplayName("Should handle concurrent registrations without conflicts")
    void testConcurrentRegistrationsPerformance() throws Exception {
        int numberOfThreads = 5;
        int registrationsPerThread = 3;
        ExecutorService executor = Executors.newFixedThreadPool(numberOfThreads);
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        long startTime = System.currentTimeMillis();

        for (int thread = 0; thread < numberOfThreads; thread++) {
            final int threadId = thread;
            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                try {
                    for (int i = 0; i < registrationsPerThread; i++) {
                        RegisterRequest request = createValidRegisterRequest();
                        request.setEmail("thread" + threadId + "user" + i + "@example.com");
                        request.setWebsite("thread" + threadId + "website" + i + ".com");

                        mockMvc.perform(post("/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk());
                    }
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }, executor);
            futures.add(future);
        }

        // Wait for all futures to complete
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        
        executor.shutdown();
        try {
            if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
        }

        System.out.println("Concurrent registrations - Total time: " + duration + "ms");
        
        // Should complete all concurrent registrations in reasonable time
        assertTrue(duration < 10000, "Concurrent registrations took too long: " + duration + "ms");
        
        // Verify all users were created
        long userCount = userRepository.count();
        assertEquals(numberOfThreads * registrationsPerThread, userCount, "Expected " + (numberOfThreads * registrationsPerThread) + " users, but got " + userCount);
    }

    @Test
    @DisplayName("Should handle registration with large payload efficiently")
    void testLargePayloadPerformance() throws Exception {
        RegisterRequest request = createValidRegisterRequest();
        // Create a large referral URL
        request.setReferral("http://localhost:3000/signup?" + "a".repeat(1000));
        // Large password
        request.setPassword("StrongPassword123!" + "x".repeat(500));

        long startTime = System.currentTimeMillis();

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        System.out.println("Large payload registration time: " + duration + "ms");
        
        // Should handle large payloads efficiently
        assertTrue(duration < 3000, "Large payload registration took too long: " + duration + "ms");
    }

    @Test
    @DisplayName("Should handle database constraints efficiently")
    void testDatabaseConstraintPerformance() throws Exception {
        // Create initial user
        RegisterRequest initialRequest = createValidRegisterRequest();
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(initialRequest)))
                .andExpect(status().isOk());

        // Try to register with same email (should be fast constraint check)
        RegisterRequest duplicateRequest = createValidRegisterRequest();
        duplicateRequest.setWebsite("different.com");

        long startTime = System.currentTimeMillis();

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(duplicateRequest)))
                .andExpect(status().isOk()); // Should update existing user

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        System.out.println("Duplicate email registration time: " + duration + "ms");
        
        // Constraint checking should be fast
        assertTrue(duration < 1500, "Duplicate check took too long: " + duration + "ms");
    }

    @Test
    @DisplayName("Should handle password hashing efficiently")
    void testPasswordHashingPerformance() throws Exception {
        String[] passwords = {
            "ShortPass1!",
            "MediumLengthPassword123!",
            "VeryLongPasswordWithLotsOfCharactersAndNumbers12345!@#$%^&*()",
            "UnicodePasswordWithSpecialChars漢字123!",
            "AnotherComplexPasswordWithMixedCASE123!@#"
        };

        for (int i = 0; i < passwords.length; i++) {
            RegisterRequest request = createValidRegisterRequest();
            request.setEmail("user" + i + "@example.com");
            request.setWebsite("website" + i + ".com");
            request.setPassword(passwords[i]);

            long startTime = System.currentTimeMillis();

            mockMvc.perform(post("/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());

            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;

            System.out.println("Password hashing for length " + passwords[i].length() + ": " + duration + "ms");
            
            // Password hashing should not be too slow
            assertTrue(duration < 2000, "Password hashing took too long: " + duration + "ms for password length " + passwords[i].length());
        }
    }

    @Test
    @DisplayName("Should handle memory efficiently with multiple registrations")
    void testMemoryEfficiency() throws Exception {
        Runtime runtime = Runtime.getRuntime();
        long initialMemory = runtime.totalMemory() - runtime.freeMemory();
        
        int numberOfRegistrations = 50;
        
        for (int i = 0; i < numberOfRegistrations; i++) {
            RegisterRequest request = createValidRegisterRequest();
            request.setEmail("memoryuser" + i + "@example.com");
            request.setWebsite("memorywebsite" + i + ".com");

            mockMvc.perform(post("/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());
            
            // Force garbage collection every 10 registrations
            if (i % 10 == 0) {
                System.gc();
                Thread.sleep(100); // Give GC time to work
            }
        }
        
        System.gc();
        Thread.sleep(200);
        
        long finalMemory = runtime.totalMemory() - runtime.freeMemory();
        long memoryIncrease = finalMemory - initialMemory;
        
        System.out.println("Memory increase after " + numberOfRegistrations + " registrations: " + (memoryIncrease / 1024 / 1024) + " MB");
        
        // Memory increase should be reasonable (adjust based on requirements)
        assertTrue(memoryIncrease < 100_000_000, "Memory usage increased too much: " + (memoryIncrease / 1024 / 1024) + " MB");
    }

    @Test
    @DisplayName("Should handle validation efficiently")
    void testValidationPerformance() throws Exception {
        // Test with various invalid inputs to measure validation performance
        RegisterRequest[] invalidRequests = {
            createInvalidEmailRequest(),
            createInvalidWebsiteRequest(),
            createInvalidPasswordRequest(),
            createEmptyFieldsRequest()
        };

        for (int i = 0; i < invalidRequests.length; i++) {
            long startTime = System.currentTimeMillis();

            mockMvc.perform(post("/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidRequests[i])))
                    .andExpect(status().isBadRequest());

            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;

            System.out.println("Validation rejection time for request " + i + ": " + duration + "ms");
            
            // Validation should be fast
            assertTrue(duration < 500, "Validation took too long: " + duration + "ms");
        }
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

    private RegisterRequest createInvalidEmailRequest() {
        RegisterRequest request = createValidRegisterRequest();
        request.setEmail("invalid-email");
        return request;
    }

    private RegisterRequest createInvalidWebsiteRequest() {
        RegisterRequest request = createValidRegisterRequest();
        request.setWebsite("");
        return request;
    }

    private RegisterRequest createInvalidPasswordRequest() {
        RegisterRequest request = createValidRegisterRequest();
        request.setPassword("123");
        return request;
    }

    private RegisterRequest createEmptyFieldsRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("");
        request.setWebsite("");
        request.setPassword("");
        return request;
    }
}

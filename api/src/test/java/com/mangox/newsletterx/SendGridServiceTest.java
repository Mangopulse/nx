package com.mangox.newsletterx;

import com.mangox.newsletterx.sender.service.SendGridService;
import com.mangox.newsletterx.service.EnvVarsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@DisplayName("SendGrid Service Tests")
public class SendGridServiceTest {

    @Mock
    private SpringTemplateEngine templateEngine;

    @Mock
    private EnvVarsService envVarsService;

    private SendGridService sendGridService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        sendGridService = new SendGridService(templateEngine, null, envVarsService);
    }

    @Test
    @DisplayName("Should return false when SENDGRID_API_KEY is null")
    void testNullApiKey() throws IOException {
        // Mock environment variables
        when(envVarsService.getEnvironmentVariable("SENDGRID_API_KEY")).thenReturn(null);
        when(envVarsService.getEnvironmentVariable("SKIP_EMAIL_SERVICE")).thenReturn("false");

        boolean result = sendGridService.sendHtml("from@test.com", "to@test.com", "Subject", "<h1>Test</h1>");

        assertFalse(result);
        verify(envVarsService).getEnvironmentVariable("SENDGRID_API_KEY");
        verify(envVarsService).getEnvironmentVariable("SKIP_EMAIL_SERVICE");
    }

    @Test
    @DisplayName("Should return false when SENDGRID_API_KEY is empty")
    void testEmptyApiKey() throws IOException {
        // Mock environment variables
        when(envVarsService.getEnvironmentVariable("SENDGRID_API_KEY")).thenReturn("");
        when(envVarsService.getEnvironmentVariable("SKIP_EMAIL_SERVICE")).thenReturn("false");

        boolean result = sendGridService.sendHtml("from@test.com", "to@test.com", "Subject", "<h1>Test</h1>");

        assertFalse(result);
        verify(envVarsService).getEnvironmentVariable("SENDGRID_API_KEY");
        verify(envVarsService).getEnvironmentVariable("SKIP_EMAIL_SERVICE");
    }

    @Test
    @DisplayName("Should return false when SENDGRID_API_KEY is blank")
    void testBlankApiKey() throws IOException {
        // Mock environment variables
        when(envVarsService.getEnvironmentVariable("SENDGRID_API_KEY")).thenReturn("   ");
        when(envVarsService.getEnvironmentVariable("SKIP_EMAIL_SERVICE")).thenReturn("false");

        boolean result = sendGridService.sendHtml("from@test.com", "to@test.com", "Subject", "<h1>Test</h1>");

        assertFalse(result);
        verify(envVarsService).getEnvironmentVariable("SENDGRID_API_KEY");
        verify(envVarsService).getEnvironmentVariable("SKIP_EMAIL_SERVICE");
    }

    @Test
    @DisplayName("Should return true when SKIP_EMAIL_SERVICE is enabled")
    void testSkipEmailService() throws IOException {
        // Mock environment variables
        when(envVarsService.getEnvironmentVariable("SKIP_EMAIL_SERVICE")).thenReturn("true");
        when(envVarsService.getEnvironmentVariable("SENDGRID_API_KEY")).thenReturn("SG.some_key.test");

        boolean result = sendGridService.sendHtml("from@test.com", "to@test.com", "Subject", "<h1>Test</h1>");

        assertTrue(result);
        verify(envVarsService).getEnvironmentVariable("SKIP_EMAIL_SERVICE");
        verify(envVarsService).getEnvironmentVariable("SENDGRID_API_KEY");
    }

    @Test
    @DisplayName("Should return true for test key (development mode)")
    void testTestKey() throws IOException {
        // Mock environment variables
        when(envVarsService.getEnvironmentVariable("SENDGRID_API_KEY")).thenReturn("SG.test_key.development_value");
        when(envVarsService.getEnvironmentVariable("SKIP_EMAIL_SERVICE")).thenReturn("false");

        boolean result = sendGridService.sendHtml("from@test.com", "to@test.com", "Subject", "<h1>Test</h1>");

        assertTrue(result);
        verify(envVarsService).getEnvironmentVariable("SENDGRID_API_KEY");
        verify(envVarsService).getEnvironmentVariable("SKIP_EMAIL_SERVICE");
    }

    @Test
    @DisplayName("Should handle template email with null API key")
    void testTemplateEmailWithNullApiKey() throws IOException {
        // Mock environment variables
        when(envVarsService.getEnvironmentVariable("SENDGRID_API_KEY")).thenReturn(null);
        when(envVarsService.getEnvironmentVariable("SKIP_EMAIL_SERVICE")).thenReturn("false");

        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("name", "Test User");

        boolean result = sendGridService.sendHtmlTemplateEmail(
            "from@test.com", 
            "to@test.com", 
            "Subject", 
            "template.html", 
            templateModel
        );

        assertFalse(result);
        verify(envVarsService).getEnvironmentVariable("SENDGRID_API_KEY");
        verify(envVarsService).getEnvironmentVariable("SKIP_EMAIL_SERVICE");
    }

    @Test
    @DisplayName("Should handle template email with SKIP_EMAIL_SERVICE enabled")
    void testTemplateEmailWithSkipService() throws IOException {
        // Mock environment variables
        when(envVarsService.getEnvironmentVariable("SKIP_EMAIL_SERVICE")).thenReturn("true");
        
        // Mock template engine
        when(templateEngine.process(anyString(), any())).thenReturn("<h1>Processed Template</h1>");

        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("name", "Test User");

        boolean result = sendGridService.sendHtmlTemplateEmail(
            "from@test.com", 
            "to@test.com", 
            "Subject", 
            "template.html", 
            templateModel
        );

        assertTrue(result);
        verify(envVarsService).getEnvironmentVariable("SKIP_EMAIL_SERVICE");
        verify(templateEngine).process(eq("/template.html"), any());
    }

    @Test
    @DisplayName("Should handle template email with test key")
    void testTemplateEmailWithTestKey() throws IOException {
        // Mock environment variables
        when(envVarsService.getEnvironmentVariable("SENDGRID_API_KEY")).thenReturn("SG.test_key.development_value");
        when(envVarsService.getEnvironmentVariable("SKIP_EMAIL_SERVICE")).thenReturn("false");
        
        // Mock template engine
        when(templateEngine.process(anyString(), any())).thenReturn("<h1>Processed Template</h1>");

        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("name", "Test User");

        boolean result = sendGridService.sendHtmlTemplateEmail(
            "from@test.com", 
            "to@test.com", 
            "Subject", 
            "template.html", 
            templateModel
        );

        assertTrue(result);
        verify(envVarsService).getEnvironmentVariable("SENDGRID_API_KEY");
        verify(envVarsService).getEnvironmentVariable("SKIP_EMAIL_SERVICE");
        verify(templateEngine).process(eq("/template.html"), any());
    }

    @Test
    @DisplayName("Should return empty map when API key is missing for getSenders")
    void testGetSendersWithMissingApiKey() throws IOException {
        // Mock environment variables
        when(envVarsService.getEnvironmentVariable("SENDGRID_API_KEY")).thenReturn(null);

        var result = sendGridService.getSenders();

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(envVarsService).getEnvironmentVariable("SENDGRID_API_KEY");
    }

    @Test
    @DisplayName("Should return null when API key is missing for getSender")
    void testGetSenderWithMissingApiKey() throws IOException {
        // Mock environment variables
        when(envVarsService.getEnvironmentVariable("SENDGRID_API_KEY")).thenReturn("");

        var result = sendGridService.getSender("123");

        assertNull(result);
        verify(envVarsService).getEnvironmentVariable("SENDGRID_API_KEY");
    }

    @Test
    @DisplayName("Should return -1 when API key is missing for createSender")
    void testCreateSenderWithMissingApiKey() throws IOException {
        // Mock environment variables
        when(envVarsService.getEnvironmentVariable("SENDGRID_API_KEY")).thenReturn(null);

        int result = sendGridService.createSender("test.com", "test@test.com", "Test User", "123 Test St");

        assertEquals(-1, result);
        verify(envVarsService).getEnvironmentVariable("SENDGRID_API_KEY");
    }

    @Test
    @DisplayName("Should return -1 when API key is missing for updateSender")
    void testUpdateSenderWithMissingApiKey() throws IOException {
        // Mock environment variables
        when(envVarsService.getEnvironmentVariable("SENDGRID_API_KEY")).thenReturn("");

        int result = sendGridService.updateSender(123L, "test.com", "test@test.com", "Test User", "123 Test St");

        assertEquals(-1, result);
        verify(envVarsService).getEnvironmentVariable("SENDGRID_API_KEY");
    }

    @Test
    @DisplayName("Should handle SKIP_EMAIL_SERVICE case insensitive")
    void testSkipEmailServiceCaseInsensitive() throws IOException {
        // Test with various case combinations
        String[] trueValues = {"TRUE", "True", "true", "TrUe"};
        
        for (String value : trueValues) {
            reset(envVarsService);
            when(envVarsService.getEnvironmentVariable("SKIP_EMAIL_SERVICE")).thenReturn(value);

            boolean result = sendGridService.sendHtml("from@test.com", "to@test.com", "Subject", "<h1>Test</h1>");

            assertTrue(result, "Should return true for SKIP_EMAIL_SERVICE=" + value);
        }
    }

    @Test
    @DisplayName("Should not skip email when SKIP_EMAIL_SERVICE is false")
    void testSkipEmailServiceFalse() throws IOException {
        // Mock environment variables
        when(envVarsService.getEnvironmentVariable("SKIP_EMAIL_SERVICE")).thenReturn("false");
        when(envVarsService.getEnvironmentVariable("SENDGRID_API_KEY")).thenReturn(null);

        boolean result = sendGridService.sendHtml("from@test.com", "to@test.com", "Subject", "<h1>Test</h1>");

        assertFalse(result);
        verify(envVarsService).getEnvironmentVariable("SKIP_EMAIL_SERVICE");
        verify(envVarsService).getEnvironmentVariable("SENDGRID_API_KEY");
    }
}

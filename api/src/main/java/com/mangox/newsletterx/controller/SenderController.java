package com.mangox.newsletterx.controller;

import com.mangox.newsletterx.model.responses.main.ErrorResponse;
import com.mangox.newsletterx.service.sender.NewsletterSender;
import com.mangox.newsletterx.sender.service.SendGridService;
import com.mangox.newsletterx.service.EnvVarsService;
import com.mangox.newsletterx.model.enums.EnvVariables;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/sender")
@RequiredArgsConstructor
@CrossOrigin
public class SenderController {
    private final NewsletterSender newsletterSender;
    private final SendGridService sendGridService;
    private final EnvVarsService envVarsService;

    @GetMapping("/send-scheduled-emails")
    public ResponseEntity<?> sendScheduledEmails(){
        try{
            return ResponseEntity.ok(newsletterSender.scheduledEmailSender());
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/test-sendgrid")
    public ResponseEntity<?> testSendGrid(@RequestParam(required = false) String toEmail) {
        try {
            Map<String, Object> response = new HashMap<>();
            
            // Check if SendGrid is configured
            String sendGridApiKey = envVarsService.getEnvironmentVariable(EnvVariables.SENDGRID_API_KEY.name());
            String skipEmailService = envVarsService.getEnvironmentVariable(EnvVariables.SKIP_EMAIL_SERVICE.name());
            
            log.info("Testing SendGrid configuration...");
            
            // Check configuration status
            if ("true".equalsIgnoreCase(skipEmailService)) {
                response.put("status", "SKIP_MODE");
                response.put("message", "Email service is in SKIP mode - emails are disabled for development");
                response.put("configured", false);
                response.put("skip_email_service", true);
                return ResponseEntity.ok(response);
            }
            
            if (sendGridApiKey == null || sendGridApiKey.isBlank()) {
                response.put("status", "NOT_CONFIGURED");
                response.put("message", "SendGrid API key is not configured");
                response.put("configured", false);
                response.put("api_key_present", false);
                return ResponseEntity.ok(response);
            }
            
            if (sendGridApiKey.startsWith("SG.test_key") || sendGridApiKey.startsWith("SG.dev_key")) {
                response.put("status", "DEV_MODE");
                response.put("message", "SendGrid is in development mode with test key");
                response.put("configured", true);
                response.put("development_mode", true);
                response.put("api_key_present", true);
                return ResponseEntity.ok(response);
            }
            
            // If no test email provided, just return configuration status
            if (toEmail == null || toEmail.isBlank()) {
                response.put("status", "CONFIGURED");
                response.put("message", "SendGrid appears to be configured. Provide 'toEmail' parameter to send a test email.");
                response.put("configured", true);
                response.put("api_key_present", true);
                response.put("api_key_prefix", sendGridApiKey.substring(0, Math.min(6, sendGridApiKey.length())) + "****");
                return ResponseEntity.ok(response);
            }
            
            // Send test email
            String fromEmail = "test@newsletterx.com";
            String subject = "SendGrid Test Email from NewsletterX";
            String htmlContent = """
                <html>
                <body>
                    <h2>SendGrid Test Email</h2>
                    <p>This is a test email sent from NewsletterX to verify SendGrid configuration.</p>
                    <p><strong>Test Details:</strong></p>
                    <ul>
                        <li>API Key: %s****</li>
                        <li>Sent at: %s</li>
                        <li>From: %s</li>
                        <li>To: %s</li>
                    </ul>
                    <p>If you received this email, SendGrid is working correctly!</p>
                </body>
                </html>
                """.formatted(
                    sendGridApiKey.substring(0, Math.min(6, sendGridApiKey.length())), 
                    new java.util.Date().toString(),
                    fromEmail,
                    toEmail
                );
            
            boolean emailSent = sendGridService.sendHtml(fromEmail, toEmail, subject, htmlContent);
            
            if (emailSent) {
                response.put("status", "EMAIL_SENT");
                response.put("message", "Test email sent successfully to " + toEmail);
                response.put("configured", true);
                response.put("email_sent", true);
                response.put("to_email", toEmail);
            } else {
                response.put("status", "EMAIL_FAILED");
                response.put("message", "Failed to send test email. Check SendGrid configuration and API key.");
                response.put("configured", false);
                response.put("email_sent", false);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error testing SendGrid: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("message", "Error testing SendGrid: " + e.getMessage());
            errorResponse.put("configured", false);
            errorResponse.put("error", true);
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

package com.mangox.newsletterx;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Main application context test
 */
@SpringBootTest
@ActiveProfiles("test")
@DisplayName("Application Context Tests")
class NewsletterXApplicationTests {

	@Test
	@DisplayName("Should load application context successfully")
	void contextLoads() {
		// This test ensures that the Spring Boot application context loads successfully
		// with all the beans properly configured
	}

	@Test
	@DisplayName("Should have all required beans configured")
	void shouldHaveRequiredBeans() {
		// Additional context validation can be added here
		// For example, checking if critical beans are present
	}
}

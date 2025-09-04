package com.mangox.newsletterx;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

import jakarta.annotation.PostConstruct;
import javax.sql.DataSource;

/**
 * Test configuration that initializes the database once for all tests
 */
@TestConfiguration
public class TestDatabaseConfiguration {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static boolean databaseInitialized = false;

    @PostConstruct
    public void initializeDatabase() {
        if (!databaseInitialized) {
            // Initialize database with test data only once
            ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
            populator.addScript(new ClassPathResource("test-data.sql"));
            populator.execute(dataSource);
            
            databaseInitialized = true;
            System.out.println("✅ Test database initialized once for all tests");
        }
    }

    @Bean
    public DatabaseTestHelper databaseTestHelper() {
        return new DatabaseTestHelper(jdbcTemplate);
    }

    /**
     * Helper class for database operations in tests
     */
    public static class DatabaseTestHelper {
        private final JdbcTemplate jdbcTemplate;

        public DatabaseTestHelper(JdbcTemplate jdbcTemplate) {
            this.jdbcTemplate = jdbcTemplate;
        }

        /**
         * Get count of records in a table
         */
        public int getRecordCount(String tableName) {
            return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + tableName, Integer.class);
        }

        /**
         * Check if a user exists by email
         */
        public boolean userExists(String email) {
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM users WHERE email = ?", 
                Integer.class, 
                email
            );
            return count != null && count > 0;
        }

        /**
         * Check if a subscription exists
         */
        public boolean subscriptionExists(String email, String appDomain) {
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM email_newsletter_subscriptions WHERE email = ? AND app_domain = ?", 
                Integer.class, 
                email, appDomain
            );
            return count != null && count > 0;
        }

        /**
         * Get user ID by email
         */
        public Long getUserId(String email) {
            return jdbcTemplate.queryForObject(
                "SELECT id FROM users WHERE email = ?", 
                Long.class, 
                email
            );
        }

        /**
         * Clean up test data created by specific tests (optional cleanup)
         */
        public void cleanupTestData(String emailPattern) {
            jdbcTemplate.update("DELETE FROM email_newsletter_subscriptions WHERE email LIKE ?", emailPattern);
            jdbcTemplate.update("DELETE FROM confirmation_tokens WHERE user_id IN (SELECT id FROM users WHERE email LIKE ?)", emailPattern);
            jdbcTemplate.update("DELETE FROM users WHERE email LIKE ?", emailPattern);
        }
    }
}

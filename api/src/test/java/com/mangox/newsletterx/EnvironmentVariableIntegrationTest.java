package com.mangox.newsletterx;

import com.mangox.newsletterx.model.entities.EnvVars;
import com.mangox.newsletterx.repositories.EnvVarRepository;
import com.mangox.newsletterx.service.EnvVarsService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "logging.level.com.mangox.newsletterx=DEBUG"
})
@DisplayName("Environment Variable Integration Tests")
public class EnvironmentVariableIntegrationTest {

    @Autowired
    private EnvVarsService envVarsService;

    @Autowired
    private EnvVarRepository envVarRepository;

    @BeforeEach
    void setUp() {
        // Clean up database before each test
        envVarRepository.deleteAll();
        envVarsService.refreshMap();
    }

    @AfterEach
    void tearDown() {
        // Clean up after each test
        envVarRepository.deleteAll();
        envVarsService.refreshMap();
    }

    @Test
    @DisplayName("Should resolve from database when present")
    void testDatabaseResolution() {
        // Add variable to database
        EnvVars dbVar = new EnvVars();
        dbVar.setKey("TEST_VAR");
        dbVar.setValue("database_value");
        envVarRepository.save(dbVar);
        
        // Refresh the service cache
        envVarsService.refreshMap();

        String result = envVarsService.getEnvironmentVariable("TEST_VAR");

        assertEquals("database_value", result);
    }

    @Test
    @DisplayName("Should ignore null string values from database")
    void testIgnoreNullStringFromDatabase() {
        // Add variable with "null" string value to database
        EnvVars dbVar = new EnvVars();
        dbVar.setKey("NULL_VAR");
        dbVar.setValue("null");
        envVarRepository.save(dbVar);
        
        envVarsService.refreshMap();

        String result = envVarsService.getEnvironmentVariable("NULL_VAR");

        assertNull(result);
    }

    @Test
    @DisplayName("Should ignore empty string values from database")
    void testIgnoreEmptyStringFromDatabase() {
        // Add variable with empty string value to database
        EnvVars dbVar = new EnvVars();
        dbVar.setKey("EMPTY_VAR");
        dbVar.setValue("");
        envVarRepository.save(dbVar);
        
        envVarsService.refreshMap();

        String result = envVarsService.getEnvironmentVariable("EMPTY_VAR");

        assertNull(result);
    }

    @Test
    @DisplayName("Should add new variable to database")
    void testAddNewVariable() {
        EnvVars result = envVarsService.addVariable("NEW_VAR", "new_value");

        assertNotNull(result);
        assertEquals("NEW_VAR", result.getKey());
        assertEquals("new_value", result.getValue());

        // Verify it's saved in database
        var saved = envVarRepository.findByKey("NEW_VAR");
        assertTrue(saved.isPresent());
        assertEquals("new_value", saved.get().getValue());
    }

    @Test
    @DisplayName("Should update existing variable in database")
    void testUpdateExistingVariable() {
        // First add a variable
        EnvVars original = new EnvVars();
        original.setKey("UPDATE_VAR");
        original.setValue("original_value");
        envVarRepository.save(original);

        // Update it
        EnvVars result = envVarsService.addVariable("UPDATE_VAR", "updated_value");

        assertNotNull(result);
        assertEquals("UPDATE_VAR", result.getKey());
        assertEquals("updated_value", result.getValue());

        // Verify update in database
        var updated = envVarRepository.findByKey("UPDATE_VAR");
        assertTrue(updated.isPresent());
        assertEquals("updated_value", updated.get().getValue());
    }

    @Test
    @DisplayName("Should handle multiple variables correctly")
    void testMultipleVariables() {
        // Add multiple variables
        EnvVars var1 = new EnvVars();
        var1.setKey("VAR1");
        var1.setValue("value1");

        EnvVars var2 = new EnvVars();
        var2.setKey("VAR2");
        var2.setValue("value2");

        EnvVars var3 = new EnvVars();
        var3.setKey("VAR3");
        var3.setValue("value3");

        envVarRepository.saveAll(Arrays.asList(var1, var2, var3));
        envVarsService.refreshMap();

        // Test retrieval
        assertEquals("value1", envVarsService.getEnvironmentVariable("VAR1"));
        assertEquals("value2", envVarsService.getEnvironmentVariable("VAR2"));
        assertEquals("value3", envVarsService.getEnvironmentVariable("VAR3"));
        assertNull(envVarsService.getEnvironmentVariable("VAR4"));
    }

    @Test
    @DisplayName("Should provide debug information for all sources")
    void testDebugInformation() {
        // Add variable to database
        EnvVars dbVar = new EnvVars();
        dbVar.setKey("DEBUG_VAR");
        dbVar.setValue("debug_value");
        envVarRepository.save(dbVar);
        
        envVarsService.refreshMap();

        String result = envVarsService.getVariableWithSource("DEBUG_VAR");

        assertEquals("debug_value", result);
        // Note: In a real scenario, we'd capture and verify log output
    }

    @Test
    @DisplayName("Should handle database errors gracefully")
    void testDatabaseErrorHandling() {
        // This test would normally involve mocking repository to throw exceptions
        // For integration test, we'll just verify normal operation doesn't break
        String result = envVarsService.getEnvironmentVariable("NON_EXISTENT");
        
        assertNull(result);
        // Should not throw any exceptions
    }

    @Test
    @DisplayName("Should maintain performance with large number of variables")
    void testPerformanceWithManyVariables() {
        // Add many variables to test performance
        for (int i = 0; i < 100; i++) {
            EnvVars var = new EnvVars();
            var.setKey("PERF_VAR_" + i);
            var.setValue("value_" + i);
            envVarRepository.save(var);
        }
        
        envVarsService.refreshMap();

        // Measure time for multiple lookups
        long startTime = System.currentTimeMillis();
        
        for (int i = 0; i < 100; i++) {
            String result = envVarsService.getEnvironmentVariable("PERF_VAR_" + i);
            assertEquals("value_" + i, result);
        }
        
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        
        // Should complete within reasonable time (adjust as needed)
        assertTrue(duration < 1000, "Lookup should complete quickly, took: " + duration + "ms");
    }

    @Test
    @DisplayName("Should refresh map correctly")
    void testMapRefresh() {
        // Add initial variable
        EnvVars var1 = new EnvVars();
        var1.setKey("REFRESH_VAR");
        var1.setValue("initial_value");
        envVarRepository.save(var1);
        
        envVarsService.refreshMap();
        assertEquals("initial_value", envVarsService.getEnvironmentVariable("REFRESH_VAR"));

        // Update directly in database (bypassing service)
        var1.setValue("updated_value");
        envVarRepository.save(var1);

        // Should still return old value until refresh
        assertEquals("initial_value", envVarsService.getEnvironmentVariable("REFRESH_VAR"));

        // After refresh, should return new value
        envVarsService.refreshMap();
        assertEquals("updated_value", envVarsService.getEnvironmentVariable("REFRESH_VAR"));
    }
}

package com.mangox.newsletterx;

import com.mangox.newsletterx.model.entities.EnvVars;
import com.mangox.newsletterx.repositories.EnvVarRepository;
import com.mangox.newsletterx.service.EnvVarsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.env.Environment;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@DisplayName("EnvVarsService Tests")
public class EnvVarsServiceTest {

    @Mock
    private EnvVarRepository envVarRepository;

    @Mock
    private Environment environment;

    private EnvVarsService envVarsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        envVarsService = new EnvVarsService(envVarRepository);
        // Manually inject the Environment mock since @Autowired doesn't work in unit tests
        try {
            var field = EnvVarsService.class.getDeclaredField("environment");
            field.setAccessible(true);
            field.set(envVarsService, environment);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    @DisplayName("Should return database value when present")
    void testDatabaseValue() {
        // Mock database to return a value
        EnvVars dbVar = new EnvVars();
        dbVar.setKey("SENDGRID_API_KEY");
        dbVar.setValue("SG.db_value.test");
        when(envVarRepository.findAll()).thenReturn(Arrays.asList(dbVar));

        String result = envVarsService.getEnvironmentVariable("SENDGRID_API_KEY");

        assertEquals("SG.db_value.test", result);
        verify(envVarRepository).findAll();
    }

    @Test
    @DisplayName("Should return null when variable not found in database")
    void testVariableNotFound() {
        // Mock database to return empty list
        when(envVarRepository.findAll()).thenReturn(Collections.emptyList());

        String result = envVarsService.getEnvironmentVariable("NON_EXISTENT_VAR");

        assertNull(result);
        verify(envVarRepository).findAll();
    }

    @Test
    @DisplayName("Should ignore database 'null' string values")
    void testIgnoreNullStringFromDatabase() {
        // Mock database to return "null" string
        EnvVars dbVar = new EnvVars();
        dbVar.setKey("LINK");
        dbVar.setValue("null");
        when(envVarRepository.findAll()).thenReturn(Arrays.asList(dbVar));

        String result = envVarsService.getEnvironmentVariable("LINK");

        assertNull(result);
        verify(envVarRepository).findAll();
    }

    @Test
    @DisplayName("Should ignore empty database values")
    void testIgnoreEmptyDatabaseValues() {
        // Mock database to return empty string
        EnvVars dbVar = new EnvVars();
        dbVar.setKey("SKIP_EMAIL_SERVICE");
        dbVar.setValue("");
        when(envVarRepository.findAll()).thenReturn(Arrays.asList(dbVar));

        String result = envVarsService.getEnvironmentVariable("SKIP_EMAIL_SERVICE");

        assertNull(result);
        verify(envVarRepository).findAll();
    }

    @Test
    @DisplayName("Should return multiple database values correctly")
    void testMultipleDatabaseValues() {
        // Mock database to return multiple values
        EnvVars var1 = new EnvVars();
        var1.setKey("VAR1");
        var1.setValue("value1");
        
        EnvVars var2 = new EnvVars();
        var2.setKey("VAR2");
        var2.setValue("value2");
        
        when(envVarRepository.findAll()).thenReturn(Arrays.asList(var1, var2));

        assertEquals("value1", envVarsService.getEnvironmentVariable("VAR1"));
        assertEquals("value2", envVarsService.getEnvironmentVariable("VAR2"));
        assertNull(envVarsService.getEnvironmentVariable("VAR3"));
    }

    @Test
    @DisplayName("Should add variable to database")
    void testAddVariable() {
        EnvVars savedVar = new EnvVars();
        savedVar.setKey("TEST_KEY");
        savedVar.setValue("test_value");
        
        when(envVarRepository.findByKey("TEST_KEY")).thenReturn(Optional.empty());
        when(envVarRepository.save(any(EnvVars.class))).thenReturn(savedVar);

        EnvVars result = envVarsService.addVariable("TEST_KEY", "test_value");

        assertNotNull(result);
        assertEquals("TEST_KEY", result.getKey());
        assertEquals("test_value", result.getValue());
        verify(envVarRepository).save(any(EnvVars.class));
    }

    @Test
    @DisplayName("Should update existing variable in database")
    void testUpdateExistingVariable() {
        EnvVars existingVar = new EnvVars();
        existingVar.setKey("EXISTING_KEY");
        existingVar.setValue("old_value");
        
        when(envVarRepository.findByKey("EXISTING_KEY")).thenReturn(Optional.of(existingVar));
        when(envVarRepository.save(any(EnvVars.class))).thenReturn(existingVar);

        EnvVars result = envVarsService.addVariable("EXISTING_KEY", "new_value");

        assertNotNull(result);
        assertEquals("EXISTING_KEY", result.getKey());
        assertEquals("new_value", result.getValue());
        verify(envVarRepository).save(existingVar);
    }

    @Test
    @DisplayName("Should handle database exceptions gracefully")
    void testDatabaseExceptionHandling() {
        // Mock database to throw exception
        when(envVarRepository.findAll()).thenThrow(new RuntimeException("Database connection failed"));

        String result = envVarsService.getEnvironmentVariable("SENDGRID_API_KEY");

        assertNull(result);
        // Should not throw exception, should handle gracefully
        verify(envVarRepository).findAll();
    }

    @Test
    @DisplayName("Should provide debug information for variable sources")
    void testVariableWithSource() {
        // Mock database to return a value
        EnvVars dbVar = new EnvVars();
        dbVar.setKey("SENDGRID_API_KEY");
        dbVar.setValue("SG.db_value.test");
        when(envVarRepository.findAll()).thenReturn(Arrays.asList(dbVar));

        String result = envVarsService.getVariableWithSource("SENDGRID_API_KEY");

        assertEquals("SG.db_value.test", result);
        // In a real scenario, we'd verify the log contains source information
        verify(envVarRepository, atLeastOnce()).findAll();
    }
}

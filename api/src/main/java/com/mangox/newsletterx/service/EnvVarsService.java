package com.mangox.newsletterx.service;

import com.mangox.newsletterx.model.entities.EnvVars;
import com.mangox.newsletterx.repositories.EnvVarRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import jakarta.annotation.PostConstruct;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnvVarsService {
    private final EnvVarRepository envVarRepository;
    
    @Autowired
    private Environment environment;
    
    HashMap<String, String> variablesMap = new HashMap<>();

    @PostConstruct
    public void initializeOnStartup() {
        try {
            log.info("Initializing environment variables from database...");
            initializrVariables();
            log.info("Environment variables initialized. Found {} variables", variablesMap.size());
            if (variablesMap.isEmpty()) {
                log.info("No variables found in database. System environment variables will be used when present.");
            }
        } catch (Exception e) {
            log.error("Failed to initialize environment variables from database. System environment variables will be used when present.", e);
        }
    }

    public void initializrVariables() {
        List<EnvVars> variablesList = envVarRepository.findAll();
        for (EnvVars variables : variablesList)
            variablesMap.put(variables.getKey(), variables.getValue());
    }

    public String getEnvironmentVariable(String key) {
        // 1. Check system environment variables first (env file / container env)
        String envValue = System.getenv(key);
        if (envValue != null && !envValue.isEmpty()) {
            log.debug("Found variable '{}' in system environment: {}", key, maskIfSensitive(key, envValue));
            return envValue;
        }

        // 2. Fallback to database (runtime configuration)
        String dbValue = getDatabaseValue(key);
        if (dbValue != null && !dbValue.isEmpty() && !"null".equals(dbValue)) {
            log.debug("Found variable '{}' in database: {}", key, maskIfSensitive(key, dbValue));
            return dbValue;
        }

        log.debug("Variable '{}' not found in env or database", key);
        return null;
    }
    
    private String getDatabaseValue(String key) {
        try {
            log.debug("Getting database value for key: '{}', variablesMap size: {}", key, variablesMap.size());
            if (variablesMap.isEmpty()) {
                log.debug("Variables map is empty, initializing...");
                initializrVariables();
            }
            String value = variablesMap.get(key);
            log.debug("Database value for '{}': {}", key, value);
            return value;
        } catch (Exception e) {
            log.warn("Failed to retrieve variable '{}' from database: {}", key, e.getMessage());
            return null;
        }
    }

    public EnvVars addVariable(String key, String value) {
        Optional<EnvVars> optionalEnvVars = envVarRepository.findByKey(key);
        EnvVars var;
        if (optionalEnvVars.isPresent()) {
            var = optionalEnvVars.get();
            var.setValue(value);
        } else {
            var = new EnvVars();
            var.setKey(key);
            var.setValue(value);
        }
        return envVarRepository.save(var);
    }

    public void refreshMap() {
        initializrVariables();
    }
    
    /**
     * Initialize required environment variables if they don't exist
     */
    public void initializeRequiredVariables() { /* no-op: do not seed DB defaults */ }

    public HashMap<String, String> getVariables() {
        return variablesMap;
    }
    
    private String getApplicationPropertyValue(String key) { return null; }
    
    /**
     * Get variable from all sources for debugging purposes
     */
    public String getVariableWithSource(String key) {
        StringBuilder result = new StringBuilder();
        
        // Check database
        String dbValue = getDatabaseValue(key);
        result.append("DB: ").append(dbValue != null ? dbValue : "null").append(", ");
        
        // Check system environment
        String envValue = System.getenv(key);
        result.append("ENV: ").append(envValue != null ? envValue : "null").append(", ");
        
        // Application properties disabled as a source
        String propValue = null;
        result.append("PROPS: null");
        
        log.info("Variable '{}' sources: {}", key, result.toString());
        return getEnvironmentVariable(key); // Return actual resolved value
    }

    private String maskIfSensitive(String key, String value) {
        if (key != null && key.toUpperCase().contains("KEY")) {
            if (value.length() <= 4) return "****";
            return value.substring(0, Math.min(6, value.length())) + "****";
        }
        return value;
    }

}

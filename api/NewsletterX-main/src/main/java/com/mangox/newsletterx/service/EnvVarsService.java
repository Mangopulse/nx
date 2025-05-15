package com.mangox.newsletterx.service;

import com.mangox.newsletterx.model.entities.EnvVars;
import com.mangox.newsletterx.repositories.EnvVarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EnvVarsService {
    private final EnvVarRepository envVarRepository;
    HashMap<String, String> variablesMap = new HashMap<>();

    public void initializrVariables() {
        List<EnvVars> variablesList = envVarRepository.findAll();
        for (EnvVars variables : variablesList)
            variablesMap.put(variables.getKey(), variables.getValue());
    }

    public String getEnvironmentVariable(String key) {
        if (variablesMap.isEmpty())
            initializrVariables();
        String value = variablesMap.get(key);

        if (!value.isEmpty())
            return value;
        return null;
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

    public HashMap<String, String> getVariables() {
        return variablesMap;
    }

}

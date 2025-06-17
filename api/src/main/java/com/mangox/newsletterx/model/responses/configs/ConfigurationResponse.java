package com.mangox.newsletterx.model.responses.configs;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mangox.newsletterx.model.responses.main.SuperResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ConfigurationResponse extends SuperResponse {
    Map collector;
    public ConfigurationResponse(String object) throws JsonProcessingException {
        super();
        this.collector = new ObjectMapper().readValue(object, Map.class);
    }
}


package com.mangox.newsletterx.model.newsletter;

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
public class CollectorResponse extends SuperResponse {
    Map collector;
    public CollectorResponse(String object) throws JsonProcessingException {
        super();
        this.collector = new ObjectMapper().readValue(object, Map.class);
    }
}

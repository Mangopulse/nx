package com.mangox.newsletterx.model.responses;


import com.mangox.newsletterx.model.responses.main.SuperResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
public class AnalyticsResponse extends SuperResponse {
    Long count;
    List<String> date;
    List<Long> value;

    public AnalyticsResponse(Long count){
        super();
        this.count = count;
    }

    public AnalyticsResponse(List<String> date, List<Long> value){
        super();
        this.date = date;
        this.value = value;
    }

    public AnalyticsResponse(Long count, List<String> date, List<Long> value){
        super();
        this.count = count;
        this.date =date;
        this.value = value;
    }
}

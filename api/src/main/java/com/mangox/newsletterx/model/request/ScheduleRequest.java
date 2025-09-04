package com.mangox.newsletterx.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleRequest {
    private Long id;
    private String type;
    private String hour;
    private String day;
}

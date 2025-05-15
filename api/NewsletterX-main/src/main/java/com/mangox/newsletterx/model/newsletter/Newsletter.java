package com.mangox.newsletterx.model.newsletter;

import com.mangox.newsletterx.model.components.Schedule;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Newsletter {
    private Long id;
    private String appDomain;
    private String title;
    private List<Object> htmlComponents;
    private boolean isActive;
    private Schedule schedule;
}

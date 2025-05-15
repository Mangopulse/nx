package com.mangox.newsletterx.model.components;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HtmlComponentsUpdate {
    private String htmlComponents;
    private Long id;
    private String title;
}

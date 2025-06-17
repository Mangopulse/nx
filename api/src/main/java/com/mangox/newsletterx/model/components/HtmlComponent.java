package com.mangox.newsletterx.model.components;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HtmlComponent {
    String id;
    String type;
    String name;
    String html;
    ComponentExtras extra;
}

package com.mangox.newsletterx.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailSender {
    private Long id;
    private String name;
    private String email;
    private Boolean verified;
    private Boolean locked;
}

package com.mangox.newsletterx.model.request;

import com.mangox.newsletterx.model.components.HtmlComponent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManualComponentGeneratedEmail {
    private List<HtmlComponent> components;
    private String email;
    private String subject;
}

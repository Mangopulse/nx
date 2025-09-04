package com.mangox.newsletterx.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSenderRequest {
    private Long id;
    private String email;
}

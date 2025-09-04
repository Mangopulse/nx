package com.mangox.newsletterx.model.subscribe;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubscriberStatusRequest {
    private String appDomain;
    private String email;
}

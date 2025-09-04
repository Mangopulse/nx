package com.mangox.newsletterx.model.subscribe;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Subscriber {
    private String email;
    private String firstName;
    private String lastName;
    private String country;
    private String phone;
    private String subscriptionDate;
    private String lastUpdatedDate;
}

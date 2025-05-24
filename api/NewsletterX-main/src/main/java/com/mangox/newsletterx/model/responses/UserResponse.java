package com.mangox.newsletterx.model.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    String email;
    String website;
    Boolean enabled;
    List<Object> walkthrough;
}

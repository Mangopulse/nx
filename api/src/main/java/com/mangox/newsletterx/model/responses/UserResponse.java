package com.mangox.newsletterx.model.responses;

import com.mangox.newsletterx.model.responses.main.SuperResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse extends SuperResponse {
    String email;
    String website;
    Boolean enabled;
    List<Object> walkthrough;
    String confirmationLink;
    String message;
}

package com.mangox.newsletterx.model.responses;

import com.mangox.newsletterx.model.EmailSender;
import com.mangox.newsletterx.model.entities.Sender;
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
public class AuthenticationResponse extends SuperResponse {
    private String accessToken;
    private String refreshToken;
    private String website;
    private String email;
    private EmailSender sender;
    private List<Object> walkthrough;
    private String superUser;
    private List<String> websites;
}
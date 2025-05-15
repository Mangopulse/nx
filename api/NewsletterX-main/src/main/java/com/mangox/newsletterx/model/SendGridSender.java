package com.mangox.newsletterx.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendGridSender {
    private long id;
    private String nickname;
    private From from;
    private ReplyTo replyTo;
    private String address;
    private String address2;
    private String city;
    private String state;
    private String zip;
    private String country;
    private Verified verified;
    @JsonProperty("updated_at")
    private long updatedAt;
    @JsonProperty("created_at")
    private long createdAt;
    private boolean locked;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class From {
        private String email;
        private String name;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReplyTo {
        private String email;
        private String name;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Verified {
        private boolean status;
        private String reason;
    }
}

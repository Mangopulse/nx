package com.mangox.newsletterx.model.subscribe;

import com.mangox.newsletterx.model.responses.main.SuperResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubscriberStatusResponse extends SuperResponse {
    boolean verified;
    boolean unsubscribed;
}

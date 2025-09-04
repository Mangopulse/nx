package com.mangox.newsletterx.model.subscribe;

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
public class SubscribersResponse extends SuperResponse {
    List<Subscriber> subscribers;
}

package com.mangox.newsletterx.model.subscribe;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BatchSubscription {
    private List<BatchSubscriber> subscribers;
}

package com.mangox.newsletterx.model.newsletter;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public record ToggleNewsletterRequest(Long id, boolean isActive) {
}


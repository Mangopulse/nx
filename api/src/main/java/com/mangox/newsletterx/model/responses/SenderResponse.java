package com.mangox.newsletterx.model.responses;

import com.mangox.newsletterx.model.EmailSender;
import com.mangox.newsletterx.model.entities.Sender;
import com.mangox.newsletterx.model.responses.main.SuperResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SenderResponse extends SuperResponse {
    EmailSender sender;
}

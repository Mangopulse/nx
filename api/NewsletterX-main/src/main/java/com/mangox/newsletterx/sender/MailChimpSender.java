package com.mangox.newsletterx.sender;

import com.mangox.newsletterx.model.entities.Sender;
import com.mangox.newsletterx.service.ExternalAPIs;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class MailChimpSender implements ThirdPartyEmailSender{
    private final ExternalAPIs externalAPIs;
    @Override
    public boolean sendHtmlEmail(String senderEmail, String receiverEmail, String subject, String html, Sender sender) throws IOException {
        //return externalAPIs.sendMailChimpEmail(senderEmail, receiverEmail, html, subject, sender.getMailChimpAPIKey());
        return false;
    }
}


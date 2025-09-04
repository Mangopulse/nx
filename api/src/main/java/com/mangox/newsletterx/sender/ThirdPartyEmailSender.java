package com.mangox.newsletterx.sender;

import com.mangox.newsletterx.model.entities.Sender;

import java.io.IOException;

public interface ThirdPartyEmailSender {
    public boolean sendHtmlEmail(String senderEmail, String receiverEmail, String subject, String html, Sender sender) throws IOException;
}

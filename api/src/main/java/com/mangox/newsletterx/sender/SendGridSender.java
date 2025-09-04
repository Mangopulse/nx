package com.mangox.newsletterx.sender;


import com.mangox.newsletterx.model.entities.Sender;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class SendGridSender implements ThirdPartyEmailSender{
    @Override
    public boolean sendHtmlEmail(String senderEmail, String receiverEmail, String subject, String html, Sender sender) throws IOException {
        Email from = new Email(senderEmail);
        Email to = new Email(receiverEmail);
        Content content = new Content("text/html", html);

        Mail mail = new Mail(from, subject, to, content);
        SendGrid sg = new SendGrid(sender.getSendgridAPIKey());
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            return response.getStatusCode() == 202;
        } catch (IOException e) {
            throw e;
        }
    }
}


package com.mangox.newsletterx.sender;


import com.mangox.newsletterx.model.entities.Sender;
import com.mangox.newsletterx.model.enums.EnvVariables;
import com.mangox.newsletterx.service.EnvVarsService;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class DefaultSender implements ThirdPartyEmailSender{
    private final EnvVarsService envVarsService;
    @Override
    public boolean sendHtmlEmail(String senderEmail, String receiverEmail, String subject, String html, Sender sender) throws IOException {
        Email from = new Email(senderEmail);
        Email to = new Email(receiverEmail);
        Content content = new Content("text/html", html);

        Mail mail = new Mail(from, subject, to, content);
        SendGrid sg = new SendGrid(envVarsService.getEnvironmentVariable(EnvVariables.SENDGRID_API_KEY.name()));
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


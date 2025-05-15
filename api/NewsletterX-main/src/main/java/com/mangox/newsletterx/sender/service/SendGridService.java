package com.mangox.newsletterx.sender.service;

import com.mangox.newsletterx.helper.GsonHelper;
import com.mangox.newsletterx.model.EmailSender;
import com.mangox.newsletterx.model.SendGridSender;
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
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SendGridService {
    private final SpringTemplateEngine templateEngine;
    private final GsonHelper gsonHelper;
    private final EnvVarsService envVarsService;

    private static final String NICK_NAME = "nickname";
    private static final String FROM = "from";
    private static final String EMAIL = "email";
    private static final String NAME = "name";
    private static final String REPLY_TO = "reply_to";
    private static final String ADDRESS = "address";
    private static final String ADDRESS_2 = "address_2";
    private static final String CITY = "city";
    private static final String STATE = "state";
    private static final String ZIP = "zip";
    private static final String COUNTRY = "country";
    public void sendText(String sender, String receiver, String subject, String text) throws IOException {
        Email from = new Email(sender);
        Email to = new Email(receiver);
        Content content = new Content("text/plain", text);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(envVarsService.getEnvironmentVariable(EnvVariables.SENDGRID_API_KEY.name()));
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            log.info("Response code: {}", response.getStatusCode());
        } catch (IOException ex) {
            throw ex;
        }
    }

    public boolean sendHtml(String sender, String receiver, String subject, String htmlBody) throws IOException {
        Email from = new Email(sender);
        Email to = new Email(receiver);
        Content content = new Content("text/html", htmlBody);

        Mail mail = new Mail(from, subject, to, content);
        SendGrid sg = new SendGrid(envVarsService.getEnvironmentVariable(EnvVariables.SENDGRID_API_KEY.name()));
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            log.info("Response code: {}", response.getStatusCode());
            return response.getStatusCode() == 202;
        } catch (IOException e) {
            throw e;
        }
    }

    public boolean sendHtmlTemplateEmail(String from, String to, String subject, String template, Map<String, Object> templateModel) throws IOException {
        Context thymeleafContext = new Context();
        thymeleafContext.setVariables(templateModel);

        String htmlBody = templateEngine.process("/" + template, thymeleafContext);

        return sendHtml(from, to, subject, htmlBody);
    }

    public HashMap<String, EmailSender> getSenders() throws IOException {
        try {
            SendGrid sg = new SendGrid(envVarsService.getEnvironmentVariable(EnvVariables.SENDGRID_API_KEY.name()));
            Request request = new Request();
            request.setMethod(Method.GET);
            request.setEndpoint("/senders");
            Response response = sg.api(request);
            List<SendGridSender> senders = gsonHelper.sendersDeserialize(response.getBody());
            HashMap<String,EmailSender> sendersEmails = new HashMap<>();
            for(SendGridSender sender : senders){
                Long id = sender.getId();
                String name = sender.getNickname();
                String  email = sender.getFrom().getEmail();
                Boolean verified = sender.getVerified().isStatus();
                Boolean locked = sender.isLocked();
                sendersEmails.put(email, new EmailSender(id,name,email,verified,locked));
            }
            return sendersEmails;
        } catch (IOException ex) {
            throw ex;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    public  EmailSender getSender(String idString) throws IOException {
        try {
            SendGrid sg = new SendGrid(envVarsService.getEnvironmentVariable(EnvVariables.SENDGRID_API_KEY.name()));
            Request request = new Request();
            request.setMethod(Method.GET);
            request.setEndpoint("/senders/"+idString);
            Response response = sg.api(request);
            SendGridSender sender = gsonHelper.senderDeserialize(response.getBody());
            Long id = sender.getId();
            String name = sender.getNickname();
            String  email = sender.getFrom().getEmail();
            Boolean verified = sender.getVerified().isStatus();
            Boolean locked = sender.isLocked();
            return new EmailSender(id,name,email,verified,locked);
        } catch (IOException ex) {
            return null;
        }
    }
    public int createSender(String appDomain, String email, String name, String address) throws IOException {
        try {
            SendGrid sg = new SendGrid(envVarsService.getEnvironmentVariable(EnvVariables.SENDGRID_API_KEY.name()));
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("/senders");
            JSONObject body = new JSONObject();
            body.put(NICK_NAME, appDomain + " Sender "+ UUID.randomUUID().toString());

            JSONObject from = new JSONObject();
            from.put(EMAIL, email);
            from.put(NAME, name);
            body.put(FROM, from);

            JSONObject reply_to = new JSONObject();
            reply_to.put(EMAIL, email);
            reply_to.put(NAME, name);
            body.put(REPLY_TO, reply_to);

            body.put(ADDRESS, address);
            body.put(ADDRESS_2, "Lebanon, Beirut");
            body.put(CITY, "Beirut");
            body.put(STATE, "Beirut");
            body.put(ZIP, "0000");
            body.put(COUNTRY, "Lebanon");

            request.setBody(body.toString());
            Response response = sg.api(request);
            return response.getStatusCode();
        } catch (IOException ex) {
            throw ex;
        }
    }
    public int updateSender(long id, String appDomain, String email, String name, String address)throws IOException {
        try{
            SendGrid sg = new SendGrid(envVarsService.getEnvironmentVariable(EnvVariables.SENDGRID_API_KEY.name()));
            Request request = new Request();
            request.setMethod(Method.PATCH);
            request.setEndpoint("/senders/"+id);
            JSONObject body = new JSONObject();
            body.put(NICK_NAME, appDomain + " Sender");

            JSONObject from = new JSONObject();
            from.put(EMAIL, email);
            from.put(NAME, name);
            body.put(FROM, from);

            JSONObject reply_to = new JSONObject();
            reply_to.put(EMAIL, email);
            reply_to.put(NAME, name);
            body.put(REPLY_TO, reply_to);

            body.put(ADDRESS, address);
            body.put(ADDRESS_2, "Lebanon, Beirut");
            body.put(CITY, "KSA");
            body.put(STATE, "RIYAD");
            body.put(ZIP, "0000");
            body.put(COUNTRY, "SAUDI ARABIA");

            request.setBody(body.toString());
            Response response = sg.api(request);
            return response.getStatusCode();
        } catch (IOException ex) {
            throw ex;
        }
    }

}

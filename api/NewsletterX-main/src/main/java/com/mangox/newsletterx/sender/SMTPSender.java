package com.mangox.newsletterx.sender;


import com.mangox.newsletterx.model.entities.Sender;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.util.Properties;

@Service
@RequiredArgsConstructor
public class SMTPSender implements ThirdPartyEmailSender{
    @Override
    public boolean sendHtmlEmail(String senderEmail, String receiverEmail, String subject, String html, Sender sender) throws IOException {
        Session session = null;
        Properties props = new Properties();
        props.put("mail.smtp.host", sender.getSmtpHost());
        props.put("mail.smtp.port", sender.getSmtpPort());


        //If security is TLS
        if(sender.getSmtpSecurityType().equals("TLS")){
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.ssl.protocols", sender.getSmtpSSLProtocol());

            //If security is SSL
        }else if(sender.getSmtpSecurityType().equals("SSL")){
            props.put("mail.smtp.socketFactory.port", sender.getSmtpPort());
            props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
            props.put("mail.smtp.ssl.protocols", sender.getSmtpSSLProtocol());
        }

        if(sender.isUseSMTPAuth()) {
            props.put("mail.smtp.auth", "true");
            session = Session.getInstance(props,
                    new javax.mail.Authenticator() {
                        protected PasswordAuthentication getPasswordAuthentication() {
                            return new PasswordAuthentication(sender.getSmtpUserName(), sender.getSmtpPassword());
                        }
                    });
        }else{
            session = Session.getInstance(props);
        }


        try {
            // Create a default MimeMessage object.
            Message message = new MimeMessage(session);

            // Set From: header field of the header.
            message.setFrom(new InternetAddress(senderEmail));

            // Set To: header field of the header.
            message.setRecipients(Message.RecipientType.TO,
                    InternetAddress.parse(receiverEmail));

            // Set Subject: header field
            message.setSubject(subject);

            // Send the actual HTML message, as big as you like
            message.setContent(html, "text/html; charset=UTF-8");
            // Send message
            Transport.send(message);
            return true;

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}

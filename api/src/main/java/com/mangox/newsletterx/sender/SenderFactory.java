package com.mangox.newsletterx.sender;


import com.mangox.newsletterx.exception.ErrorException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SenderFactory {

    private final SendGridSender sendGridSender;
    private final MailChimpSender mailChimpSender;
    private final DefaultSender defaultSender;
    private final SMTPSender smtpSender;

    private static final String SENDGRID_SENDER = "sendgrid";
    private static final String DEFAULT_SENDER = "cx_sendgrid_default";
    private static final String MAILCHIMP_SENDER = "mailchimp";
    private static final String SMTP_SENDER = "smtp";

    public ThirdPartyEmailSender getService(String type) throws ErrorException {
        if(type == null || type.equals(SENDGRID_SENDER))
            return sendGridSender;
        if(type.equals(DEFAULT_SENDER))
            return defaultSender;
        if(type.equals(MAILCHIMP_SENDER))
            return mailChimpSender;
        if(type.equals(SMTP_SENDER))
            return smtpSender;
        return null;
    }
}


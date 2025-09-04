package com.mangox.newsletterx.service;

import com.mangox.newsletterx.exception.ErrorException;
import com.mangox.newsletterx.model.EmailSender;
import com.mangox.newsletterx.model.entities.Sender;
import com.mangox.newsletterx.model.entities.Website;
import com.mangox.newsletterx.model.request.UpdateSenderRequest;
import com.mangox.newsletterx.model.responses.SenderResponse;
import com.mangox.newsletterx.model.responses.configs.ConfigurationResponse;
import com.mangox.newsletterx.model.responses.configs.WebsiteConfigsResponse;
import com.mangox.newsletterx.repositories.SenderRepository;
import com.mangox.newsletterx.repositories.WebsiteRepository;
import com.mangox.newsletterx.sender.service.SendGridService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WebsiteService {
    private final WebsiteRepository websiteRepository;
    private final SendGridService sendgridService;
    private final SenderRepository senderRepository;

    private static final List<String> SENDER_TYPES = Arrays.asList("sendgrid", "mailchimp", "cx_sendgrid_default", "smtp");
    private static final String DEFAULT_SENDER = "cx_sendgrid_default";
    private static final String SENDGRID_SENDER = "sendgrid";
    private static final String MAILCHIMP_SENDER = "mailchimp";
    private static final String SMTP_SENDER = "smtp";

    HashMap<String,ConfigurationResponse> configsMap = new HashMap<>();

    public Website updateWebsiteCollector(String link, String collector) throws Exception {
        Optional<Website> optWebsite = websiteRepository.findByLink(link);
        if (optWebsite.isEmpty())
            throw new ErrorException("Website was not found !");
        Website website = optWebsite.get();
        website.setCollector(collector);
        return websiteRepository.save(website);
    }

    public Website getWebsite(String link) throws Exception {
        Optional<Website> website = websiteRepository.findByLink(link);
        if (website.isEmpty())
            throw new ErrorException("Website was not found !");
        return website.get();
    }

    public ConfigurationResponse getConfigs(String link) throws Exception {
        if(configsMap.containsKey(link))
            return configsMap.get(link);
        Optional<Website> optWebsite = websiteRepository.findByLink(link);
        if (optWebsite.isEmpty())
            throw new ErrorException("Website was not found !");
        Website website = optWebsite.get();
        ConfigurationResponse configsObject = new ConfigurationResponse(website.getCollector());
        configsMap.put(link, configsObject);
        return configsObject;
    }

    public WebsiteConfigsResponse getUserWebsiteConfigs(String link) throws Exception {
        Optional<Website> optWebsite = websiteRepository.findByLink(link);
        if (optWebsite.isEmpty())
            throw new ErrorException("Website was not found !");
        Website website = optWebsite.get();
        Optional<Sender> sender = senderRepository.findById(website.getSender().getId());
        if(sender.isEmpty())
            throw new ErrorException("Failed to get sender");
        return new WebsiteConfigsResponse(website,sender.get());
    }

    public SenderResponse updateSenderSettings(String link, String type, String ApiKey, String email, String smtpUserName, String smtpPassword, String smtpHost, String smtpPort,boolean useAuth, String securityType, String user) throws Exception {
        Sender sender = senderRepository.findByWebsite(link);

        if(email == null || email.isEmpty())
            throw new ErrorException("Invalid Email");

        if (!SENDER_TYPES.contains(type))
            throw new ErrorException("This Type is not Available");

        Website website = websiteRepository.findByLink(link).orElse(null);
        if (website == null)
            throw new ErrorException(" Website was not found !");

        sender.setSenderType(type);
        if (type.equals(SENDGRID_SENDER)) {
            if (ApiKey == null || ApiKey.isEmpty())
                throw new ErrorException("The API Key is Empty");
            sender.setSendgridAPIKey(ApiKey);
        }
        if (type.equals(MAILCHIMP_SENDER)) {
            if (ApiKey == null || ApiKey.isEmpty())
                throw new ErrorException("The API Key is Empty");
            sender.setMailChimpAPIKey(ApiKey);
        }

        if(type.equals(SMTP_SENDER)){
            if(smtpUserName == null || smtpUserName.isEmpty() || smtpPassword == null || smtpPassword.isEmpty() || smtpHost == null || smtpHost.isEmpty() || smtpPort == null || smtpPort.isEmpty())
                throw new ErrorException("SMTP Fields can't be empty");
            sender.setUseSMTPAuth(useAuth);
            if(sender.isUseSMTPAuth()){
                sender.setSmtpUserName(smtpUserName);
                sender.setSmtpPassword(smtpPassword);
            }
            sender.setSmtpHost(smtpHost);
            sender.setSmtpPort(smtpPort);
            sender.setSmtpSecurityType(securityType);
            if(securityType.equals("SSL")){
                sender.setSmtpSSLProtocol("SSLv2.0");
            }else{
                sender.setSmtpSSLProtocol("TLSv1.2");
            }

        }

        senderRepository.save(sender);
        return updateSender(website.getLink(),user, new UpdateSenderRequest(null, email));

    }

    public SenderResponse updateSender(String websiteLink, String user, UpdateSenderRequest senderRequest) throws Exception {
        Website website = websiteRepository.findByLink(websiteLink).orElse(null);
        if (website == null)
            throw new ErrorException(" Website was not found !");

        Sender sender = senderRepository.findByWebsite(websiteLink);
        if (sender == null)
            throw new ErrorException("Sender for Website was not found !");

        if (senderRequest.getId() == null && sender.getSenderType().equals(DEFAULT_SENDER)){
            HashMap<String, EmailSender> sendGridSenders = sendgridService.getSenders();
            if (!sendGridSenders.containsKey(senderRequest.getEmail())) {
                int code = sendgridService.createSender(websiteLink, senderRequest.getEmail(), user, "Riyad, KSA");
                if (code != 201)
                    throw new ErrorException("Failed to create the Sender for domain " + websiteLink + " sender : " + sender + " by user " + user);
            }
            senderRepository.save(updateInitial(senderRequest.getEmail(), sender));
            return new SenderResponse(sender.generateSender());
        }if (sender.getSenderType().equals(DEFAULT_SENDER)) {
            int code = sendgridService.updateSender(senderRequest.getId(), websiteLink, senderRequest.getEmail(), user, "Riyad, KSA");
            if (code != 200)
                throw new ErrorException("Failed to update the Sender for domain " + websiteLink + " sender : " + senderRequest.getEmail() + " by user " + user);
            senderRepository.save(updateInitial(senderRequest.getEmail(), sender));
            return new SenderResponse(sender.generateSender());
        }if (sender.getSenderType().equals(SENDGRID_SENDER)) {
            sender.setSenderId(1L);
            sender.setName(websiteLink + " sender");
            sender.setVerified(true);
            sender.setLocked(false);
            sender.setEmail(senderRequest.getEmail());
        }if (sender.getSenderType().equals(MAILCHIMP_SENDER)) {
            sender.setSenderId(2L);
            sender.setName(websiteLink + " sender");
            sender.setVerified(true);
            sender.setLocked(false);
            sender.setEmail(senderRequest.getEmail());
        }if (sender.getSenderType().equals(SMTP_SENDER)) {
            sender.setSenderId(3L);
            sender.setName(websiteLink + " sender");
            sender.setVerified(true);
            sender.setLocked(false);
            sender.setEmail(senderRequest.getEmail());
        }
        senderRepository.save(sender);
        return new SenderResponse(sender.generateSender());
    }

    public Sender updateInitial(String email, Sender sender) throws IOException {
        HashMap<String, EmailSender> sendGridSenders = sendgridService.getSenders();
        if (sendGridSenders.containsKey(email))
            sender.updateSender(sendGridSenders.get(email));
        return sender;
    }

    public SenderResponse getSender(Long id) throws Exception {
        if (id == 0L)
            throw new ErrorException("The sender is not created yet ; please create a sender!");
        EmailSender sendGridSender = sendgridService.getSender(Long.toString(id));
        if (sendGridSender == null)
            throw new ErrorException("The id is invalid !");
        Sender sender = senderRepository.findBySenderId(sendGridSender.getId());
        sender.updateSender(sendGridSender);
        senderRepository.save(sender);
        return new SenderResponse(sender.generateSender());
    }

    public SenderResponse getSender(Long id, String website) throws Exception {
        if(id == 1L || id == 2L) {
            Sender sender = senderRepository
                    .findByWebsite(website);
            if(sender == null)
                throw new ErrorException("The id is invalid !");
            return new SenderResponse(sender.generateSender());
        }else {
            return getSender(id);
        }
    }
}

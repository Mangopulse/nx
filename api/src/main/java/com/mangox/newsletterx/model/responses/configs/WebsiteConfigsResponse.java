package com.mangox.newsletterx.model.responses.configs;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mangox.newsletterx.model.entities.Sender;
import com.mangox.newsletterx.model.entities.Website;
import com.mangox.newsletterx.model.responses.main.SuperResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WebsiteConfigsResponse extends SuperResponse {

    Map collector;
    Boolean isActive;
    Boolean analyticsEnabled;
    String website;
    String packageType;
    String apiKey;
    String senderType;
    Integer emailQuota;
    String senderEmail;
    public WebsiteConfigsResponse(Website website, Sender sender) throws JsonProcessingException {
        super();
        this.collector = new ObjectMapper().readValue(website.getCollector(), Map.class);
        this.isActive = website.isActive();
        this.analyticsEnabled = website.isAnalyticsEnabled();
        this.website = website.getLink();
        this.packageType = website.getPackageType();
        this.emailQuota = website.getEmailsQuota();
        this.apiKey = getKey(sender);
        this.senderType = sender.getSenderType();
        this.senderEmail = sender.getEmail();

    }

    private String getKey(Sender sender){
        if (sender.getSenderType() == null || sender.getSenderType().isEmpty())
            return null;
        if(sender.getSenderType().equals("cx_sendgrid_default"))
            return "";
        if(sender.getSenderType().equals("sendgrid"))
            return sender.getSendgridAPIKey();
        if(sender.getSenderType().equals("mailchimp"))
            return sender.getMailChimpAPIKey();
        return null;
    }
}


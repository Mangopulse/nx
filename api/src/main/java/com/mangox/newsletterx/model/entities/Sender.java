package com.mangox.newsletterx.model.entities;

import com.mangox.newsletterx.model.EmailSender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "senders")
public class Sender {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String website;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    private String name;

    private String email;

    private Boolean verified;

    private Boolean locked;

    @Column(name = "sendgrid_api_key")
    private String sendgridAPIKey;

    @Column(name = "mailchimp_api_key")
    private String mailChimpAPIKey;

    @Column(name = "smtp_username")
    private String smtpUserName;

    @Column(name = "smtp_password")
    private String smtpPassword;

    @Column(name = "smtp_host")
    private String smtpHost;

    @Column(name = "smtp_port")
    private String smtpPort;

    @Column(name = "smtp_ssl_protocol")
    private String smtpSSLProtocol;

    @Column(name = "sender_type")
    private String senderType;

    @Column(name = "use_smtp_auth")
    private boolean useSMTPAuth;

    @Column(name = "smtp_security_type")
    private String smtpSecurityType;

    public Sender(String website) {
        this.senderId = 0L;
        this.website = website;
        this.name = "";
        this.email = "";
        this.verified = false;
        this.locked = true;
        this.sendgridAPIKey = "";
        this.mailChimpAPIKey = "";
        this.smtpUserName = "";
        this.smtpPassword = "";
        this.smtpHost = "";
        this.smtpPort = "";
        this.smtpSSLProtocol = "TLSv1.2";
        this.senderType = "cx_sendgrid_default";
        this.useSMTPAuth = true;
        this.smtpSecurityType = "TLS";
    }

    public EmailSender generateSender() {
        return new EmailSender(this.senderId, this.name, this.email, this.verified, this.locked);
    }

    public void updateSender(EmailSender sendGridSender) {
        this.setSenderId(sendGridSender.getId());
        this.setName(sendGridSender.getName());
        this.setVerified(sendGridSender.getVerified());
        this.setLocked(sendGridSender.getLocked());
        this.setEmail(sendGridSender.getEmail());
    }
}

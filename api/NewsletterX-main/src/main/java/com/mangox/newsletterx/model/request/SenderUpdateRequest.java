package com.mangox.newsletterx.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SenderUpdateRequest {
    private String senderType;
    private String apiKey;
    private String email;
    private String smtpUserName;
    private String smtpPassword;
    private String smtpHost;
    private String smtpPort;
    private String smtpSSLProtocol;
    private boolean useAuth;
    private String securityType;
}

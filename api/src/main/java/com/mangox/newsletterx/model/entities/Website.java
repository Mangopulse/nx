package com.mangox.newsletterx.model.entities;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "websites")
public class Website {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generate primary key
    private Long id;

    private String link;

    @Column(name = "package_type")
    private String packageType;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", referencedColumnName = "id", nullable = false)
    private Sender sender;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "newsletter_id", referencedColumnName = "id", nullable = false)
    private EmailNewsletter emailNewsletter;

    @Column(name = "collector", columnDefinition = "TEXT")
    private String collector;

    @Column(name = "emails_quota")
    private Integer emailsQuota;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "analytics_enabled")
    private boolean analyticsEnabled;

    public Website(String link, User user, Sender sender, EmailNewsletter emailNewsletter) {
        this.link = link;
        this.user = user;
        this.sender = sender;
        this.emailNewsletter = emailNewsletter;
        this.packageType = "freemium";
        this.isActive = true;
        this.analyticsEnabled = false;
        this.emailsQuota = 10;
        this.collector = """
            {
                "titleText": "Subscribe to our email newsletter",
                "subtitleText": "Don't miss out on anything!",
                "buttonText": "Subscribe",
                "type": "bottom-popup",
                "template": "template-basic",
                "isActive": true
            }
            """;
    }
}

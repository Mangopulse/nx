package com.mangox.newsletterx.model.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "email_newsletter_subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmailNewsletterSubscriptions {

    @Id
    @Column(name = "id", nullable = false, unique = true)
    private String id;

    @Column(name = "app_domain", nullable = false)
    private String appDomain;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "country")
    private String country;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "user_id", nullable = false, unique = true)
    private String userId;

    @Column(name = "verification_token")
    private String verificationToken;

    @Column(name = "subscription_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date subscriptionDate;

    @Column(name = "last_modified_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastModifiedDate;

    @Column(name = "imported", nullable = false)
    private boolean imported;

    @Column(name = "verified", nullable = false)
    private boolean verified;

    @Column(name = "unsubscribed", nullable = false)
    private boolean unsubscribed;

    public EmailNewsletterSubscriptions(String appDomain, String userId, String email, String verificationToken) {
        this.id = appDomain + "_" + email;
        this.appDomain = appDomain;
        this.email = email;
        this.userId = userId;
        this.firstName = "";
        this.lastName = "";
        this.country = "";
        this.phone = "";
        this.verificationToken = verificationToken;
        this.subscriptionDate = new Date();
        this.lastModifiedDate = new Date();
        this.verified = false;
        this.unsubscribed = false;
        this.imported = false;
    }

    public EmailNewsletterSubscriptions(String appDomain, String email, String firstName, String lastName, String country, String phone) {
        String userId = UUID.randomUUID().toString();
        this.id = appDomain + "_" + userId;
        this.appDomain = appDomain;
        this.email = email;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.country = country;
        this.phone = phone;
        this.verificationToken = "";
        this.subscriptionDate = new Date();
        this.lastModifiedDate = new Date();
        this.verified = true;
        this.unsubscribed = false;
        this.imported = true;
    }
}


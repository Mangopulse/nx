package com.mangox.newsletterx.model.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "website_email_newsletters")
public class EmailNewsletter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String website;

    @Column(nullable = false)
    private String title;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @Lob
    @Column(name = "html_components", columnDefinition = "TEXT")
    private String htmlComponents;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String hour;

    @Column(nullable = false)
    private String day;

    @Column(nullable = false)
    private String subject;

    public EmailNewsletter(String website, String title, String htmlComponents) {
        this.website = website;
        this.title = title;
        this.htmlComponents = htmlComponents;
        this.isActive = true;
        this.type = "weekly";
        this.hour = "9";
        this.day = "monday";
        this.subject = "إخترنا لك";
    }
}

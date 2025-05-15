package com.mangox.newsletterx.model.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "scheduled_emails")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledEmails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date date;

    @Column(nullable = false)
    private String domain;

    @Column(nullable = false)
    private Long count;

    @ElementCollection
    @CollectionTable(name = "scheduled_emails_list", joinColumns = @JoinColumn(name = "scheduled_email_id"))
    @Column(name = "emails")
    private List<String> emails;

    public ScheduledEmails(String type, String domain) {
        this.type = type;
        this.date = new Date();
        this.domain = domain;
        this.count = 0L;
        this.emails = new ArrayList<>();
    }
}
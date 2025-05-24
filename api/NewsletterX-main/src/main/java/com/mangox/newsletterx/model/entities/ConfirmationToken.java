package com.mangox.newsletterx.model.entities;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "confirmation_tokens")
public class ConfirmationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private Long id;

    @Column(nullable = false, unique = true) // Token must be unique
    private String token;

    @Temporal(TemporalType.TIMESTAMP) // Store creation date with timestamp
    @Column(name = "creation_date", nullable = false)
    private Date creationDate;

    @ManyToOne(fetch = FetchType.LAZY) // User relationship
    @JoinColumn(name = "user_id", nullable = false) // Foreign key column
    private User user;

    // Constructor to initialize fields
    public ConfirmationToken(User user) {
        this.token = UUID.randomUUID().toString();
        this.creationDate = new Date();
        this.user = user;
    }

    // Method to check if the token has expired
    public boolean isResetPasswordTokenExpired() {
        long currentTimeMillis = System.currentTimeMillis();
        long twentyMinutesInMillis = 20 * 60 * 1000;
        return (currentTimeMillis - creationDate.getTime()) > twentyMinutesInMillis;
    }
}

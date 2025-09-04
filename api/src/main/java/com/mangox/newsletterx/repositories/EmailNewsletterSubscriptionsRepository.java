package com.mangox.newsletterx.repositories;

import com.mangox.newsletterx.model.entities.EmailNewsletterSubscriptions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Map;

// This repository is used to manage the email newsletter subscriptions and the confirmation emails
public interface EmailNewsletterSubscriptionsRepository extends JpaRepository<EmailNewsletterSubscriptions, String> {

        // This query is used to get the subscriptions by domain
        @Query("SELECT e FROM EmailNewsletterSubscriptions e WHERE e.appDomain = :appDomain AND e.verified = true AND e.unsubscribed = false")
        List<EmailNewsletterSubscriptions> getSubscriptionsByDomain(String appDomain);

        // This query is used to get the subscriptions by domain with pagination
        @Query(value = "SELECT * FROM email_newsletter_subscriptions e WHERE e.app_domain = :appDomain AND e.verified = true AND e.unsubscribed = false LIMIT :limit OFFSET :offset", nativeQuery = true)
        List<EmailNewsletterSubscriptions> getSubscriptionsByDomainWithPagination(String appDomain, int limit,
                        int offset);

        // This query is used to check if the email is already subscribed to the domain
        Boolean existsByEmailAndAppDomain(String email, String domain);

        

        EmailNewsletterSubscriptions findByEmailAndAppDomain(String email, String domain);

        @Query("SELECT e FROM EmailNewsletterSubscriptions e WHERE e.verificationToken = :token")
        EmailNewsletterSubscriptions findByVerificationToken(String token);

        @Query("SELECT COUNT(e) FROM EmailNewsletterSubscriptions e " +
                        "WHERE e.appDomain = :appDomain " +
                        "AND e.verified = true " +
                        "AND e.unsubscribed = false")
        long countVerifiedAndSubscribedUsers(String appDomain);

        @Query("SELECT COUNT(e) FROM EmailNewsletterSubscriptions e " +
                        "WHERE e.appDomain = :appDomain " +
                        "AND e.verified = false " +
                        "AND e.unsubscribed = false")
        long countUnverifiedAndSubscribedUsers(String appDomain);

        @Query("SELECT COUNT(e) FROM EmailNewsletterSubscriptions e " +
                        "WHERE e.appDomain = :appDomain " +
                        "AND e.unsubscribed = true")
        long countUnSubscribedUsers(String appDomain);

}

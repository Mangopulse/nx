package com.mangox.newsletterx.repositories;

import com.mangox.newsletterx.model.entities.EmailNewsletter;
import com.mangox.newsletterx.model.entities.Sender;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmailNewsletterRepository extends JpaRepository<EmailNewsletter, Long> {
    List<EmailNewsletter> findByWebsite(String website);

    @Query("SELECT e FROM EmailNewsletter e WHERE e.isActive = true")
    List<EmailNewsletter> getActiveNewsletters();

}

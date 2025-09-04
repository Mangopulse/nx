package com.mangox.newsletterx.repositories;

import com.mangox.newsletterx.model.entities.EmailNewsletterSubscriptions;
import com.mangox.newsletterx.model.entities.EnvVars;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EnvVarRepository extends JpaRepository<EnvVars,Long> {
    Optional<EnvVars> findByKey(String key);
}

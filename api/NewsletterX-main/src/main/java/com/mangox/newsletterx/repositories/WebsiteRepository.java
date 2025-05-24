package com.mangox.newsletterx.repositories;


import com.mangox.newsletterx.model.entities.Website;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WebsiteRepository extends JpaRepository<Website, Long> {

    Optional<Website> findByLink(String link);

    @Query("SELECT w FROM Website w WHERE w.isActive = true")
    List<Website> findAllActiveWebsites();

    @Query("SELECT w.link FROM Website w")
    List<String> findAllWebsiteLinks();
}
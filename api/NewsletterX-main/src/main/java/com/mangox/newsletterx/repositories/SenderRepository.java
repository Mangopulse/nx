package com.mangox.newsletterx.repositories;

import com.mangox.newsletterx.model.entities.Sender;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SenderRepository extends JpaRepository<Sender, Long> {

    List<Sender> findAllByVerified(boolean verified);

    Sender findByWebsite(String website);

    Sender findBySenderId(Long senderId);

    @Query("SELECT s FROM Sender s WHERE s.id = :id")
    Optional<Sender> findById(@Param("id") Long id);
}

package com.mangox.newsletterx.repositories;

import com.mangox.newsletterx.model.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmailAndEnabled(String email, Boolean enabled);
    Boolean existsByWebsiteAndEnabled(String website, Boolean enabled);


}
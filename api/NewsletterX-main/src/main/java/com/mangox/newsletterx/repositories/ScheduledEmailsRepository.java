package com.mangox.newsletterx.repositories;

import com.mangox.newsletterx.model.entities.ScheduledEmails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface ScheduledEmailsRepository extends JpaRepository<ScheduledEmails,Long> {
    @Query("SELECT SUM(se.count) FROM ScheduledEmails se WHERE se.domain = :domain")
    Long getTotalEmailsSentForDomain(@Param("domain") String domain);

    @Query("SELECT SUM(se.count) FROM ScheduledEmails se WHERE se.domain = :domain AND se.date BETWEEN :startDate AND :endDate")
    Long getTotalEmailsSentForDomainBetweenDates(@Param("domain") String domain, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

}

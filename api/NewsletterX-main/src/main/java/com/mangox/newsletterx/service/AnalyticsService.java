package com.mangox.newsletterx.service;

import com.mangox.newsletterx.model.responses.AnalyticsResponse;
import com.mangox.newsletterx.repositories.EmailNewsletterSubscriptionsRepository;
import com.mangox.newsletterx.repositories.ScheduledEmailsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final EmailNewsletterSubscriptionsRepository emailNewsletterSubscriptionsRepository;
    private final ScheduledEmailsRepository scheduledEmailsRepository;

    private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    public Long getVerifiedSubscribersCount(String domain) {
       return emailNewsletterSubscriptionsRepository.countVerifiedAndSubscribedUsers(domain);
    }

    public TreeMap<String, Long> getVerifiedSubscribersCountByDate(String domain, Date from, Date to) {
//        List<Map.Entry<Date, Long>> dailyCounts = emailNewsletterSubscriptionsRepository.countVerifiedAndSubscribedUsersByDate(
//                domain,
//                from,
//                to
//        );
//
//        return convertMap(dailyCounts);
        return null;
    }

    public Long getUnverifiedSubscribersCount(String domain) {
        return emailNewsletterSubscriptionsRepository.countUnverifiedAndSubscribedUsers(domain);
    }

    public TreeMap<String, Long> getUnVerifiedSubscribersCountByDate(String domain, Date from, Date to) {
//        List<Map.Entry<Date, Long>> dailyCounts = emailNewsletterSubscriptionsRepository.countUnVerifiedAndSubscribedUsersByDate(
//                domain,
//                from,
//                to
//        );
//
//        return convertMap(dailyCounts);
        return null;
    }

    public Long getUnSubscribersCount(String domain) {
        return emailNewsletterSubscriptionsRepository.countUnSubscribedUsers(domain);
    }

    public TreeMap<String, Long> getUnSubscribersCountByDate(String domain, Date from, Date to) {
//        List<Map.Entry<Date, Long>> dailyCounts = emailNewsletterSubscriptionsRepository.countUnSubscribedUsersByDate(
//                domain,
//                from,
//                to
//        );
//
//        return convertMap(dailyCounts);
        return null;
    }

    public Long getSentEmailCount(String domain) {
        return scheduledEmailsRepository.getTotalEmailsSentForDomain(domain);
    }

    public Long getSentEmailCountAndDate(String domain, Date from, Date to) {
        return scheduledEmailsRepository.getTotalEmailsSentForDomainBetweenDates(domain,from,to);
    }

    private TreeMap<String,Long> convertMap(List<Map.Entry<Date, Long>> dailyCounts){
        TreeMap<String, Long> countWithDate = new TreeMap<>();
        for (Map.Entry<Date, Long> entry : dailyCounts) {
            // Convert Date to String format (e.g., yyyy-MM-dd)
            String dateString = sdf.format(entry.getKey());
            countWithDate.put(dateString, entry.getValue());
        }

        return countWithDate;
    }
}

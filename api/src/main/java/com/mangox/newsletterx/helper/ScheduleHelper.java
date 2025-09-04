package com.mangox.newsletterx.helper;

import com.mangox.newsletterx.model.components.Schedule;
import com.mangox.newsletterx.model.entities.EmailNewsletter;
import lombok.extern.slf4j.Slf4j;
import org.apache.juli.logging.Log;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.logging.Logger;

@Component
@Slf4j
public class ScheduleHelper {

    private static final String DAILY = "daily";
    private static final String WEEKLY = "weekly";
    private static final String MONTHLY = "monthly";

    public boolean scheduledNow(EmailNewsletter emailNewsletter) {
        try {
            log.info(emailNewsletter.getWebsite() + " is scheduled " + emailNewsletter.getType() + " @" + emailNewsletter.getHour() + " o clock" + " and day " + emailNewsletter.getDay());
            Schedule schedule = new Schedule(emailNewsletter.getType(), emailNewsletter.getDay(), emailNewsletter.getHour());
            if (schedule.getType() != null) {
                if (schedule.getType().equals(DAILY))
                    return schedule.getHour() != null && checkHour(schedule.getHour());
                if (schedule.getType().equals(WEEKLY))
                    return schedule.getDay() != null && checkDayWeek(schedule.getDay()) && schedule.getHour() != null && checkHour(schedule.getHour());
                if (schedule.getType().equals(MONTHLY))
                    return schedule.getDay() != null && checkDayMonth(schedule.getDay()) && schedule.getHour() != null && checkHour(schedule.getHour());
            }
            return false;
        } catch (Exception e) {
            log.error(e.getMessage());
            return false;
        }
    }

    private boolean checkHour(String scheduledHour) {
        LocalDateTime now = LocalDateTime.now();
        return scheduledHour.equals(Integer.toString(now.getHour()));
    }

    private boolean checkDayWeek(String scheduledDay) {
        LocalDateTime now = LocalDateTime.now();
        return scheduledDay.equalsIgnoreCase(now.getDayOfWeek().name());
    }

    private boolean checkDayMonth(String scheduledDay) {
        LocalDateTime now = LocalDateTime.now();
        return scheduledDay.equals(Integer.toString(now.getDayOfMonth()));
    }
}

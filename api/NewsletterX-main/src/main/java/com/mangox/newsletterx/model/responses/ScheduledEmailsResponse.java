package com.mangox.newsletterx.model.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ScheduledEmailsResponse {
    public String type;
    public Date date;
    public HashMap<String, List<String>> sentMails;
    public List<String> errors;

    public ScheduledEmailsResponse(String type){
        this.type = type;
        this.date = new Date();
        this.sentMails = new HashMap<>();
        this.errors = new ArrayList<>();
    }
}
package com.mangox.newsletterx.model.responses.main;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.util.Date;

@Data
public class SuperResponse {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss")
    private Date timestamp;
    private int code;
    private String status;

    public SuperResponse() {
        this.timestamp = new Date();
        this.code = HttpStatus.OK.value();
        this.status = HttpStatus.OK.name();
    }
}
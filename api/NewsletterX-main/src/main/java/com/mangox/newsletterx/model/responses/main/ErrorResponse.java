package com.mangox.newsletterx.model.responses.main;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.util.Date;

@Data
public class ErrorResponse {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss")
    private Date timestamp;

    private int code;

    private String status;


    private String errorMessage;

    public ErrorResponse() {
        timestamp = new Date();
    }

    public ErrorResponse(HttpStatus httpStatus) {
        this();
        this.code = httpStatus.value();
        this.status = httpStatus.name();
    }

    public ErrorResponse(HttpStatus httpStatus, String errorMessage) {
        this(httpStatus);
        this.errorMessage = errorMessage;
    }
}

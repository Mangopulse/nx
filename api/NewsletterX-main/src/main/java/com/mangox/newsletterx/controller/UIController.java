package com.mangox.newsletterx.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@CrossOrigin
@RequestMapping("/status")
public class UIController {

    @GetMapping("/subscribed")
    public String subscribed(){
        return "subscribed";
    }

    @GetMapping("/unsubscribed")
    public String unsibscribe(){
        return "unsubscribed";
    }

    @GetMapping("/confirmationFailure")
    public String confirmationFailure(){
        return "fail";
    }

    @GetMapping("/confirmationSuccess")
    public String confirmationSuccess(){
        return "success";
    }
}

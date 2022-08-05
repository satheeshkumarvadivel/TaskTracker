package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {

    @GetMapping("/")
    public String getIndex() {
        return "index.html";
    }

    @GetMapping("/home")
    public String getHome() {
        return "home.html";
    }

    @GetMapping("/team")
    public String getTeam() {
        return "manager.html";
    }

    @GetMapping("/signup")
    public String getSignup() {
        return "signup.html";
    }

}

package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
public class WebController {

    @RequestMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        return "forward:/";
    }

//    @GetMapping("/")
//    public String getIndex() {
//        return "/src/index.html";
//    }
//
//    @GetMapping("/home")
//    public String getHome() {
//        return "/src/home.html";
//    }
//
//    @GetMapping("/team")
//    public String getTeam() {
//        return "/src/manager.html";
//    }
//
//    @GetMapping("/signup")
//    public String getSignup() {
//        return "/src/signup.html";
//    }

}

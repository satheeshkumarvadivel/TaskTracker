package com.example.demo.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    String token;
    Long tokenExpiryTime;
    UserModel user;
}

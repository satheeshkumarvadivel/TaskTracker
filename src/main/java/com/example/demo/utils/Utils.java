package com.example.demo.utils;

import com.example.demo.model.BasicResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import javax.xml.bind.DatatypeConverter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class Utils {
    public static ResponseEntity<?> getBasicResponseEntity(int code, String message) {
        switch (code) {
            case 200:
                return new ResponseEntity<>(new BasicResponse(code, message), HttpStatus.OK);
            case 201:
                return new ResponseEntity<>(new BasicResponse(code, message), HttpStatus.CREATED);
            case 400:
                return new ResponseEntity<>(new BasicResponse(code, message), HttpStatus.BAD_REQUEST);
            case 401:
                return new ResponseEntity<>(new BasicResponse(code, message), HttpStatus.UNAUTHORIZED);
            case 403:
                return new ResponseEntity<>(new BasicResponse(code, message), HttpStatus.FORBIDDEN);
            case 409:
                return new ResponseEntity<>(new BasicResponse(code, message), HttpStatus.CONFLICT);
            default:
                return new ResponseEntity<>(new BasicResponse(code, message), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public static String hashString(String plainText) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-512");
        byte[] digest = md.digest(plainText.getBytes(StandardCharsets.UTF_8));
        String hash = DatatypeConverter
                .printHexBinary(digest).toUpperCase();
        return hash;
    }

    public static String hashStringWithSalt(String plainText, long salt) throws NoSuchAlgorithmException {
        return hashString(plainText + ":" + salt);
    }
}

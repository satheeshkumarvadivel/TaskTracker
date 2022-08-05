package com.example.demo.rest;

import com.example.demo.dao.UserInfoDao;
import com.example.demo.entities.UserInfo;
import com.example.demo.model.LoginResponse;
import com.example.demo.model.UserModel;
import com.example.demo.utils.Utils;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserResource {

    Logger log = LoggerFactory.getLogger(this.getClass().getName());

    @Autowired
    UserInfoDao userInfoDao;

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        List<UserModel> users = new ArrayList<>();
        userInfoDao.findAll().forEach(user -> users.add(user.getUserWithoutTasks()));
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable("id") int id) {
        Optional<UserInfo> user = userInfoDao.findById(id);
        if (!user.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user.get().getUserWithTasks(), HttpStatus.OK);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> createUser(@RequestBody UserModel userModel) {
        try {
            if (userModel == null) {
                return Utils.getBasicResponseEntity(400, "UserModel cannot be null.");
            }
            log.info(userModel.toString());
            String message = userModel.validate();
            if (message != null) {
                return Utils.getBasicResponseEntity(400, message);
            }
            UserInfo user = userInfoDao.findByEmailId(userModel.getEmailId());
            if (user != null) {
                return Utils.getBasicResponseEntity(409, "User already exist.");
            }
            int salt = new Random().nextInt(900000) + 100000;
            userModel.setPassword(Utils.hashStringWithSalt(userModel.getPassword(), salt));
            UserInfo userInfo = new UserInfo(userModel);
            userInfo.setSalt(salt);
            userInfoDao.saveAndFlush(userInfo);
            return new ResponseEntity<>(userInfo.getUserWithoutTasks(), HttpStatus.CREATED);
        } catch (Exception e) {
             log.info("Exception : ", e);
            return Utils.getBasicResponseEntity(500, "Server Error!");
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody UserModel userModel) {
        try {
            if (userModel == null || userModel.getEmailId() == null || userModel.getPassword() == null) {
                return Utils.getBasicResponseEntity(400, "Please provide emailId and password.");
            }
            UserInfo user = userInfoDao.findByEmailId(userModel.getEmailId().trim());
            if (user == null) {
                return Utils.getBasicResponseEntity(401, "Invalid credentials provided.");
            }
            if (user.getPassword().equals(Utils.hashStringWithSalt(userModel.getPassword(), user.getSalt()))) {
                int salt = new Random().nextInt(900000) + 100000;
                String token = Utils.hashStringWithSalt(UUID.randomUUID().toString(), salt);
                user.setToken(token);
                Long tokenExpiryTime = (System.currentTimeMillis() / 1000) + (60 * 60 * 16); // 16 hours
                user.setTokenExpiryTime(tokenExpiryTime);
                userInfoDao.saveAndFlush(user);
                LoginResponse loginResponse = new LoginResponse();
                loginResponse.setUser(user.getUserWithoutTasks());
                loginResponse.setToken(token);
                loginResponse.setTokenExpiryTime(tokenExpiryTime);
                return new ResponseEntity<>(loginResponse, HttpStatus.OK);
            } else {
                return Utils.getBasicResponseEntity(401, "Invalid credentials provided.");
            }
        } catch (Exception e) {
            log.info("Exception : ", e);
            return Utils.getBasicResponseEntity(500, "Server Error!");
        }
    }


}

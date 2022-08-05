package com.example.demo.entities;

import com.example.demo.model.UserModel;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "userinfo")
@Table(name = "userinfo")
@Getter
@Setter
public class UserInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(name = "fname")
    String fname;

    @Column(name = "lname")
    String lname;

    @Column(name = "emailid")
    String emailId;

    @Column(name = "manager_emailid")
    String managerEmailId;

    @Column(name = "password")
    String password;

    @Column(name = "is_manager")
    String isManager;

    @Column(name = "is_active")
    String isActive;

    @Column(name = "created_time")
    Long createdTime;

    @Column(name = "token")
    String token;

    @Column(name = "token_expiry_time")
    Long tokenExpiryTime;

    @Column(name = "salt")
    Integer salt;

    @OneToMany(targetEntity = Task.class, mappedBy = "userInfoId", fetch = FetchType.LAZY)
    List<Task> tasks;

    public UserInfo() {}
    public UserInfo(UserModel userModel) {
        this.fname = userModel.getFname();
        this.lname = userModel.getLname();
        this.emailId = userModel.getEmailId();
        this.managerEmailId = userModel.getManagerEmailId();
        this.isActive = userModel.getIsActive();
        this.isManager = userModel.getIsManager();
        this.password = userModel.getPassword();
        this.createdTime = userModel.getCreatedTime();
    }

    public UserModel getUserWithoutTasks() {
        return UserModel.builder()
                .id(this.getId())
                .fname(this.getFname())
                .lname(this.getLname())
                .emailId(this.getEmailId())
                .managerEmailId(this.getManagerEmailId())
                .isManager(this.getIsManager())
                .isActive(this.getIsActive())
                .createdTime(this.getCreatedTime()).build();
    }

    public UserModel getUserWithTasks() {
        UserModel userModel =  getUserWithoutTasks();
        userModel.setTasks(this.getTasks());
        return userModel;
    }

}

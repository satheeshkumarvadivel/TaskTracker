package com.example.demo.model;

import com.example.demo.entities.Task;
import com.example.demo.entities.TaskGroup;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.util.StringUtils;

@Getter
@Setter
@ToString
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserModel {
    int id;
    String fname;
    String lname;
    String emailId;
    String managerEmailId;
    String password;

    @Builder.Default
    String isActive = "Y";

    @Builder.Default
    String isManager = "N";

    Long createdTime;
    List<Task> tasks;
    List<TaskGroup> taskGroups;

    public String validate() {
        // fname validation
        if (!StringUtils.hasLength(this.fname)) {
            return "Please provide firstname.";
        }
        this.fname = StringUtils.capitalize(this.fname).trim();
        if (this.fname.length() > 50) {
            return "Firstname cannot be longer than 50 characters.";
        }
//        if (!this.fname.matches("[^A-Za-z]")) {
//            return "Firstname cannot contain special characters.";
//        }
        // lname validation
        if (!StringUtils.hasLength(this.lname)) {
            return "Please provide lastname.";
        }
        this.lname = StringUtils.capitalize(this.lname).trim();
        if (this.lname.length() > 50) {
            return "Lastname cannot be longer than 50 characters.";
        }
//        if (!this.lname.matches("[^A-Za-z]")) {
//            return "Lastname cannot contain special characters.";
//        }
        // emailId validation
        if (!StringUtils.hasLength(this.emailId)) {
            return "Please provide Email Id.";
        }
        this.emailId = this.emailId.trim();
        if (this.emailId.length() > 100) {
            return "Email Id cannot be longer than 100 characters.";
        }
//        if (!this.emailId.matches("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$")) {
//            return this.emailId + " is not a valid email id.";
//        }
        // managerEmailId validation
        if (!StringUtils.hasLength(this.managerEmailId)) {
            return "Please provide Email Id.";
        }
        this.managerEmailId = this.managerEmailId.trim();
        if (this.managerEmailId.length() > 100) {
            return "Manager Email Id cannot be longer than 100 characters.";
        }
//        if (!this.managerEmailId.matches("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$")) {
//            return this.managerEmailId + " is not a valid email id.";
//        }
        // password validation
        if (!StringUtils.hasLength(this.password)) {
            return "Please provide password.";
        }
        if (this.password.length() < 6) {
            return "Password should at least be 6 characters.";
        }
        if (this.password.length() > 50) {
            return "Password should not be longer than 50 characters.";
        }
        this.isActive = this.isActive == null ? "Y" : this.isActive.trim();
        this.isManager = this.isManager == null ? "N" : this.isManager.trim();
        this.createdTime = this.createdTime == null ? System.currentTimeMillis() / 1000 : this.createdTime;

        return null;
    }

}

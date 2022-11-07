package com.example.demo.model;

import java.util.List;

public class UserModelDTO {
    int id;
    String fname;
    String lname;
    String emailId;
    String managerEmailId;
    List<TaskModel> tasks;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getManagerEmailId() {
        return managerEmailId;
    }

    public void setManagerEmailId(String managerEmailId) {
        this.managerEmailId = managerEmailId;
    }

    public List<TaskModel> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskModel> tasks) {
        this.tasks = tasks;
    }
}

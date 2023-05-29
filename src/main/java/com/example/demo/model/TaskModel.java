package com.example.demo.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TaskModel {
    int id;
    int taskGroupId;
    String taskGroup;
    String taskDetail;
    TaskStatus taskStatus;
    String createdDate;
    long createdTime;

    public TaskModel() {
    }
}

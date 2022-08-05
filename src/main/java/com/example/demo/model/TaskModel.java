package com.example.demo.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class TaskModel {
    int id;
    int taskGroupId;
    String taskDetail;
    TaskStatus taskStatus;
    String createdDate;
    long createdTime;
}

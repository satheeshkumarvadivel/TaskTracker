package com.example.demo.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class TaskGroupModel {
    int id;
    int taskGroupOwnerId;
    String taskGroupName;

    @Builder.Default
    String isActive = "Y";
}

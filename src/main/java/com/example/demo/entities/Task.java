package com.example.demo.entities;

import java.sql.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "task")
@Table(name = "task")
@Getter
@Setter
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "task_detail")
    String taskDetail;

    @Column(name = "created_date")
    Date createdDate;

    @Column(name = "created_time")
    long createdTime;

    @Column(name = "userinfo_id")
    int userInfoId;

    @Column(name = "taskgroup_id")
    int taskGroupId;

    @Column(name = "last_updated_time")
    Long lastUpdatedTime;

}

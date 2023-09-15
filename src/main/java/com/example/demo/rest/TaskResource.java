package com.example.demo.rest;

import com.example.demo.dao.TaskDao;
import com.example.demo.dao.UserInfoDao;
import com.example.demo.entities.Task;
import com.example.demo.entities.UserInfo;
import com.example.demo.model.TaskModel;
import java.sql.Date;
import java.time.LocalDate;
import java.util.*;

import com.example.demo.model.TaskStatus;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users/{userId}/tasks")
public class TaskResource {

    @Autowired
    TaskDao taskDao;

    @Autowired
    UserInfoDao userInfoDao;

    @GetMapping
    public ResponseEntity<?> getUserTasks(@PathVariable("userId") int userId, @RequestParam("groupId") Integer groupId,
                                          @RequestParam("toDate") @DateTimeFormat(pattern = "yyyy-MM-dd") java.util.Date toDate,
                                          @RequestParam("fromDate")@DateTimeFormat(pattern = "yyyy-MM-dd") java.util.Date fromDate) {
        Optional<UserInfo> user = userInfoDao.findById(userId);
        List<Task> tasks;
        if (!user.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (groupId == null) {
            tasks = taskDao.findAllByUserInfoIdAndCreatedDateBetween(userId, fromDate, toDate);
        } else {
              tasks = taskDao.findAllByUserInfoIdAndTaskGroupIdAndCreatedDateBetween(userId, groupId, fromDate, toDate);
        }
        user.get().setTasks(tasks);
        return new ResponseEntity<>(user.get().getUserWithTasks(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> createTask(@PathVariable("userId") int userId, @RequestBody TaskModel taskPost) {
        Optional<UserInfo> user = userInfoDao.findById(userId);
        if (!user.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Task task = new Task();
        task.setTaskDetail(taskPost.getTaskDetail());
        if(taskPost.getTaskStatus() == null){
            task.setTaskStatus(TaskStatus.COMPLETED.toString());
        }
        else{
            task.setTaskStatus(taskPost.getTaskStatus().toString());
        }

        if (taskPost.getCreatedDate() != null) {
            task.setCreatedDate(Date.valueOf(taskPost.getCreatedDate()));
        } else {
            task.setCreatedDate(Date.valueOf(LocalDate.now()));
        }
        task.setCreatedTime(System.currentTimeMillis()/1000);
        task.setUserInfoId(userId);
        task.setTaskGroupId(taskPost.getTaskGroupId());
        taskDao.save(task);
        return new ResponseEntity<>(task, HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<?> updateTask(@PathVariable("userId") int userId, @RequestBody TaskModel taskPut) {
        Optional<UserInfo> user = userInfoDao.findById(userId);
        if (!user.isPresent()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        boolean isUpdated = false;
        Optional<Task> task = taskDao.findById(taskPut.getId());
        if (!task.isPresent()) {
            return new ResponseEntity<>("Task not found", HttpStatus.NOT_FOUND);
        }
        if(task.get().getUserInfoId() != userId){
            return  new ResponseEntity<>("User not authorized to update", HttpStatus.UNAUTHORIZED);
        }
        if (taskPut.getTaskDetail() != null) {
            task.get().setTaskDetail(taskPut.getTaskDetail());
            isUpdated = true;
        }
        if (taskPut.getTaskStatus() != null) {
            task.get().setTaskStatus(taskPut.getTaskStatus().toString());
            isUpdated = true;
        }
        if (taskPut.getTaskGroupId() > 0) {
            task.get().setTaskGroupId(taskPut.getTaskGroupId());
            isUpdated = true;
        }
        if(isUpdated){
            task.get().setLastUpdatedTime(System.currentTimeMillis() / 1000);
        }
        taskDao.saveAndFlush(task.get());
        return new ResponseEntity<>(task.get(), HttpStatus.OK);
    }
}

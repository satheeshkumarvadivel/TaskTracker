package com.example.demo.rest;

import com.example.demo.dao.TaskDao;
import com.example.demo.dao.UserInfoDao;
import com.example.demo.entities.Task;
import com.example.demo.entities.UserInfo;
import com.example.demo.model.TaskModel;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;

import com.example.demo.model.TaskStatus;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Auditable;
import org.springframework.data.jpa.domain.Specification;
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

import javax.validation.constraints.Null;

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
    @GetMapping("/managerId")
    public ResponseEntity<?> getTasksWithManagerId(@PathVariable("userId") int userId,
                                                   @RequestParam("toDate") @DateTimeFormat(pattern = "yyyy-MM-dd") java.util.Date tDate,
                                                   @RequestParam("fromDate")@DateTimeFormat(pattern = "yyyy-MM-dd") java.util.Date fDate) {
        Optional<UserInfo> user = userInfoDao.findById(userId);
        if (!user.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Date fromDate = new Date(fDate.getTime());
        Date toDate = new Date(tDate.getTime());
        String managerEmailId = user.get().getManagerEmailId();
        List<Map<String, Object>> usersDataWithManagerId = userInfoDao.getUserInfoByManagerEmailId(managerEmailId, fromDate, toDate);
        JSONObject userData = new JSONObject();

        for(Map<String, Object> userWithManagerId:usersDataWithManagerId){

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MMM-dd");
            Date createdDate = (Date) userWithManagerId.get("created_date");

            JSONObject task = new JSONObject();

            task.put("task_detail",userWithManagerId.get("task_detail").toString());
            task.put("created_date",sdf.format(createdDate));
            task.put("task_status",userWithManagerId.get("task_status").toString());
            JSONObject userJson = new JSONObject();
            JSONArray taskArray = new JSONArray();
            if(userData.has(userWithManagerId.get("fname").toString()))
            {
                userJson = (JSONObject) userData.get(userWithManagerId.get("fname").toString());
                if(userJson.has(sdf.format(createdDate))){
                    taskArray = (JSONArray) userJson.get(sdf.format(createdDate));
                    taskArray.put(task);
                    userJson.put(sdf.format(createdDate),taskArray);
                    userData.put(userWithManagerId.get("fname").toString(),userJson);

                }
                else
                {
                    taskArray.put(task);
                    userJson.put(sdf.format(createdDate), taskArray);
                    userData.put(userWithManagerId.get("fname").toString(),userJson);
                }
            }
            else
            {
                userJson.put("fname", userWithManagerId.get("fname").toString());
                userJson.put("lname", userWithManagerId.get("lname").toString());
                userJson.put("uid", userWithManagerId.get("uid").toString());
                userJson.put("is_manager", userWithManagerId.get("is_manager").toString());
                userJson.put("emailid", userWithManagerId.get("emailid").toString());
                userJson.put("manager_emailid", userWithManagerId.get("manager_emailid").toString());
                taskArray.put(task);
                userJson.put(sdf.format(createdDate),taskArray);
                userData.put(userWithManagerId.get("fname").toString(),userJson);
            }
        }

        return new ResponseEntity<>(userData.toString(), HttpStatus.OK);
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

        if (taskPost.getCreatedDate() != null && taskPost.getCreatedDate().trim().length() > 0) {
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

package com.example.demo.rest;

import com.example.demo.dao.TaskDao;
import com.example.demo.dao.TaskGroupDao;
import com.example.demo.dao.UserInfoDao;
import com.example.demo.entities.Task;
import com.example.demo.entities.TaskGroup;
import com.example.demo.entities.UserInfo;
import com.example.demo.model.TaskGroupModel;
import com.example.demo.model.UserModel;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/{userId}/taskgroups")
public class TaskGroupResource {

    @Autowired
    UserInfoDao userInfoDao;

    @Autowired
    TaskGroupDao taskGroupDao;

    @Autowired
    TaskDao taskDao;

    @PostMapping
    public ResponseEntity<?> createTaskGroup(@PathVariable("userId") int userId, @RequestBody TaskGroupModel taskGroupPost) {
        Optional<UserInfo> user = userInfoDao.findById(userId);
        if (!user.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        TaskGroup taskGroup = new TaskGroup();
        taskGroup.setGroupName(taskGroupPost.getTaskGroupName());
        taskGroup.setGroupOwnerId(userId);
        taskGroupDao.save(taskGroup);
        return new ResponseEntity<>(taskGroup, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<?> getTaskGroups(@PathVariable("userId") int userId, @RequestParam(value = "isOwner", required = false) Boolean isOwner) {
        Optional<UserInfo> user = userInfoDao.findById(userId);
        if (!user.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (isOwner != null && isOwner.booleanValue()) {
            return new ResponseEntity<>(taskGroupDao.findAllByGroupOwnerId(userId), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(taskGroupDao.findAll(), HttpStatus.OK);
        }
    }

    @GetMapping("/{taskGroupId}")
    public ResponseEntity<?> getTaskGroupById(@PathVariable("userId") int userId, @PathVariable("taskGroupId") int taskGroupId) {
        Optional<UserInfo> user = userInfoDao.findById(userId);
        if (!user.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(taskGroupDao.findAllByIdAndGroupOwnerId(taskGroupId, userId), HttpStatus.OK);
    }

    @GetMapping("/{taskGroupId}/users")
    public ResponseEntity<?> getTaskGroupByIdWithUsers(@PathVariable("userId") int userId, @PathVariable("taskGroupId") int taskGroupId,
                                                       @RequestParam("toDate") @DateTimeFormat(pattern = "yyyy-MM-dd") java.util.Date toDate,
                                                       @RequestParam("fromDate")@DateTimeFormat(pattern = "yyyy-MM-dd") java.util.Date fromDate) {
        Optional<UserInfo> user = userInfoDao.findById(userId);
        if (!user.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<Task> tasks = taskDao.findAllByTaskGroupIdAndCreatedDateBetween(taskGroupId, fromDate, toDate);
        Map<Integer, UserModel> users = new HashMap<>();
        tasks.forEach( task -> {
            if (!users.containsKey(task.getUserInfoId())) {
                Optional<UserInfo> userInfo = userInfoDao.findById(task.getUserInfoId());
                UserModel userModel = userInfo.get().getUserWithoutTasks();
                List<Task> userTasks = new ArrayList<>();
                userTasks.add(task);
                userModel.setTasks(userTasks);
                users.put(task.getUserInfoId(), userModel);
            } else {
                users.get(task.getUserInfoId()).getTasks().add(task);
            }
        });
        return new ResponseEntity<>(users.values(), HttpStatus.OK);
    }
}

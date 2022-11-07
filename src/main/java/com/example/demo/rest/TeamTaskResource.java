package com.example.demo.rest;

import com.example.demo.entities.UserInfo;
import com.example.demo.model.TaskModel;
import com.example.demo.model.TaskStatus;
import com.example.demo.model.UserModelDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dao.UserInfoDao;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/v1/users/{userId}/teamtasks")
public class TeamTaskResource {

    @Autowired
    UserInfoDao userInfoDao;

    @GetMapping
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

        Map<String, UserModelDTO> users=new HashMap<>();
        for (Map<String, Object> userWithManagerId : usersDataWithManagerId) {

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MMM-dd");
            TaskModel task = new TaskModel();
            task.setTaskDetail(userWithManagerId.get("task_detail").toString());
            task.setCreatedDate(sdf.format(userWithManagerId.get("created_date")));
            task.setTaskStatus(TaskStatus.valueOf((String) userWithManagerId.get("task_status")));
            task.setId((Integer) userWithManagerId.get("tid"));
            task.setTaskGroupId((Integer) userWithManagerId.get("taskgroup_id"));
            task.setCreatedTime(Long.parseLong((String) userWithManagerId.get("created_time")));

            if (!users.containsKey(userWithManagerId.get("uid").toString())) {
                List<TaskModel> userTask = new ArrayList<>();
                UserModelDTO userData = new UserModelDTO();
                userData.setEmailId(userWithManagerId.get("emailid").toString());
                userData.setFname(userWithManagerId.get("fname").toString());
                userData.setLname(userWithManagerId.get("lname").toString());
                userData.setId((Integer) userWithManagerId.get("uid"));
                userData.setManagerEmailId(userWithManagerId.get("manager_emailid").toString());
                userTask.add(task);
                userData.setTasks(userTask);
                users.put(userWithManagerId.get("uid").toString(), userData);

            } else {
                users.get(userWithManagerId.get("uid").toString()).getTasks().add(task);

            }
        }
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
}

package com.example.demo.dao;

import com.example.demo.entities.UserInfo;
import java.sql.Date;
import java.util.List;
import java.util.Map;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserInfoDao extends JpaRepository<UserInfo, Integer> {

    public List<UserInfo> getUserInfoByManagerEmailId(String managerEmailId);

    public UserInfo findByEmailId(String emailId);

    public UserInfo findByToken(String token);

    @Query(value = "select fname, lname, manager_emailid, emailid, is_Active, is_manager, userinfo.id AS uid, task_detail, tid, created_date, task_status, tasktable.created_time, taskgroup_id, group_name from userinfo JOIN (SELECT task.id AS tid, task_detail, created_time, userinfo_id, task_status, created_date, taskgroup_id, group_name FROM task JOIN taskgroup on taskgroup.id = task.taskgroup_id) AS tasktable on userinfo.id = tasktable.userinfo_id where manager_emailid = :managerid and tasktable.created_date BETWEEN :fromDate AND :toDate or created_date=NULL", nativeQuery = true)
    public List<Map<String, Object>> getUserInfoByManagerEmailId(String managerid, Date fromDate, Date toDate);
}

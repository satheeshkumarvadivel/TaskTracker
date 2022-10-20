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

    @Query(value = "select fname, lname, manager_emailid,emailid, is_Active, is_manager, userinfo.id AS uid, task_detail, task.id AS tid, created_date, task_status from userinfo JOIN task on userinfo.id = task.userinfo_id where manager_emailid =:managerid and task.created_date BETWEEN :fromDate AND :toDate or created_date=NULL", nativeQuery = true)
    public List<Map<String, Object>> getUserInfoByManagerEmailId(String managerid, Date fromDate, Date toDate);
}

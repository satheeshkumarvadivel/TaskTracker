package com.example.demo.dao;

import com.example.demo.entities.UserInfo;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserInfoDao extends JpaRepository<UserInfo, Integer> {

    public List<UserInfo> getUserInfoByManagerEmailId(String managerEmailId);

    public UserInfo findByEmailId(String emailId);

    public UserInfo findByToken(String token);

}

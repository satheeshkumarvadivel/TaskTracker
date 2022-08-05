package com.example.demo.dao;

import com.example.demo.entities.Task;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskDao extends JpaRepository<Task, Integer> {

    List<Task> findAllByTaskGroupId(int taskGroupId);

    List<Task> findAllByTaskGroupIdAndCreatedDateBetween(int taskGroupId, String from, String to);

}

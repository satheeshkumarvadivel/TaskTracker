package com.example.demo.dao;

import com.example.demo.entities.Task;
import com.example.demo.entities.TaskGroup;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskGroupDao extends JpaRepository<TaskGroup, Integer> {

    List<TaskGroup> findAll();

    List<TaskGroup> findAllByGroupOwnerId(int groupOwnerId);

    List<TaskGroup> findAllByIdAndGroupOwnerId(int id, int groupOwnerId);

}

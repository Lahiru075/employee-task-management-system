package com.example.taskmanagementbackend.service;

import com.example.taskmanagementbackend.dto.request.TaskRequest;
import com.example.taskmanagementbackend.dto.response.TaskResponse;
import com.example.taskmanagementbackend.enums.TaskStatus;
import jakarta.validation.Valid;

import java.util.List;

public interface TaskService {
    TaskResponse createTask(TaskRequest request);

    TaskResponse updateTask(Long id, @Valid TaskRequest request);

    List<TaskResponse> getAllTasks();

    void deleteTask(Long id);

    TaskResponse getTaskById(Long id);

    List<TaskResponse> getTasksByAssignedUser(String email);

    TaskResponse updateTaskStatus(Long id, TaskStatus status);
}

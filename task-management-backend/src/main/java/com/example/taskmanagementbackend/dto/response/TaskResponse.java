package com.example.taskmanagementbackend.dto.response;

import com.example.taskmanagementbackend.enums.TaskPriority;
import com.example.taskmanagementbackend.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate dueDate;
    private String assignedUserName;
    private String assignedUserEmail;
    private LocalDateTime createdAt;
}
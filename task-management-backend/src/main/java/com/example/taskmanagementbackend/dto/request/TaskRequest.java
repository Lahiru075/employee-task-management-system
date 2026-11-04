package com.example.taskmanagementbackend.dto.request;

import com.example.taskmanagementbackend.enums.TaskPriority;
import com.example.taskmanagementbackend.enums.TaskStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    private TaskStatus status; // TO_DO, IN_PROGRESS, COMPLETED

    private TaskPriority priority; // LOW, MEDIUM, HIGH

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    @NotBlank(message = "Assigned user email is required")
    @Email(message = "Invalid assigned user email format")
    private String assignedUserEmail;
}
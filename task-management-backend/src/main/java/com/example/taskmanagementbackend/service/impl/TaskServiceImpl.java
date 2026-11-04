package com.example.taskmanagementbackend.service.impl;

import com.example.taskmanagementbackend.dto.request.TaskRequest;
import com.example.taskmanagementbackend.dto.response.TaskResponse;
import com.example.taskmanagementbackend.entity.Task;
import com.example.taskmanagementbackend.entity.User;
import com.example.taskmanagementbackend.enums.TaskPriority;
import com.example.taskmanagementbackend.enums.TaskStatus;
import com.example.taskmanagementbackend.exception.ResourceNotFoundException;
import com.example.taskmanagementbackend.repository.TaskRepository;
import com.example.taskmanagementbackend.repository.UserRepository;
import com.example.taskmanagementbackend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Override
    public TaskResponse createTask(TaskRequest request) {
        User assignedUser = userRepository.findByEmail(request.getAssignedUserEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getAssignedUserEmail()));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TO_DO)
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .dueDate(request.getDueDate())
                .assignedUser(assignedUser)
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }

    @Override
    public TaskResponse updateTask(Long id, TaskRequest request) {

        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + id));

        User assignedUser = userRepository.findByEmail(request.getAssignedUserEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found with email: " + request.getAssignedUserEmail()));

        existingTask.setTitle(request.getTitle());
        existingTask.setDescription(request.getDescription());

        if (request.getStatus() != null) {
            existingTask.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            existingTask.setPriority(request.getPriority());
        }

        existingTask.setDueDate(request.getDueDate());
        existingTask.setAssignedUser(assignedUser);

        Task updatedTask = taskRepository.save(existingTask);
        return mapToResponse(updatedTask);

    }

    @Override
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        taskRepository.delete(task);
    }

    @Override
    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        return mapToResponse(task);
    }

    @Override
    public List<TaskResponse> getTasksByAssignedUser(String email) {
        return taskRepository.findByAssignedUserEmail(email)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .assignedUserName(task.getAssignedUser() != null ? task.getAssignedUser().getName() : "Unassigned")
                .assignedUserEmail(task.getAssignedUser() != null ? task.getAssignedUser().getEmail() : null)
                .createdAt(task.getCreatedAt())
                .build();
    }
}

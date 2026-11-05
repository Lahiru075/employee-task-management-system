package com.example.taskmanagementbackend.service;

import com.example.taskmanagementbackend.dto.request.TaskRequest;
import com.example.taskmanagementbackend.dto.response.TaskResponse;
import com.example.taskmanagementbackend.entity.Task;
import com.example.taskmanagementbackend.entity.User;
import com.example.taskmanagementbackend.enums.TaskPriority;
import com.example.taskmanagementbackend.enums.TaskStatus;
import com.example.taskmanagementbackend.repository.TaskRepository;
import com.example.taskmanagementbackend.repository.UserRepository;
import com.example.taskmanagementbackend.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    @Test
    void shouldCreateTaskSuccessfully() {

        // Prepare request data
        TaskRequest request = new TaskRequest();
        request.setTitle("Build Task Management System");
        request.setDescription("Complete backend and frontend implementation");
        request.setStatus(TaskStatus.TO_DO);
        request.setPriority(TaskPriority.HIGH);
        request.setDueDate(LocalDate.now().plusDays(2));
        request.setAssignedUserEmail("intern@example.com");

        // Prepare mock user
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("intern@example.com");

        // Prepare mock saved task
        Task savedTask = Task.builder()
                .id(1L)
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .assignedUser(mockUser)
                .build();

        // Mock database calls
        when(userRepository.findByEmail("intern@example.com")).thenReturn(Optional.of(mockUser));
        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        // Execute service method
        TaskResponse response = taskService.createTask(request);

        // Verify result
        assertNotNull(response);
        assertEquals("Build Task Management System", response.getTitle());
        verify(taskRepository, times(1)).save(any(Task.class));

    }
}

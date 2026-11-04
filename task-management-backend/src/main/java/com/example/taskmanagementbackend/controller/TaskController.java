package com.example.taskmanagementbackend.controller;

import com.example.taskmanagementbackend.dto.request.TaskRequest;
import com.example.taskmanagementbackend.dto.response.ApiResponse;
import com.example.taskmanagementbackend.dto.response.TaskResponse;
import com.example.taskmanagementbackend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(@Valid @RequestBody TaskRequest request) {
        TaskResponse response = taskService.createTask(request);

        ApiResponse<TaskResponse> apiResponse = ApiResponse.<TaskResponse>builder()
                .success(true)
                .status(HttpStatus.CREATED.value())
                .message("Task created successfully")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request) {

        TaskResponse response = taskService.updateTask(id, request);

        ApiResponse<TaskResponse> apiResponse = ApiResponse.<TaskResponse>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Task updated successfully")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks() {
        List<TaskResponse> tasks = taskService.getAllTasks();

        ApiResponse<List<TaskResponse>> apiResponse = ApiResponse.<List<TaskResponse>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Tasks fetched successfully")
                .data(tasks)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Task deleted successfully")
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable Long id) {
        TaskResponse response = taskService.getTaskById(id);

        ApiResponse<TaskResponse> apiResponse = ApiResponse.<TaskResponse>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Task fetched successfully")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @GetMapping("/my-tasks")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getMyTasks(@RequestParam String email) {
        List<TaskResponse> tasks = taskService.getTasksByAssignedUser(email);

        ApiResponse<List<TaskResponse>> apiResponse = ApiResponse.<List<TaskResponse>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("My tasks fetched successfully")
                .data(tasks)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }


}

package com.example.taskmanagementbackend.controller;

import com.example.taskmanagementbackend.dto.request.LoginRequest;
import com.example.taskmanagementbackend.dto.request.RegisterRequest;
import com.example.taskmanagementbackend.dto.response.ApiResponse;
import com.example.taskmanagementbackend.dto.response.UserResponse;
import com.example.taskmanagementbackend.repository.UserRepository;
import com.example.taskmanagementbackend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest registerRequest){
        UserResponse response = authService.register(registerRequest);

        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                .success(true)
                .status(HttpStatus.CREATED.value())
                .message("User registered successfully")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> login(@Valid @RequestBody LoginRequest loginRequest){
        UserResponse response = authService.login(loginRequest);

        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("User login successfully")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = authService.getAllUsers();

        ApiResponse<List<UserResponse>> apiResponse = ApiResponse.<List<UserResponse>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Users fetched successfully")
                .data(users)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @GetMapping("/employees/emails")
    public ResponseEntity<ApiResponse<List<String>>> getEmployeeEmails() {
        List<String> emails = authService.getEmployeeEmails();

        ApiResponse<List<String>> response = ApiResponse.<List<String>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Employee emails fetched successfully")
                .data(emails)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }
}

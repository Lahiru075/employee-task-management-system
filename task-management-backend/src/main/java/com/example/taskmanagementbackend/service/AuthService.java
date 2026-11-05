package com.example.taskmanagementbackend.service;

import com.example.taskmanagementbackend.dto.request.LoginRequest;
import com.example.taskmanagementbackend.dto.request.RegisterRequest;
import com.example.taskmanagementbackend.dto.response.UserResponse;
import jakarta.validation.Valid;

import java.util.List;

public interface AuthService {
    UserResponse register(@Valid RegisterRequest registerRequest);

    UserResponse login(@Valid LoginRequest loginRequest);

    List<UserResponse> getAllUsers();

    List<String> getEmployeeEmails();
}

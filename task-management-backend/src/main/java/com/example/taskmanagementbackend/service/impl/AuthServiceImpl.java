package com.example.taskmanagementbackend.service.impl;

import com.example.taskmanagementbackend.dto.request.LoginRequest;
import com.example.taskmanagementbackend.dto.request.RegisterRequest;
import com.example.taskmanagementbackend.dto.response.UserResponse;
import com.example.taskmanagementbackend.entity.User;
import com.example.taskmanagementbackend.enums.Role;
import com.example.taskmanagementbackend.exception.DuplicateResourceException;
import com.example.taskmanagementbackend.exception.InvalidCredentialsException;
import com.example.taskmanagementbackend.exception.ResourceNotFoundException;
import com.example.taskmanagementbackend.repository.UserRepository;
import com.example.taskmanagementbackend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())){
            throw new DuplicateResourceException("Email already exists: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.EMPLOYEE)
                .build();

        User savedUser = userRepository.save(user);

        return UserResponse.builder()
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }

    @Override
    public UserResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return UserResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findByRole(Role.EMPLOYEE)
                .stream()
                .map(user -> UserResponse.builder()
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build())
                .toList();
    }
}

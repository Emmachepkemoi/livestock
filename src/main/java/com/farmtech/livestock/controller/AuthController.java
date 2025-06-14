package com.farmtech.livestock.controller;

import com.farmtech.livestock.dto.LoginRequest;
import com.farmtech.livestock.dto.RegisterRequest;
import com.farmtech.livestock.dto.ApiResponse;
import com.farmtech.livestock.dto.AuthResponse;
import com.farmtech.livestock.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "https://localhost:5173"})
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest registerRequest) {
        try {
            System.out.println("Registration request received for: " + registerRequest.getUsername());

            AuthResponse authResponse = authService.register(registerRequest);

            System.out.println("Registration successful for: " + registerRequest.getUsername());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "User registered successfully", authResponse));
        } catch (Exception e) {
            System.err.println("Registration failed: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Login request received for: " + loginRequest.getEmail());

            AuthResponse authResponse = authService.login(loginRequest);

            System.out.println("Login successful for: " + loginRequest.getEmail());

            return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", authResponse));
        } catch (Exception e) {
            System.err.println("Login failed: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @RequestParam String refreshToken) {
        try {
            AuthResponse authResponse = authService.refreshToken(refreshToken);
            return ResponseEntity.ok(new ApiResponse<>(true, "Token refreshed successfully", authResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(
            @RequestParam String refreshToken) {
        try {
            authService.logout(refreshToken);
            return ResponseEntity.ok(new ApiResponse<>(true, "Logout successful", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // Test endpoint to verify backend is working
    @GetMapping("/test")
    public ResponseEntity<ApiResponse<String>> test() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Backend is working!", "Hello from FarmTech Livestock API"));
    }

    // Test endpoint to check database connection
    @GetMapping("/test-db")
    public ResponseEntity<ApiResponse<String>> testDatabase() {
        try {
            // This will trigger the UserRepository to connect to database
            long userCount = authService.getUserCount();
            return ResponseEntity.ok(new ApiResponse<>(true, "Database connection successful",
                    "Total users in database: " + userCount));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Database connection failed: " + e.getMessage(), null));
        }
    }
}
package com.farmtech.livestock.service;

import com.farmtech.livestock.dto.LoginRequest;
import com.farmtech.livestock.dto.RegisterRequest;
import com.farmtech.livestock.dto.AuthResponse;
import com.farmtech.livestock.model.User;
import com.farmtech.livestock.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest registerRequest) {
        // Enhanced validation
        if (registerRequest.getUsername() == null || registerRequest.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username is required");
        }
        if (registerRequest.getEmail() == null || registerRequest.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (registerRequest.getPassword() == null || registerRequest.getPassword().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        // Check if username already exists
        if (userRepository.existsByUsername(registerRequest.getUsername().trim())) {
            throw new RuntimeException("Username already exists");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail().trim().toLowerCase())) {
            throw new RuntimeException("Email already exists");
        }

        // Additional validation
        if (registerRequest.getUsername().length() < 3) {
            throw new RuntimeException("Username must be at least 3 characters long");
        }
        if (registerRequest.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters long");
        }

        try {
            // Create new user
            User user = new User();
            user.setUsername(registerRequest.getUsername().trim());
            user.setEmail(registerRequest.getEmail().trim().toLowerCase());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setFirstName(registerRequest.getFirstName() != null ? registerRequest.getFirstName().trim() : null);
            user.setLastName(registerRequest.getLastName() != null ? registerRequest.getLastName().trim() : null);
            user.setPhoneNumber(registerRequest.getPhoneNumber() != null ? registerRequest.getPhoneNumber().trim() : null);

            // Save user to database
            User savedUser = userRepository.save(user);

            // Log successful registration
            System.out.println("User registered successfully: " + savedUser.getUsername() + " with ID: " + savedUser.getId());

            // Create response with actual tokens (you can implement JWT later)
            AuthResponse response = new AuthResponse();
            response.setAccessToken("accessToken_" + savedUser.getId() + "_" + System.currentTimeMillis());
            response.setRefreshToken("refreshToken_" + savedUser.getId() + "_" + System.currentTimeMillis());
            response.setUserId(savedUser.getId());
            response.setUsername(savedUser.getUsername());
            response.setEmail(savedUser.getEmail());

            return response;

        } catch (Exception e) {
            System.err.println("Error during user registration: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    public AuthResponse login(LoginRequest loginRequest) {
        // Validate loginRequest fields
        if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        try {
            // Find user by email
            Optional<User> userOptional = userRepository.findByEmailAndActive(
                    loginRequest.getEmail().trim().toLowerCase(), true);

            if (userOptional.isEmpty()) {
                throw new RuntimeException("Invalid email or password");
            }

            User user = userOptional.get();

            // Verify password
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid email or password");
            }

            // Update last login date
            user.setLastLoginDate(new java.util.Date());
            userRepository.save(user);

            // Create response
            AuthResponse response = new AuthResponse();
            response.setAccessToken("accessToken_" + user.getId() + "_" + System.currentTimeMillis());
            response.setRefreshToken("refreshToken_" + user.getId() + "_" + System.currentTimeMillis());
            response.setUserId(user.getId());
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());

            return response;

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Error during login: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }

    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            throw new RuntimeException("Invalid refresh token");
        }

        // TODO: Implement refresh token invalidation logic here
        // For now, this is a stub (no real logout logic)
        System.out.println("Logout called for token: " + refreshToken);

        // In a real app, you might remove the refresh token from DB or cache
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            throw new RuntimeException("Invalid refresh token");
        }

        // TODO: Implement actual token refresh logic
        // For now, generate new dummy tokens
        AuthResponse response = new AuthResponse();
        response.setAccessToken("newAccessToken_" + System.currentTimeMillis());
        response.setRefreshToken("newRefreshToken_" + System.currentTimeMillis());

        return response;
    }

    public long getUserCount() {
        return 0;
    }
}
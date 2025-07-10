package com.farmtech.livestock.service;

import com.farmtech.livestock.dto.LoginRequest;
import com.farmtech.livestock.dto.RegisterRequest;
import com.farmtech.livestock.dto.AuthResponse;
import com.farmtech.livestock.model.User;
import com.farmtech.livestock.model.UserRole;
import com.farmtech.livestock.repository.UserRepository;
import com.farmtech.livestock.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest registerRequest) {
        validateRegisterRequest(registerRequest);

        if (userRepository.existsByUsername(registerRequest.getUsername().trim())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail().trim().toLowerCase())) {
            throw new RuntimeException("Email already exists");
        }

        try {
            UserRole.RoleName roleEnum;
            try {
                roleEnum = registerRequest.getRole();
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid role: " + registerRequest.getRole());
            }

            UserRole role = roleRepository.findByRoleName(roleEnum)
                    .orElseThrow(() -> new RuntimeException("Role not found in database: " + roleEnum));

            User user = new User();
            user.setUsername(registerRequest.getUsername().trim());
            user.setEmail(registerRequest.getEmail().trim().toLowerCase());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setFirstName(trimOrNull(registerRequest.getFirstName()));
            user.setLastName(trimOrNull(registerRequest.getLastName()));
            user.setPhoneNumber(trimOrNull(registerRequest.getPhoneNumber()));
            user.setRole(role);
            user.setActive(true);
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());

            User savedUser = userRepository.save(user);

            return createAuthResponse(savedUser);

        } catch (Exception e) {
            System.err.println("Error during registration: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    public AuthResponse login(LoginRequest loginRequest) {
        if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        if (loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        try {
            Optional<User> userOptional = userRepository.findByEmailAndActive(
                    loginRequest.getEmail().trim().toLowerCase(), true);

            if (userOptional.isEmpty()) {
                throw new RuntimeException("Invalid email or password");
            }

            User user = userOptional.get();

            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid email or password");
            }

            user.setLastLoginDate(new Date());
            userRepository.save(user);

            return createAuthResponse(user);

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }

    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            throw new RuntimeException("Invalid refresh token");
        }
        System.out.println("Logout called for token: " + refreshToken);
        // TODO: Implement token invalidation
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            throw new RuntimeException("Invalid refresh token");
        }

        AuthResponse response = new AuthResponse();
        response.setAccessToken("newAccessToken_" + System.currentTimeMillis());
        response.setRefreshToken("newRefreshToken_" + System.currentTimeMillis());
        return response;
    }

    public long getUserCount() {
        return userRepository.count();
    }

    // ===================== Helpers =====================

    private void validateRegisterRequest(RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username is required");
        }
        if (request.getUsername().length() < 3) {
            throw new RuntimeException("Username must be at least 3 characters long");
        }

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        if (request.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters long");
        }

        if (request.getRole() == null)  {
            throw new RuntimeException("Role is required");
        }
    }

    private AuthResponse createAuthResponse(User user) {
        AuthResponse response = new AuthResponse();
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().getRoleName().name());
        response.setAccessToken("accessToken_" + user.getId() + "_" + System.currentTimeMillis());
        response.setRefreshToken("refreshToken_" + user.getId() + "_" + System.currentTimeMillis());
        return response;
    }

    private String trimOrNull(String value) {
        return value != null ? value.trim() : null;
    }
}

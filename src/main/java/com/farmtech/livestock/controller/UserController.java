package com.farmtech.livestock.controller;

import com.farmtech.livestock.model.User;
import com.farmtech.livestock.service.UserService;
import com.farmtech.livestock.dto.UserDto;
import com.farmtech.livestock.dto.UpdateProfileRequest;
import com.farmtech.livestock.dto.ChangePasswordRequest;
import com.farmtech.livestock.dto.ApiResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> getUserProfile(Authentication authentication) {
        try {
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>(false, "Authentication required", null));
            }

            String username = authentication.getName();
            UserDto userProfile = userService.getUserProfile(username);
            return ResponseEntity.ok(new ApiResponse<>(true, "Profile retrieved successfully", userProfile));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "An error occurred while retrieving profile", null));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest updateRequest,
            Authentication authentication) {
        try {
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>(false, "Authentication required", null));
            }

            String username = authentication.getName();
            UserDto updatedProfile = userService.updateProfile(username, updateRequest);
            return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated successfully", updatedProfile));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "An error occurred while updating profile", null));
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest,
            Authentication authentication) {
        try {
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>(false, "Authentication required", null));
            }

            String username = authentication.getName();
            userService.changePassword(username, changePasswordRequest);
            return ResponseEntity.ok(new ApiResponse<>(true, "Password changed successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "An error occurred while changing password", null));
        }
    }

    @DeleteMapping("/profile")
    public ResponseEntity<ApiResponse<String>> deleteAccount(Authentication authentication) {
        try {
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>(false, "Authentication required", null));
            }

            String username = authentication.getName();
            userService.deleteAccount(username);
            return ResponseEntity.ok(new ApiResponse<>(true, "Account deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "An error occurred while deleting account", null));
        }
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<ApiResponse<Object>> getDashboardStats(Authentication authentication) {
        try {
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>(false, "Authentication required", null));
            }

            String username = authentication.getName();
            Object stats = userService.getDashboardStats(username);
            return ResponseEntity.ok(new ApiResponse<>(true, "Dashboard stats retrieved successfully", stats));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "An error occurred while retrieving dashboard stats", null));
        }
    }
}
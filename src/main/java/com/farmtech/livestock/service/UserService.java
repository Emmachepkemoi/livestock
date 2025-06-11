package com.farmtech.livestock.service;

import com.farmtech.livestock.model.User;
import com.farmtech.livestock.repository.UserRepository;
import com.farmtech.livestock.dto.UserDto;
import com.farmtech.livestock.dto.UpdateProfileRequest;
import com.farmtech.livestock.dto.ChangePasswordRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    /**
     * Get user profile by username
     */
    public UserDto getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        return convertToUserDto(user);
    }

    /**
     * Update user profile
     */
    public UserDto updateProfile(String username, UpdateProfileRequest updateRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        // Validate email uniqueness if email is being updated
        if (updateRequest.getEmail() != null && !updateRequest.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(updateRequest.getEmail())) {
                throw new RuntimeException("Email is already in use");
            }
            user.setEmail(updateRequest.getEmail());
        }

        // Update user fields
        if (updateRequest.getFirstName() != null && !updateRequest.getFirstName().trim().isEmpty()) {
            user.setFirstName(updateRequest.getFirstName().trim());
        }
        if (updateRequest.getLastName() != null && !updateRequest.getLastName().trim().isEmpty()) {
            user.setLastName(updateRequest.getLastName().trim());
        }
        if (updateRequest.getPhoneNumber() != null && !updateRequest.getPhoneNumber().trim().isEmpty()) {
            user.setPhoneNumber(updateRequest.getPhoneNumber().trim());
        }

        User updatedUser = userRepository.save(user);
        return convertToUserDto(updatedUser);
    }

    /**
     * Change user password
     */
    public void changePassword(String username, ChangePasswordRequest changePasswordRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        // Verify current password
        if (!passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Validate new password confirmation
        if (!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirmPassword())) {
            throw new RuntimeException("New password and confirmation do not match");
        }

        // Validate new password strength (basic validation)
        if (changePasswordRequest.getNewPassword().length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters long");
        }

        // Check if new password is different from current password
        if (passwordEncoder.matches(changePasswordRequest.getNewPassword(), user.getPassword())) {
            throw new RuntimeException("New password must be different from current password");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        userRepository.save(user);
    }

    /**
     * Delete user account (soft delete recommended)
     */
    public void deleteAccount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        // Option 1: Soft delete (recommended)
        user.setActive(false);
        user.setDeletedAt(new Date());
        userRepository.save(user);

        // Option 2: Hard delete (uncomment if needed)
        // userRepository.delete(user);
    }

    /**
     * Get dashboard statistics for user
     */
    public Map<String, Object> getDashboardStats(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        // Create dashboard stats object
        Map<String, Object> stats = new HashMap<>();

        try {
            // Basic user info
            stats.put("userId", user.getId());
            stats.put("username", user.getUsername());
            stats.put("memberSince", user.getCreatedAt());

            // Livestock statistics (implement based on your data model)
            stats.put("totalAnimals", getTotalAnimalsForUser(user.getId()));
            stats.put("totalFeedings", getTotalFeedingsForUser(user.getId()));
            stats.put("upcomingVaccinations", getUpcomingVaccinationsForUser(user.getId()));
            stats.put("healthAlerts", getHealthAlertsForUser(user.getId()));
            stats.put("recentActivities", getRecentActivitiesForUser(user.getId()));

            // Summary statistics
            stats.put("lastLoginDate", user.getLastLoginDate());
            stats.put("profileCompleteness", calculateProfileCompleteness(user));

        } catch (Exception e) {
            // Log the error and return basic stats
            stats.put("error", "Some statistics could not be loaded");
            stats.put("userId", user.getId());
            stats.put("username", user.getUsername());
        }

        return stats;
    }

    /**
     * Helper method to convert User entity to UserDto
     */
    private UserDto convertToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setCreatedAt(user.getCreatedAt());
        userDto.setLastLoginDate(user.getLastLoginDate());
        // Don't include password or other sensitive information
        return userDto;
    }

    /**
     * Calculate profile completeness percentage
     */
    private int calculateProfileCompleteness(User user) {
        int totalFields = 6; // username, email, firstName, lastName, phoneNumber, profilePicture
        int completedFields = 0;

        if (user.getUsername() != null && !user.getUsername().trim().isEmpty()) completedFields++;
        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) completedFields++;
        if (user.getFirstName() != null && !user.getFirstName().trim().isEmpty()) completedFields++;
        if (user.getLastName() != null && !user.getLastName().trim().isEmpty()) completedFields++;
        if (user.getPhoneNumber() != null && !user.getPhoneNumber().trim().isEmpty()) completedFields++;
        // Add more fields as needed

        return (int) ((completedFields * 100.0) / totalFields);
    }

    // Helper methods for dashboard stats - implement based on your data model
    private long getTotalAnimalsForUser(Long userId) {
        // TODO: Implement when you have Animal entity and repository
        // Example: return animalRepository.countByUserId(userId);
        return 0; // placeholder
    }

    private long getTotalFeedingsForUser(Long userId) {
        // TODO: Implement when you have Feeding entity and repository
        // Example: return feedingRepository.countByUserId(userId);
        return 0; // placeholder
    }

    private long getUpcomingVaccinationsForUser(Long userId) {
        // TODO: Implement when you have Vaccination entity and repository
        // Example: return vaccinationRepository.countUpcomingByUserId(userId);
        return 0; // placeholder
    }

    private long getHealthAlertsForUser(Long userId) {
        // TODO: Implement when you have HealthAlert entity and repository
        // Example: return healthAlertRepository.countActiveByUserId(userId);
        return 0; // placeholder
    }

    private List<Map<String, Object>> getRecentActivitiesForUser(Long userId) {
        // TODO: Implement when you have Activity entity and repository
        // Example: return activityRepository.findRecentByUserId(userId, PageRequest.of(0, 5));
        List<Map<String, Object>> activities = new ArrayList<>();
        Map<String, Object> sampleActivity = new HashMap<>();
        sampleActivity.put("type", "profile_update");
        sampleActivity.put("description", "Profile updated");
        sampleActivity.put("timestamp", new Date());
        activities.add(sampleActivity);
        return activities; // placeholder
    }

    /**
     * Additional utility methods you might need
     */

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    public void updateLastLoginDate(String username) {
        User user = findByUsername(username);
        user.setLastLoginDate(new Date());
        userRepository.save(user);
    }
}
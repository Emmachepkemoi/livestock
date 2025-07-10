package com.farmtech.livestock.service;

import com.farmtech.livestock.model.UserRole;
import com.farmtech.livestock.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RoleInitializationService implements CommandLineRunner {

    @Autowired
    private UserRoleRepository roleRepository;

    @Override
    public void run(String... args) {
        initializeRoles();
    }

    private void initializeRoles() {
        // Define the application-specific roles
        UserRole.RoleName[] requiredRoles = {
                UserRole.RoleName.FARMER,
                UserRole.RoleName.BUYER,
                UserRole.RoleName.VETERINARIAN
        };

        for (UserRole.RoleName roleName : requiredRoles) {
            // Check if the role already exists
            if (roleRepository.findByRoleName(roleName).isEmpty()) {
                UserRole role = new UserRole();
                role.setRoleName(roleName);
                role.setDescription(getDescriptionForRole(roleName));
                role.setCreatedAt(LocalDateTime.now());
                role.setUpdatedAt(LocalDateTime.now());

                roleRepository.save(role);
                System.out.println("✅ Created role: " + roleName);
            }
        }
    }

    private String getDescriptionForRole(UserRole.RoleName roleName) {
        switch (roleName) {
            case FARMER:
                return "Farmer role for livestock management";
            case BUYER:
                return "Buyer role for purchasing livestock and products";
            case VETERINARIAN:
                return "Veterinarian role for animal health and medical services";
            default:
                return "Undefined role";
        }
    }
}

package com.farmtech.livestock.util;

import com.farmtech.livestock.model.User;
import com.farmtech.livestock.model.UserRole;
import com.farmtech.livestock.repository.UserRepository;
import com.farmtech.livestock.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Scanner;

@Component
public class ManualAdminCreator implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (args.length > 0 && args[0].equals("create-admin")) {
            createAdminInteractively();
        }
    }

    private void createAdminInteractively() {
        Scanner scanner = new Scanner(System.in);
        System.out.println("🔧 Manual Admin User Creator");
        System.out.println("============================");

        try {
            while (true) {
                System.out.print("Enter username (or 'quit' to exit): ");
                String username = scanner.nextLine().trim();

                if ("quit".equalsIgnoreCase(username)) break;
                if (username.isEmpty()) {
                    System.out.println("❌ Username cannot be empty!");
                    continue;
                }

                if (userRepository.findByUsername(username).isPresent()) {
                    System.out.println("❌ Username already exists!");
                    continue;
                }

                System.out.print("Enter email: ");
                String email = scanner.nextLine().trim();
                if (email.isEmpty() || !email.contains("@")) {
                    System.out.println("❌ Invalid email format!");
                    continue;
                }

                if (userRepository.findByEmail(email).isPresent()) {
                    System.out.println("❌ Email already exists!");
                    continue;
                }

                System.out.print("Enter password: ");
                String password = scanner.nextLine().trim();
                if (password.length() < 6) {
                    System.out.println("❌ Password must be at least 6 characters!");
                    continue;
                }

                System.out.print("Enter first name: ");
                String firstName = scanner.nextLine().trim();

                System.out.print("Enter last name: ");
                String lastName = scanner.nextLine().trim();

                boolean success = createAdminUser(username, email, password, firstName, lastName);

                if (success) {
                    System.out.println("✅ Admin user created successfully!");
                    System.out.println("   Username: " + username);
                    System.out.println("   Email: " + email);
                    System.out.println("   Password: " + password);
                } else {
                    System.out.println("❌ Failed to create admin user!");
                }
            }

        } catch (Exception e) {
            System.err.println("❌ Error in interactive mode: " + e.getMessage());
        } finally {
            scanner.close();
        }

        System.out.println("👋 Goodbye!");
    }

    private boolean createAdminUser(String username, String email, String password, String firstName, String lastName) {
        try {
            UserRole adminRole = getOrCreateAdminRole();

            User adminUser = new User();
            adminUser.setUsername(username);
            adminUser.setEmail(email);
            adminUser.setPassword(passwordEncoder.encode(password));
            adminUser.setFirstName(firstName);
            adminUser.setLastName(lastName);
            adminUser.setRole(adminRole);
            adminUser.setActive(true);
            adminUser.setCreatedAt(LocalDateTime.now());
            adminUser.setUpdatedAt(LocalDateTime.now());

            userRepository.save(adminUser);
            return true;

        } catch (Exception e) {
            System.err.println("❌ Error creating admin user: " + e.getMessage());
            return false;
        }
    }

    private UserRole getOrCreateAdminRole() {
        Optional<UserRole> existingRole = roleRepository.findByRoleName(UserRole.RoleName.ADMIN);
        if (existingRole.isPresent()) {
            return existingRole.get();
        }

        UserRole adminRole = new UserRole();
        adminRole.setRoleName(UserRole.RoleName.ADMIN);
        adminRole.setDescription("Administrator role with full system access");
        adminRole.setCreatedAt(LocalDateTime.now());
        adminRole.setUpdatedAt(LocalDateTime.now());

        return roleRepository.save(adminRole);
    }
}

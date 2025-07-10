package com.farmtech.livestock.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "user_roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Integer roleId;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_name", nullable = false, unique = true)
    private RoleName roleName;

    @Column(name = "role_description", columnDefinition = "TEXT")
    private String roleDescription;

    @Column(name = "permissions", columnDefinition = "JSON")
    private String permissions;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // ✅ Optional: one role to many users
    @OneToMany(mappedBy = "role", fetch = FetchType.LAZY)
    private List<User> users;

    public void setDescription(String descriptionForRole) {
    }

    public void setUpdatedAt(LocalDateTime now) {

    }

    public enum RoleName {
        FARMER, BUYER, VETERINARIAN, ADMIN
    }
}

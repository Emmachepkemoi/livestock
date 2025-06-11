package com.farmtech.livestock.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "farmer_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FarmerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "farmer_id")
    private Integer farmerId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "farm_name", length = 100)
    private String farmName;

    @Column(name = "farm_size_acres", precision = 8, scale = 2)
    private BigDecimal farmSizeAcres;

    @Column(name = "farming_experience_years")
    private Integer farmingExperienceYears;

    @Column(name = "primary_livestock_type", length = 50)
    private String primaryLivestockType;

    @Column(name = "farming_license_number", length = 50)
    private String farmingLicenseNumber;

    @Column(name = "bank_account_number", length = 50)
    private String bankAccountNumber;

    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Column(name = "mpesa_number", length = 15)
    private String mpesaNumber;

    @Column(name = "emergency_contact_name", length = 100)
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 20)
    private String emergencyContactPhone;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "farmer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Livestock> livestock;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // 👇 Custom getter to allow repository to use `farmer.username`
    public String getUsername() {
        return user != null ? user.getUsername() : null;
    }
}

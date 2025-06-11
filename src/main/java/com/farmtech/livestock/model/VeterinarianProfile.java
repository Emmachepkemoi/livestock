package com.farmtech.livestock.model;

// src/main/java/com/livestock/model/VeterinarianProfile.java


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "veterinarian_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VeterinarianProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vet_id")
    private Integer vetId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "license_number", nullable = false, unique = true, length = 50)
    private String licenseNumber;

    @Column(name = "specialization", length = 100)
    private String specialization;

    @Column(name = "clinic_name", length = 100)
    private String clinicName;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Column(name = "consultation_fee", precision = 10, scale = 2)
    private BigDecimal consultationFee;

    @Column(name = "service_areas", columnDefinition = "JSON")
    private String serviceAreas;

    @Column(name = "available_services", columnDefinition = "JSON")
    private String availableServices;

    @Column(name = "working_hours", columnDefinition = "JSON")
    private String workingHours;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    @Column(name = "rating")
    private Double rating = 0.00;

    @Column(name = "total_reviews")
    private Integer totalReviews = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
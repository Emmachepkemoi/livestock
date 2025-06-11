package com.farmtech.livestock.model;

// src/main/java/com/livestock/model/BuyerProfile.java


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "buyer_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuyerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "buyer_id")
    private Integer buyerId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "business_name", length = 100)
    private String businessName;

    @Enumerated(EnumType.STRING)
    @Column(name = "business_type", nullable = false)
    private BusinessType businessType;

    @Column(name = "business_license_number", length = 50)
    private String businessLicenseNumber;

    @Column(name = "preferred_livestock_types", columnDefinition = "JSON")
    private String preferredLivestockTypes;

    @Column(name = "buying_capacity_monthly")
    private Integer buyingCapacityMonthly;

    @Column(name = "payment_methods", columnDefinition = "JSON")
    private String paymentMethods;

    @Column(name = "delivery_range_km")
    private Integer deliveryRangeKm;

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

    public enum BusinessType {
        INDIVIDUAL, BUTCHERY, RESTAURANT, EXPORT, TRADER, PROCESSOR
    }
}
package com.farmtech.livestock.model;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "health_record_id")
    private Integer healthRecordId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "livestock_id", nullable = false)
    private Livestock livestock;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vet_id")
    private VeterinarianProfile vet;

    @Column(name = "examination_date", nullable = false)
    private LocalDate examinationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "examination_type", nullable = false)
    private ExaminationType examinationType;

    @Column(name = "temperature_celsius", precision = 4, scale = 2)
    private BigDecimal temperatureCelsius;

    @Column(name = "heart_rate_bpm")
    private Integer heartRateBpm;

    @Column(name = "respiratory_rate_bpm")
    private Integer respiratoryRateBpm;

    @Column(name = "weight_kg", precision = 6, scale = 2)
    private BigDecimal weightKg;

    @Column(name = "body_condition_score")
    private Integer bodyConditionScore;

    @Column(name = "symptoms", columnDefinition = "JSON")
    private String symptoms;

    @Column(name = "diagnosis", columnDefinition = "TEXT")
    private String diagnosis;

    @Column(name = "treatment_given", columnDefinition = "TEXT")
    private String treatmentGiven;

    @Column(name = "medications_prescribed", columnDefinition = "JSON")
    private String medicationsPrescribed;

    @Column(name = "recommendations", columnDefinition = "TEXT")
    private String recommendations;

    @Column(name = "follow_up_required")
    private Boolean followUpRequired = false;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @Column(name = "consultation_fee", precision = 8, scale = 2)
    private BigDecimal consultationFee;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RecordStatus status = RecordStatus.ACTIVE;

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

    public enum ExaminationType {
        ROUTINE_CHECKUP, SICK_VISIT, FOLLOW_UP, EMERGENCY
    }

    public enum RecordStatus {
        ACTIVE, RESOLVED, ONGOING
    }
}
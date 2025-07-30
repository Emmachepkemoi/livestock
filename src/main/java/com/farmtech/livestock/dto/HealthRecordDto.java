package com.farmtech.livestock.dto;

import com.farmtech.livestock.model.HealthRecord;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class HealthRecordDto {
    private Integer livestockId;
    private Integer vetId;
    private LocalDate examinationDate;
    private HealthRecord.ExaminationType examinationType;
    private BigDecimal temperatureCelsius;
    private Integer heartRateBpm;
    private Integer respiratoryRateBpm;
    private BigDecimal weightKg;
    private Integer bodyConditionScore;
    private List<String> symptoms;
    private String diagnosis;
    private String treatmentGiven;
    private List<String> medicationsPrescribed;
    private String recommendations;
    private Boolean followUpRequired;
    private LocalDate followUpDate;
    private BigDecimal consultationFee;
    private HealthRecord.RecordStatus status;
}
package com.farmtech.livestock.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.farmtech.livestock.dto.HealthRecordDto;
import com.farmtech.livestock.model.HealthRecord;
import com.farmtech.livestock.model.Livestock;
import com.farmtech.livestock.repository.HealthRecordRepository;
import com.farmtech.livestock.repository.LivestockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HealthRecordService {

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private LivestockRepository livestockRepository;

    @Autowired
    private ObjectMapper objectMapper; // For converting lists to JSON

    // Create a new health record
    public HealthRecord addHealthRecord(HealthRecordDto dto) {
        // Validate that livestock exists
        Livestock livestock = livestockRepository.findById(dto.getLivestockId())
                .orElseThrow(() -> new RuntimeException("❌ Livestock not found with ID: " + dto.getLivestockId()));

        HealthRecord record = new HealthRecord();
        record.setLivestock(livestock);

        // Enum-safe parsing
        if (dto.getExaminationType() != null) {
            try {
                record.setExaminationType(dto.getExaminationType());

            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid examination type: " + dto.getExaminationType());
            }
        }

        if (dto.getStatus() != null) {
            try {
                record.setStatus(dto.getStatus());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid status: " + dto.getStatus());
            }
        }

        // Set all the fields
        record.setExaminationDate(dto.getExaminationDate());
        record.setTemperatureCelsius(dto.getTemperatureCelsius());
        record.setHeartRateBpm(dto.getHeartRateBpm());
        record.setRespiratoryRateBpm(dto.getRespiratoryRateBpm());
        record.setWeightKg(dto.getWeightKg());
        record.setBodyConditionScore(dto.getBodyConditionScore());

        // Convert lists to JSON for DB storage
        record.setSymptoms(convertListToJson(dto.getSymptoms()));
        record.setMedicationsPrescribed(convertListToJson(dto.getMedicationsPrescribed()));

        record.setDiagnosis(dto.getDiagnosis());
        record.setTreatmentGiven(dto.getTreatmentGiven());
        record.setRecommendations(dto.getRecommendations());
        record.setFollowUpRequired(dto.getFollowUpRequired());
        record.setFollowUpDate(dto.getFollowUpDate());
        record.setConsultationFee(dto.getConsultationFee());

        return healthRecordRepository.save(record);
    }

    // Get all health records (for vet dashboard)
    public List<HealthRecord> getAllHealthRecords() {
        return healthRecordRepository.findAll();
    }

    // Get all health records for a specific livestock
    public List<HealthRecord> getHealthRecordsByLivestock(Integer livestockId) {
        return healthRecordRepository.findByLivestock_LivestockId(livestockId);
    }

    // Get a specific health record by its ID
    public HealthRecord getHealthRecordById(Integer recordId) {
        Optional<HealthRecord> record = healthRecordRepository.findById(recordId);
        return record.orElse(null);
    }

    // Update an existing health record
    public HealthRecord updateHealthRecord(Integer recordId, HealthRecordDto dto) {
        HealthRecord existingRecord = healthRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Health record not found with ID: " + recordId));

        // Update livestock if changed
        if (dto.getLivestockId() != null && !dto.getLivestockId().equals(existingRecord.getLivestock().getLivestockId())) {
            Livestock livestock = livestockRepository.findById(dto.getLivestockId())
                    .orElseThrow(() -> new RuntimeException("Livestock not found with ID: " + dto.getLivestockId()));
            existingRecord.setLivestock(livestock);
        }

        // Update examination type if provided
        if (dto.getExaminationType() != null) {
            try {
                existingRecord.setExaminationType(HealthRecord.ExaminationType.valueOf(dto.getExaminationType().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid examination type: " + dto.getExaminationType());
            }
        }

        // Update status if provided
        if (dto.getStatus() != null) {
            try {
                existingRecord.setStatus(dto.getStatus());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid status: " + dto.getStatus());
            }
        }

        // Update other fields
        if (dto.getExaminationDate() != null) {
            existingRecord.setExaminationDate(dto.getExaminationDate());
        }
        if (dto.getTemperatureCelsius() != null) {
            existingRecord.setTemperatureCelsius(dto.getTemperatureCelsius());
        }
        if (dto.getHeartRateBpm() != null) {
            existingRecord.setHeartRateBpm(dto.getHeartRateBpm());
        }
        if (dto.getRespiratoryRateBpm() != null) {
            existingRecord.setRespiratoryRateBpm(dto.getRespiratoryRateBpm());
        }
        if (dto.getWeightKg() != null) {
            existingRecord.setWeightKg(dto.getWeightKg());
        }
        if (dto.getBodyConditionScore() != null) {
            existingRecord.setBodyConditionScore(dto.getBodyConditionScore());
        }
        if (dto.getSymptoms() != null) {
            existingRecord.setSymptoms(convertListToJson(dto.getSymptoms()));
        }
        if (dto.getMedicationsPrescribed() != null) {
            existingRecord.setMedicationsPrescribed(convertListToJson(dto.getMedicationsPrescribed()));
        }
        if (dto.getDiagnosis() != null) {
            existingRecord.setDiagnosis(dto.getDiagnosis());
        }
        if (dto.getTreatmentGiven() != null) {
            existingRecord.setTreatmentGiven(dto.getTreatmentGiven());
        }
        if (dto.getRecommendations() != null) {
            existingRecord.setRecommendations(dto.getRecommendations());
        }
        if (dto.getFollowUpRequired() != null) {
            existingRecord.setFollowUpRequired(dto.getFollowUpRequired());
        }
        if (dto.getFollowUpDate() != null) {
            existingRecord.setFollowUpDate(dto.getFollowUpDate());
        }
        if (dto.getConsultationFee() != null) {
            existingRecord.setConsultationFee(dto.getConsultationFee());
        }

        return healthRecordRepository.save(existingRecord);
    }

    // Delete a health record
    public void deleteHealthRecord(Integer recordId) {
        if (!healthRecordRepository.existsById(recordId)) {
            throw new RuntimeException("Health record not found with ID: " + recordId);
        }
        healthRecordRepository.deleteById(recordId);
    }

    // Get health records by livestock and status
    public List<HealthRecord> getHealthRecordsByLivestockAndStatus(Integer livestockId, String status) {
        try {
            HealthRecord.RecordStatus recordStatus = HealthRecord.RecordStatus.valueOf(status.toUpperCase());
            return healthRecordRepository.findByLivestock_LivestockIdAndStatus(livestockId, recordStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
    }

    // Get recent health records (last 30 days)
    public List<HealthRecord> getRecentHealthRecords(Integer days) {
        java.time.LocalDate cutoffDate = java.time.LocalDate.now().minusDays(days);
        return healthRecordRepository.findByExaminationDateAfter(cutoffDate);
    }

    // Helper: Convert list -> JSON string
    private String convertListToJson(List<String> list) {
        if (list == null || list.isEmpty()) return "[]";
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting list to JSON", e);
        }
    }

    // Helper: Convert JSON string -> list
    private List<String> convertJsonToList(String json) {
        if (json == null || json.trim().isEmpty() || "[]".equals(json.trim())) {
            return List.of();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting JSON to list", e);
        }
    }

    // Get health statistics for a livestock
    public HealthRecordStats getHealthRecordStats(Integer livestockId) {
        List<HealthRecord> records = getHealthRecordsByLivestock(livestockId);

        long totalRecords = records.size();
        long activeRecords = records.stream()
                .filter(r -> r.getStatus() == HealthRecord.RecordStatus.ACTIVE)
                .count();
        long resolvedRecords = records.stream()
                .filter(r -> r.getStatus() == HealthRecord.RecordStatus.RESOLVED)
                .count();

        // Calculate average weight if available
        Double averageWeight = records.stream()
                .filter(r -> r.getWeightKg() != null)
                .mapToDouble(r -> r.getWeightKg().doubleValue())
                .average()
                .orElse(0.0);

        return new HealthRecordStats(totalRecords, activeRecords, resolvedRecords, averageWeight);
    }

    public HealthRecordDto mapToDto(HealthRecord record) {
        return new HealthRecordDto(
                record.getLivestock().getLivestockId(),
                record.getVet() != null ? record.getVet().getVetId() : null,
                record.getExaminationDate(),
                record.getExaminationType(),
                record.getTemperatureCelsius(),
                record.getHeartRateBpm(),
                record.getRespiratoryRateBpm(),
                record.getWeightKg(),
                record.getBodyConditionScore(),
                convertJsonToList(record.getSymptoms()),
                record.getDiagnosis(),
                record.getTreatmentGiven(),
                convertJsonToList(record.getMedicationsPrescribed()),
                record.getRecommendations(),
                record.getFollowUpRequired(),
                record.getFollowUpDate(),
                record.getConsultationFee(),
                record.getStatus()
        );
    }


    // Inner class for health record statistics
    public static class HealthRecordStats {
        private long totalRecords;
        private long activeRecords;
        private long resolvedRecords;
        private double averageWeight;

        public HealthRecordStats(long totalRecords, long activeRecords, long resolvedRecords, double averageWeight) {
            this.totalRecords = totalRecords;
            this.activeRecords = activeRecords;
            this.resolvedRecords = resolvedRecords;
            this.averageWeight = averageWeight;
        }

        // Getters
        public long getTotalRecords() { return totalRecords; }
        public long getActiveRecords() { return activeRecords; }
        public long getResolvedRecords() { return resolvedRecords; }
        public double getAverageWeight() { return averageWeight; }

        // Setters
        public void setTotalRecords(long totalRecords) { this.totalRecords = totalRecords; }
        public void setActiveRecords(long activeRecords) { this.activeRecords = activeRecords; }
        public void setResolvedRecords(long resolvedRecords) { this.resolvedRecords = resolvedRecords; }
        public void setAverageWeight(double averageWeight) { this.averageWeight = averageWeight; }
    }
}
package com.farmtech.livestock.controller;

import com.farmtech.livestock.dto.ApiResponse;
import com.farmtech.livestock.dto.HealthRecordDto;
import com.farmtech.livestock.model.HealthRecord;
import com.farmtech.livestock.service.HealthRecordService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health-records")
@CrossOrigin(origins = "*")
public class HealthRecordController {

    @Autowired
    private HealthRecordService healthRecordService;

    // Add a health record
    @PostMapping
    public ResponseEntity<ApiResponse<HealthRecordDto>> createHealthRecord(@RequestBody HealthRecordDto dto) {
        try {
            // Validate required fields
            if (dto.getLivestockId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>(false, "Livestock ID is required", null));
            }

            // Save record
            HealthRecord record = healthRecordService.addHealthRecord(dto);

            // Convert entity back to DTO
            HealthRecordDto responseDto = mapToDto(record);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Health record added successfully", responseDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    // Get all health records (for vet dashboard)
    @GetMapping
    public ResponseEntity<ApiResponse<List<HealthRecordDto>>> getAllHealthRecords() {
        List<HealthRecordDto> dtos = healthRecordService.getAllHealthRecords()
                .stream()
                .map(healthRecordService::mapToDto) // create mapping method
                .toList();

        return ResponseEntity.ok(new ApiResponse<>(true, "Health records retrieved successfully", dtos));
    }


    // Get all health records for a specific livestock
    @GetMapping("/livestock/{livestockId}")
    public ResponseEntity<ApiResponse<List<HealthRecord>>> getHealthRecordsByLivestock(@PathVariable Integer livestockId) {
        try {
            List<HealthRecord> records = healthRecordService.getHealthRecordsByLivestock(livestockId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Health records retrieved successfully", records));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    /**
     * Helper method to map entity to DTO
     */
    private HealthRecordDto mapToDto(HealthRecord record) {
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

    /**
     * Helper: Convert JSON string -> list
     */
    private List<String> convertJsonToList(String json) {
        if (json == null || json.trim().isEmpty() || "[]".equals(json.trim())) {
            return List.of();
        }
        try {
            return new ObjectMapper().readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return List.of();
        }
    }

}


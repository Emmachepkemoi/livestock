package com.farmtech.livestock.controller;

import com.farmtech.livestock.dto.ApiResponse;
import com.farmtech.livestock.dto.LivestockDto;
import com.farmtech.livestock.model.Livestock;
import com.farmtech.livestock.service.AuthService;
import com.farmtech.livestock.service.LivestockService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/livestock")
@CrossOrigin(origins = "*")
public class LivestockController {

    @Autowired
    private LivestockService livestockService;

    @Autowired
    private AuthService authService;

    // ✅ Add livestock with image upload
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<LivestockDto>> createLivestockWithImage(
            @RequestPart("data") @Valid LivestockDto livestockDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = authService.extractUserIdFromToken(authHeader.replace("Bearer ", ""));
            Livestock saved = livestockService.addLivestockWithImage(livestockDto, image, userId);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Livestock added successfully", convertToDto(saved)));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Image upload failed: " + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // ✅ Get all livestock for current user (using email)
    @GetMapping
    public ResponseEntity<ApiResponse<List<LivestockDto>>> getAllLivestock(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            String email = authentication.getName();
            List<Livestock> livestockList = livestockService.getFarmerLivestockByEmail(email, page, size);

            List<LivestockDto> livestockDtos = livestockList.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new ApiResponse<>(true, "Livestock retrieved", livestockDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // ✅ Get livestock by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LivestockDto>> getLivestockById(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            Livestock livestock = livestockService.getLivestockByIdAndEmail(id, email);
            return ResponseEntity.ok(new ApiResponse<>(true, "Livestock found", convertToDto(livestock)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // ✅ Update livestock
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LivestockDto>> updateLivestock(
            @PathVariable Long id,
            @Valid @RequestBody LivestockDto livestockDto,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            Livestock updated = livestockService.updateLivestockByEmail(id, livestockDto, email);
            return ResponseEntity.ok(new ApiResponse<>(true, "Livestock updated", convertToDto(updated)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // ✅ Delete livestock
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteLivestock(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            livestockService.deleteLivestockByEmail(id, email);
            return ResponseEntity.ok(new ApiResponse<>(true, "Livestock deleted", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // ✅ Search livestock
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<LivestockDto>>> searchLivestock(
            @RequestParam String query,
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            String email = authentication.getName();
            List<Livestock> results = livestockService.searchLivestockByEmail(query, email, page, size);

            List<LivestockDto> dtos = results.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new ApiResponse<>(true, "Search results", dtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // ✅ Filter livestock
    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<LivestockDto>>> filterLivestock(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) String status,
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            String email = authentication.getName();
            List<Livestock> results = livestockService.filterLivestockByEmail(type, breed, status, email, page, size);

            List<LivestockDto> dtos = results.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new ApiResponse<>(true, "Filtered results", dtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // ✅ Add health record
    @PostMapping("/{id}/health-record")
    public ResponseEntity<ApiResponse<String>> addHealthRecord(
            @PathVariable Long id,
            @Valid @RequestBody String healthRecord,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            livestockService.addHealthRecordByEmail(id, healthRecord, email);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Health record added", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // ✅ Helper to map entity -> DTO (avoid circular refs)
    private LivestockDto convertToDto(Livestock livestock) {
        LivestockDto dto = new LivestockDto();
        dto.setLivestockId(livestock.getLivestockId());
        dto.setName(livestock.getName());
        dto.setCategoryId(livestock.getCategory() != null ? livestock.getCategory().getCategoryId() : null);
        dto.setCategoryName(livestock.getCategory() != null ? livestock.getCategory().getName() : null);
        dto.setBreedId(livestock.getBreed() != null ? livestock.getBreed().getBreedId() : null);
        dto.setBreedName(livestock.getBreed() != null ? livestock.getBreed().getName() : null);
        dto.setTagNumber(livestock.getTagNumber());
        dto.setGender(livestock.getGender() != null ? livestock.getGender().name() : null);
        dto.setDateOfBirth(livestock.getDateOfBirth());
        dto.setEstimatedAgeMonths(livestock.getEstimatedAgeMonths());

        // Handle BigDecimal to Double conversion
        dto.setWeightKg(livestock.getWeightKg() != null ? livestock.getWeightKg().doubleValue() : null);
        dto.setAcquisitionCost(livestock.getAcquisitionCost() != null ? livestock.getAcquisitionCost().doubleValue() : null);
        dto.setCurrentValue(livestock.getCurrentValue() != null ? livestock.getCurrentValue().doubleValue() : null);
        dto.setInsuranceValue(livestock.getInsuranceValue() != null ? livestock.getInsuranceValue().doubleValue() : null);
        dto.setSalePrice(livestock.getSalePrice() != null ? livestock.getSalePrice().doubleValue() : null);

        dto.setColor(livestock.getColor());
        dto.setHealthStatus(livestock.getHealthStatus() != null ? livestock.getHealthStatus().name() : null);
        dto.setAcquisitionDate(livestock.getAcquisitionDate());
        dto.setAcquisitionMethod(livestock.getAcquisitionMethod() != null ? livestock.getAcquisitionMethod().name() : null);
        dto.setMotherId(livestock.getMotherId());
        dto.setFatherId(livestock.getFatherId());
        dto.setLocationOnFarm(livestock.getLocationOnFarm());
        dto.setIdentificationMarks(livestock.getIdentificationMarks());
        dto.setMicrochipNumber(livestock.getMicrochipNumber());
        dto.setInsurancePolicyNumber(livestock.getInsurancePolicyNumber());
        dto.setIsForSale(livestock.getIsForSale());
        dto.setNotes(livestock.getNotes());
        dto.setImages(livestock.getImages());

        return dto;
    }
}
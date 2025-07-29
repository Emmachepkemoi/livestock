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
                    .body(new ApiResponse<>(true, "Livestock added successfully", mapToDto(saved)));
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
                    .map(this::mapToDto)
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
            return ResponseEntity.ok(new ApiResponse<>(true, "Livestock found", mapToDto(livestock)));
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
            return ResponseEntity.ok(new ApiResponse<>(true, "Livestock updated", mapToDto(updated)));
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
                    .map(this::mapToDto)
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
                    .map(this::mapToDto)
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
    private LivestockDto mapToDto(Livestock livestock) {
        return new LivestockDto(
                livestock.getLivestockId(),
                livestock.getName(),
                livestock.getCategory() != null ? livestock.getCategory().getCategoryId() : null,
                livestock.getBreed() != null ? livestock.getBreed().getBreedId() : null,
                livestock.getHealthStatus() != null ? livestock.getHealthStatus().name() : null,
                livestock.getGender() != null ? livestock.getGender().name() : null,
                livestock.getWeightKg() != null ? livestock.getWeightKg().doubleValue() : null,
                livestock.getTagNumber(),
                livestock.getColor(),
                livestock.getDateOfBirth(),
                livestock.getEstimatedAgeMonths(),
                livestock.getLocationOnFarm(),
                livestock.getNotes(),
                livestock.getImages()
        );
    }
}

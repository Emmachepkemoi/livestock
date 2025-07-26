package com.farmtech.livestock.controller;

import com.farmtech.livestock.model.Livestock;
import com.farmtech.livestock.dto.LivestockDto;
import com.farmtech.livestock.dto.ApiResponse;
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

@RestController
@RequestMapping("/api/livestock")
@CrossOrigin(origins = "*")
public class LivestockController {

    @Autowired
    private LivestockService livestockService;

    @Autowired
    private AuthService authService;

    // ✅ Combined: Add livestock with image upload
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Livestock>> createLivestockWithImage(
            @RequestPart("data") @Valid LivestockDto livestockDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = authService.extractUserIdFromToken(authHeader.replace("Bearer ", ""));
            Livestock saved = livestockService.addLivestockWithImage(livestockDto, image, userId);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Livestock added successfully", saved));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Image upload failed: " + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // ✅ Get all livestock for current user
    @GetMapping
    public ResponseEntity<ApiResponse<List<Livestock>>> getAllLivestock(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            String username = authentication.getName();
            List<Livestock> livestockList = livestockService.getFarmerLivestock(username, page, size);
            return ResponseEntity.ok(new ApiResponse<>(true, "Livestock retrieved", livestockList));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // ✅ Get livestock by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Livestock>> getLivestockById(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Livestock livestock = livestockService.getLivestockById(id, username);
            return ResponseEntity.ok(new ApiResponse<>(true, "Livestock found", livestock));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // ✅ Update livestock
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Livestock>> updateLivestock(
            @PathVariable Long id,
            @Valid @RequestBody LivestockDto livestockDto,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Livestock updated = livestockService.updateLivestock(id, livestockDto, username);
            return ResponseEntity.ok(new ApiResponse<>(true, "Livestock updated", updated));
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
            String username = authentication.getName();
            livestockService.deleteLivestock(id, username);
            return ResponseEntity.ok(new ApiResponse<>(true, "Livestock deleted", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // ✅ Search livestock
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Livestock>>> searchLivestock(
            @RequestParam String query,
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            String username = authentication.getName();
            List<Livestock> results = livestockService.searchLivestock(query, username, page, size);
            return ResponseEntity.ok(new ApiResponse<>(true, "Search results", results));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // ✅ Filter livestock
    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<Livestock>>> filterLivestock(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) String status,
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            String username = authentication.getName();
            List<Livestock> results = livestockService.filterLivestock(type, breed, status, username, page, size);
            return ResponseEntity.ok(new ApiResponse<>(true, "Filtered results", results));
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
            String username = authentication.getName();
            livestockService.addHealthRecord(id, healthRecord, username);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Health record added", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}

package com.farmtech.livestock.controller;

import com.farmtech.livestock.model.Livestock;
import com.farmtech.livestock.service.LivestockService;
import com.farmtech.livestock.dto.LivestockDto;
import com.farmtech.livestock.dto.ApiResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/livestock")
@CrossOrigin(origins = "*")
public class LivestockController {

    @Autowired
    private LivestockService livestockService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Livestock>>> getAllLivestock(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            String username = authentication.getName();
            List<Livestock> livestock = livestockService.getFarmerLivestock(username, page, size);
            return ResponseEntity.ok(new ApiResponse<>(true, "Livestock retrieved successfully", livestock));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Livestock>> getLivestockById(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Livestock livestock = livestockService.getLivestockById(id, username);
            return ResponseEntity.ok(new ApiResponse<>(true, "Livestock retrieved successfully", livestock));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Livestock>> addLivestock(
            @Valid @RequestBody LivestockDto livestockDto,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Livestock livestock = livestockService.addLivestock(livestockDto, username);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Livestock added successfully", livestock));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Livestock>> updateLivestock(
            @PathVariable Long id,
            @Valid @RequestBody LivestockDto livestockDto,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Livestock updatedLivestock = livestockService.updateLivestock(id, livestockDto, username);
            return ResponseEntity.ok(new ApiResponse<>(true, "Livestock updated successfully", updatedLivestock));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteLivestock(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            livestockService.deleteLivestock(id, username);
            return ResponseEntity.ok(new ApiResponse<>(true, "Livestock deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Livestock>>> searchLivestock(
            @RequestParam String query,
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            String username = authentication.getName();
            List<Livestock> livestock = livestockService.searchLivestock(query, username, page, size);
            return ResponseEntity.ok(new ApiResponse<>(true, "Search completed successfully", livestock));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

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
            List<Livestock> livestock = livestockService.filterLivestock(type, breed, status, username, page, size);
            return ResponseEntity.ok(new ApiResponse<>(true, "Livestock filtered successfully", livestock));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/{id}/health-record")
    public ResponseEntity<ApiResponse<String>> addHealthRecord(
            @PathVariable Long id,
            @Valid @RequestBody String healthRecord,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            livestockService.addHealthRecord(id, healthRecord, username);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Health record added successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
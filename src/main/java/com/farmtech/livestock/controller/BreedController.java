package com.farmtech.livestock.controller;

import com.farmtech.livestock.dto.ApiResponse;
import com.farmtech.livestock.dto.BreedResponseDTO;
import com.farmtech.livestock.model.LivestockBreed;
import com.farmtech.livestock.service.BreedService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.farmtech.livestock.dto.BreedRequestDTO;

import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/breeds")
@CrossOrigin(origins = "http://localhost:5173") // Replace with your frontend origin
public class BreedController {

    @Autowired
    private BreedService breedService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BreedResponseDTO>>> getAllBreeds() {
        List<BreedResponseDTO> breeds = breedService.getAllBreeds();  // ✅ Corrected type
        return ResponseEntity.ok(new ApiResponse<>(true, "Breeds retrieved successfully", breeds));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BreedResponseDTO>> getBreedById(@PathVariable Integer id) {
        Optional<BreedResponseDTO> breed = breedService.getBreedById(id);  // Correct type
        if (breed.isPresent()) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Breed retrieved successfully", breed.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Breed not found", null));
        }
    }


    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<BreedResponseDTO>> createBreed(@Valid @RequestBody BreedRequestDTO breedDTO) {
        BreedResponseDTO savedBreed = breedService.createBreed(breedDTO);  // Correct type
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Breed created successfully", savedBreed),
                HttpStatus.CREATED
        );
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'FARMER')")
    public ResponseEntity<ApiResponse<BreedResponseDTO>> updateBreed(
            @PathVariable Integer id,
            @Valid @RequestBody BreedRequestDTO updatedBreedDto) {
        BreedResponseDTO updated = breedService.updateBreed(id, updatedBreedDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Breed updated successfully", updated));
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'FARMER')")
    public ResponseEntity<ApiResponse<String>> deleteBreed(@PathVariable Integer id) {
        breedService.deleteBreed(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Breed deleted successfully", null));
    }
}

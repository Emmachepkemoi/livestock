package com.farmtech.livestock.controller;

import com.farmtech.livestock.dto.ApiResponse;
import com.farmtech.livestock.dto.FarmerProfileDto;
import com.farmtech.livestock.model.User;
import com.farmtech.livestock.model.UserRole;
import com.farmtech.livestock.repository.UserRepository;
import com.farmtech.livestock.service.FarmerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/farmers")
@CrossOrigin(origins = "*")
public class FarmerController {

    private final FarmerService farmerService;
    private final UserRepository userRepository;

    @Autowired
    public FarmerController(FarmerService farmerService, UserRepository userRepository) {
        this.farmerService = farmerService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FarmerProfileDto>>> getAllFarmers() {
        List<User> farmers = userRepository.findAllByRoleName(UserRole.RoleName.FARMER);
        if (farmers.isEmpty()) {
            return ResponseEntity.ok(new ApiResponse<>(true, "No farmers found", List.of()));
        }

        List<FarmerProfileDto> farmerDtos = farmers.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new ApiResponse<>(true, "Farmers fetched successfully", farmerDtos));
    }

    private FarmerProfileDto mapToDto(User user) {
        FarmerProfileDto dto = new FarmerProfileDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setEmail(user.getEmail());
        // Optional: add farmName or livestock if available via user.getFarmerProfile() etc.
        return dto;
    }
}

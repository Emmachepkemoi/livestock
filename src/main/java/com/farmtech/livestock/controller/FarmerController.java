package com.farmtech.livestock.controller;

import com.farmtech.livestock.dto.FarmerProfileDto;
import com.farmtech.livestock.service.FarmerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmers")
@CrossOrigin(origins = "*")
public class FarmerController {

    private final FarmerService farmerService;

    @Autowired
    public FarmerController(FarmerService farmerService) {
        this.farmerService = farmerService;
    }

    @GetMapping
    public List<FarmerProfileDto> getAllFarmers() {
        return farmerService.getAllFarmers();
    }
}

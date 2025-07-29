package com.farmtech.livestock.service;

import com.farmtech.livestock.dto.FarmerProfileDto;
import com.farmtech.livestock.dto.SimpleLivestockDto;
import com.farmtech.livestock.model.FarmerProfile;
import com.farmtech.livestock.repository.FarmerProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FarmerService {

    private final FarmerProfileRepository farmerProfileRepository;

    @Autowired
    public FarmerService(FarmerProfileRepository farmerProfileRepository) {
        this.farmerProfileRepository = farmerProfileRepository;
    }

    public List<FarmerProfileDto> getAllFarmers() {
        return farmerProfileRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private FarmerProfileDto mapToDto(FarmerProfile farmer) {
        List<SimpleLivestockDto> livestockDTOs = farmer.getLivestock()
                .stream()
                .map(l -> new SimpleLivestockDto(
                        l.getLivestockId(),
                        l.getName(),
                        l.getCategory().getName(),
                        l.getBreed().getName()
                ))
                .collect(Collectors.toList());

        return new FarmerProfileDto(
                farmer.getFarmerId(),
                farmer.getUser().getFirstName(),
                farmer.getUser().getLastName(),

                farmer.getFarmName(),

                farmer.getUser().getPhoneNumber(),
                farmer.getUser().getEmail(),

                livestockDTOs
        );
    }
}

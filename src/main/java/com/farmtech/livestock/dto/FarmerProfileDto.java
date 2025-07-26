package com.farmtech.livestock.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FarmerProfileDto {

    private Integer id;
    private String fullName;
    private String nationalId;
    private String farmName;
    private String location;
    private String phoneNumber;
    private String email;
    private String profileImage;

    // Instead of full LivestockDto to prevent large or circular responses,
    // use simplified version or just IDs if needed.
    private List<SimpleLivestockDto> livestock;
}

package com.farmtech.livestock.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FarmerProfileDto {

    private Long id;                     // FarmerProfile ID

    private String firstName;
    private String lastName;// Derived from User (firstName + lastName)
    private String farmName;                // From FarmerProfile
    private String phoneNumber;             // From User
    private String email;                   // From User

    // List of livestock (can be simplified or partial)
    private List<SimpleLivestockDto> livestock;

}

package com.farmtech.livestock.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimpleLivestockDto {
    private Integer livestockId;
    private String name;
    private String categoryName;
    private String breedName;
}

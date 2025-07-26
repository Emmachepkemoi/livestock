package com.farmtech.livestock.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimpleLivestockDto {
    private Integer livestockId;
    private String name;
    private String tagNumber;
}

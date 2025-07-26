package com.farmtech.livestock.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class LivestockCategoryDTO {
    private Integer categoryId;
    private String name;
    private String description;
    private String icon;
    private String color;
    private Boolean isActive;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Use your existing DTO for breeds
    private List<BreedResponseDTO> breeds;
}


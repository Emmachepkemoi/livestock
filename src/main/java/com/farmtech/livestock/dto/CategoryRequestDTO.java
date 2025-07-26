package com.farmtech.livestock.dto;

import lombok.Data;

@Data
public class CategoryRequestDTO {
    private String name;
    private String description;
    private String icon;
    private String color;
    private Boolean isActive;
    private Integer sortOrder;
}

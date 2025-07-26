package com.farmtech.livestock.service;

import com.farmtech.livestock.dto.CategoryRequestDTO;
import com.farmtech.livestock.dto.CategoryResponseDTO;
import com.farmtech.livestock.model.LivestockCategory;
import com.farmtech.livestock.repository.LivestockCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LivestockCategoryService {

    @Autowired
    private LivestockCategoryRepository repository;

    public List<CategoryResponseDTO> getAllCategories() {
        return repository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public CategoryResponseDTO getCategoryById(Integer id) {
        LivestockCategory category = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return toResponseDTO(category);
    }

    public CategoryResponseDTO createCategory(CategoryRequestDTO dto) {
        LivestockCategory category = new LivestockCategory();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setIcon(dto.getIcon());
        category.setColor(dto.getColor());
        category.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        category.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);

        return toResponseDTO(repository.save(category));
    }

    public CategoryResponseDTO updateCategory(Integer id, CategoryRequestDTO dto) {
        LivestockCategory category = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setIcon(dto.getIcon());
        category.setColor(dto.getColor());
        category.setIsActive(dto.getIsActive());
        category.setSortOrder(dto.getSortOrder());

        return toResponseDTO(repository.save(category));
    }

    public void deleteCategory(Integer id) {
        repository.deleteById(id);
    }

    private CategoryResponseDTO toResponseDTO(LivestockCategory category) {
        CategoryResponseDTO dto = new CategoryResponseDTO();
        dto.setId(category.getCategoryId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setIcon(category.getIcon());
        dto.setColor(category.getColor());
        dto.setIsActive(category.getIsActive());
        dto.setSortOrder(category.getSortOrder());
        dto.setCreatedAt(category.getCreatedAt());
        dto.setUpdatedAt(category.getUpdatedAt());
        return dto;
    }
}

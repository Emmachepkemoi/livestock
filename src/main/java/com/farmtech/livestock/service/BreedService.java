package com.farmtech.livestock.service;

import com.farmtech.livestock.dto.BreedRequestDTO;
import com.farmtech.livestock.dto.BreedResponseDTO;
import com.farmtech.livestock.model.LivestockBreed;
import com.farmtech.livestock.model.LivestockCategory;
import com.farmtech.livestock.repository.LivestockBreedRepository;
import com.farmtech.livestock.repository.LivestockCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BreedService {

    @Autowired
    private LivestockBreedRepository breedRepository;

    @Autowired
    private LivestockCategoryRepository categoryRepository;

    public List<BreedResponseDTO> getAllBreeds() {
        return breedRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Optional<BreedResponseDTO> getBreedById(Integer id) {
        return breedRepository.findById(id).map(this::mapToDTO);
    }

    @Transactional
    public BreedResponseDTO createBreed(BreedRequestDTO dto) {
        LivestockCategory category = categoryRepository.findByName(dto.getCategoryName())
                .orElseThrow(() -> new RuntimeException("Category not found with name: " + dto.getCategoryName()));

        LivestockBreed breed = new LivestockBreed();
        mapDtoToEntity(dto, breed);
        breed.setCategory(category);

        LivestockBreed saved = breedRepository.save(breed);
        return mapToDTO(saved);
    }

    @Transactional
    public BreedResponseDTO updateBreed(Integer id, BreedRequestDTO dto) {
        LivestockBreed existing = breedRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Breed not found with ID: " + id));

        mapDtoToEntity(dto, existing);

        if (dto.getCategoryName() != null) {
            LivestockCategory category = categoryRepository.findByName(dto.getCategoryName())
                    .orElseThrow(() -> new RuntimeException("Category not found with name: " + dto.getCategoryName()));
            existing.setCategory(category);
        }

        LivestockBreed updated = breedRepository.save(existing);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteBreed(Integer id) {
        LivestockBreed breed = breedRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Breed not found with ID: " + id));
        breedRepository.delete(breed);
    }

    // ------------------------ Mapping Helpers ------------------------

    private BreedResponseDTO mapToDTO(LivestockBreed breed) {
        BreedResponseDTO dto = new BreedResponseDTO();
        dto.setBreedId(breed.getBreedId());
        dto.setCategoryName(breed.getCategory().getName());
        dto.setName(breed.getName());
        dto.setDescription(breed.getDescription());
        dto.setOriginCountry(breed.getOriginCountry());
        dto.setAverageWeightMaleKg(breed.getAverageWeightMaleKg());
        dto.setAverageWeightFemaleKg(breed.getAverageWeightFemaleKg());
        dto.setAverageLifespanYears(breed.getAverageLifespanYears());
        dto.setMaturityAgeMonths(breed.getMaturityAgeMonths());
        dto.setGestationPeriodDays(breed.getGestationPeriodDays());
        dto.setAverageLitterSize(breed.getAverageLitterSize());
        dto.setPrimaryPurpose(breed.getPrimaryPurpose());
        dto.setCharacteristics(breed.getCharacteristics());
        dto.setIsActive(breed.getIsActive());
        return dto;
    }

    private void mapDtoToEntity(BreedRequestDTO dto, LivestockBreed breed) {
        breed.setName(dto.getName());
        breed.setDescription(dto.getDescription());
        breed.setOriginCountry(dto.getOriginCountry());
        breed.setAverageWeightMaleKg(dto.getAverageWeightMaleKg());
        breed.setAverageWeightFemaleKg(dto.getAverageWeightFemaleKg());
        breed.setAverageLifespanYears(dto.getAverageLifespanYears());
        breed.setMaturityAgeMonths(dto.getMaturityAgeMonths());
        breed.setGestationPeriodDays(dto.getGestationPeriodDays());
        breed.setAverageLitterSize(dto.getAverageLitterSize());
        breed.setPrimaryPurpose(dto.getPrimaryPurpose());
        breed.setCharacteristics(dto.getCharacteristics());
        breed.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true); // default to true
    }
}

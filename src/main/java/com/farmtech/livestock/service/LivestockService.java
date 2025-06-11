package com.farmtech.livestock.service;

import com.farmtech.livestock.model.Livestock;
import com.farmtech.livestock.model.FarmerProfile;
import com.farmtech.livestock.model.LivestockBreed;
import com.farmtech.livestock.model.LivestockCategory;
import com.farmtech.livestock.repository.LivestockRepository;
import com.farmtech.livestock.repository.FarmerProfileRepository;
import com.farmtech.livestock.repository.LivestockBreedRepository;
import com.farmtech.livestock.repository.LivestockCategoryRepository;
import com.farmtech.livestock.dto.LivestockDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class LivestockService {

    private final LivestockRepository repository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final LivestockBreedRepository breedRepository;
    private final LivestockCategoryRepository categoryRepository;

    @Autowired
    public LivestockService(LivestockRepository repository,
                            FarmerProfileRepository farmerProfileRepository,
                            LivestockBreedRepository breedRepository,
                            LivestockCategoryRepository categoryRepository) {
        this.repository = repository;
        this.farmerProfileRepository = farmerProfileRepository;
        this.breedRepository = breedRepository;
        this.categoryRepository = categoryRepository;
    }

    // Method expected by controller - returns List with pagination
    public List<Livestock> getFarmerLivestock(String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Livestock> livestockPage = repository.findByFarmer_User_Username(username, pageable);
        return livestockPage.getContent();
    }

    // Method to get single livestock by ID
    public Livestock getLivestockById(Long id, String username) {
        Optional<Livestock> livestock = repository.findByIdAndFarmer_User_Username(id.intValue(), username);

        if (livestock.isPresent()) {
            return livestock.get();
        } else {
            throw new RuntimeException("Livestock not found with id: " + id + " for user: " + username);
        }
    }

    // Method to add new livestock
    public Livestock addLivestock(LivestockDto livestockDto, String username) {
        Optional<FarmerProfile> farmerProfile = farmerProfileRepository.findByUser_Username(username);
        if (farmerProfile.isPresent()) {
            Livestock livestock = convertDtoToEntity(livestockDto);
            livestock.setFarmer(farmerProfile.get());
            return repository.save(livestock);
        } else {
            throw new RuntimeException("Farmer profile not found for username: " + username);
        }
    }

    // Method to update livestock
    public Livestock updateLivestock(Long id, LivestockDto livestockDto, String username) {
        Optional<Livestock> existingLivestock = repository.findByIdAndFarmer_User_Username(id.intValue(), username);

        if (existingLivestock.isPresent()) {
            Livestock livestock = existingLivestock.get();
            updateEntityFromDto(livestock, livestockDto);
            return repository.save(livestock);
        } else {
            throw new RuntimeException("Livestock not found with id: " + id + " for user: " + username);
        }
    }

    // Method to delete livestock
    public void deleteLivestock(Long id, String username) {
        Optional<Livestock> livestock = repository.findByIdAndFarmer_User_Username(id.intValue(), username);

        if (livestock.isPresent()) {
            repository.delete(livestock.get());
        } else {
            throw new RuntimeException("Livestock not found with id: " + id + " for user: " + username);
        }
    }

    // Method to search livestock
    public List<Livestock> searchLivestock(String query, String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Livestock> livestockPage = repository.findByFarmer_User_UsernameAndNameContainingIgnoreCase(username, query, pageable);
        return livestockPage.getContent();
    }

    // Method to filter livestock
    public List<Livestock> filterLivestock(String type, String breed, String status, String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Livestock> livestockPage = repository.findByFilters(type, breed, status, username, pageable);
        return livestockPage.getContent();
    }

    // Method to add health record (updated to use notes field)
    public void addHealthRecord(Long id, String healthRecord, String username) {
        Optional<Livestock> livestock = repository.findByIdAndFarmer_User_Username(id.intValue(), username);

        if (livestock.isPresent()) {
            Livestock animal = livestock.get();
            // Add health record to notes field
            String existingNotes = animal.getNotes() != null ? animal.getNotes() : "";
            String updatedNotes = existingNotes.isEmpty() ?
                    "Health Record: " + healthRecord :
                    existingNotes + "\nHealth Record: " + healthRecord;
            animal.setNotes(updatedNotes);
            repository.save(animal);
        } else {
            throw new RuntimeException("Livestock not found with id: " + id + " for user: " + username);
        }
    }

    // Helper method to convert DTO to Entity
    private Livestock convertDtoToEntity(LivestockDto dto) {
        Livestock livestock = new Livestock();

        if (dto.getName() != null) livestock.setName(dto.getName());

        // Handle category (assuming dto has categoryId or categoryName)
        if (dto.getCategoryId() != null) {
            Optional<LivestockCategory> category = categoryRepository.findById(dto.getCategoryId());
            category.ifPresent(livestock::setCategory);
        }

        // Handle breed (assuming dto has breedId or breedName)
        if (dto.getBreedId() != null) {
            Optional<LivestockBreed> breed = breedRepository.findById(dto.getBreedId());
            breed.ifPresent(livestock::setBreed);
        }

        // Handle age - convert to estimatedAgeMonths
        if (dto.getAge() != null) livestock.setEstimatedAgeMonths(dto.getAge());

        // Handle weight - use weightKg
        if (dto.getWeight() != null) livestock.setWeightKg(BigDecimal.valueOf(dto.getWeight()));

        // Handle health status
        if (dto.getHealthStatus() != null) {
            try {
                livestock.setHealthStatus(Livestock.HealthStatus.valueOf(dto.getHealthStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Default to HEALTHY if invalid status provided
                livestock.setHealthStatus(Livestock.HealthStatus.HEALTHY);
            }
        }

        // Handle gender
        if (dto.getGender() != null) {
            try {
                livestock.setGender(Livestock.Gender.valueOf(dto.getGender().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Handle invalid gender - you might want to throw an exception here
                throw new RuntimeException("Invalid gender: " + dto.getGender());
            }
        }

        // Handle other fields from DTO
        if (dto.getTagNumber() != null) livestock.setTagNumber(dto.getTagNumber());
        if (dto.getColor() != null) livestock.setColor(dto.getColor());
        if (dto.getDateOfBirth() != null) livestock.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getAcquisitionDate() != null) livestock.setAcquisitionDate(dto.getAcquisitionDate());
        if (dto.getAcquisitionCost() != null) livestock.setAcquisitionCost(BigDecimal.valueOf(dto.getAcquisitionCost()));
        if (dto.getCurrentValue() != null) livestock.setCurrentValue(BigDecimal.valueOf(dto.getCurrentValue()));
        if (dto.getLocationOnFarm() != null) livestock.setLocationOnFarm(dto.getLocationOnFarm());
        if (dto.getNotes() != null) livestock.setNotes(dto.getNotes());

        return livestock;
    }

    // Helper method to update entity from DTO
    private void updateEntityFromDto(Livestock livestock, LivestockDto dto) {
        if (dto.getName() != null) livestock.setName(dto.getName());

        // Handle category update
        if (dto.getCategoryId() != null) {
            Optional<LivestockCategory> category = categoryRepository.findById(dto.getCategoryId());
            category.ifPresent(livestock::setCategory);
        }

        // Handle breed update
        if (dto.getBreedId() != null) {
            Optional<LivestockBreed> breed = breedRepository.findById(dto.getBreedId());
            breed.ifPresent(livestock::setBreed);
        }

        // Handle age update
        if (dto.getAge() != null) livestock.setEstimatedAgeMonths(dto.getAge());

        // Handle weight update
        if (dto.getWeight() != null) livestock.setWeightKg(BigDecimal.valueOf(dto.getWeight()));

        // Handle health status update
        if (dto.getHealthStatus() != null) {
            try {
                livestock.setHealthStatus(Livestock.HealthStatus.valueOf(dto.getHealthStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Keep existing status if invalid status provided
                System.err.println("Invalid health status provided: " + dto.getHealthStatus());
            }
        }

        // Handle gender update
        if (dto.getGender() != null) {
            try {
                livestock.setGender(Livestock.Gender.valueOf(dto.getGender().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid gender: " + dto.getGender());
            }
        }

        // Handle other field updates
        if (dto.getTagNumber() != null) livestock.setTagNumber(dto.getTagNumber());
        if (dto.getColor() != null) livestock.setColor(dto.getColor());
        if (dto.getDateOfBirth() != null) livestock.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getAcquisitionDate() != null) livestock.setAcquisitionDate(dto.getAcquisitionDate());
        if (dto.getAcquisitionCost() != null) livestock.setAcquisitionCost(BigDecimal.valueOf(dto.getAcquisitionCost()));
        if (dto.getCurrentValue() != null) livestock.setCurrentValue(BigDecimal.valueOf(dto.getCurrentValue()));
        if (dto.getLocationOnFarm() != null) livestock.setLocationOnFarm(dto.getLocationOnFarm());
        if (dto.getNotes() != null) livestock.setNotes(dto.getNotes());
    }

    // Legacy methods for backward compatibility
    public List<Livestock> getAllByUsername(String username) {
        return repository.findByFarmer_User_Username(username);
    }

    public Page<Livestock> getAllByUsernamePaged(String username, Pageable pageable) {
        return repository.findByFarmer_User_Username(username, pageable);
    }

    public Optional<Livestock> getByIdAndUsername(Long id, String username) {
        return repository.findByIdAndFarmer_User_Username(id.intValue(), username);
    }

    public Livestock save(Livestock livestock, String username) {
        Optional<FarmerProfile> farmerProfile = farmerProfileRepository.findByUser_Username(username);
        if (farmerProfile.isPresent()) {
            livestock.setFarmer(farmerProfile.get());
            return repository.save(livestock);
        } else {
            throw new RuntimeException("Farmer profile not found for username: " + username);
        }
    }

    public void deleteById(Long id, String username) {
        Optional<Livestock> livestock = getByIdAndUsername(id, username);
        livestock.ifPresent(repository::delete);
    }
}
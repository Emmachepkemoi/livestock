package com.farmtech.livestock.service;

import com.farmtech.livestock.dto.LivestockDto;
import com.farmtech.livestock.model.*;
import com.farmtech.livestock.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.*;
import java.util.*;

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

    public Livestock addLivestock(LivestockDto dto, Long userId) {
        FarmerProfile farmer = farmerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Farmer profile not found for user ID: " + userId));

        Livestock livestock = convertDtoToEntity(dto);
        livestock.setFarmer(farmer);
        return repository.save(livestock);
    }

    public Livestock addLivestockWithImage(LivestockDto dto, MultipartFile image, Long userId) throws IOException {
        String imagePath = saveImageToFileSystem(image);

        FarmerProfile farmer = farmerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Farmer profile not found for user ID: " + userId));

        Livestock livestock = convertDtoToEntity(dto);
        livestock.setFarmer(farmer);
        livestock.setImages("[\"" + imagePath + "\"]"); // Store as JSON array string
        return repository.save(livestock);
    }

    private String saveImageToFileSystem(MultipartFile image) throws IOException {
        String uploadDir = "uploads/livestock-images/";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        String filename = UUID.randomUUID() + "_" + Objects.requireNonNull(image.getOriginalFilename());
        Path path = Paths.get(uploadDir + filename);
        Files.write(path, image.getBytes());

        return filename;
    }

    public Livestock updateLivestock(Long id, LivestockDto dto, String username) {
        Livestock livestock = getLivestockById(id, username);
        updateEntityFromDto(livestock, dto);
        return repository.save(livestock);
    }

    public void deleteLivestock(Long id, String username) {
        Livestock livestock = getLivestockById(id, username);
        repository.delete(livestock);
    }

    public Livestock getLivestockById(Long id, String username) {
        return repository.findByIdAndFarmer_User_Username(id.intValue(), username)
                .orElseThrow(() -> new RuntimeException("Livestock not found with id: " + id));
    }

    public List<Livestock> getFarmerLivestock(String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findByFarmer_User_Username(username, pageable).getContent();
    }

    public List<Livestock> searchLivestock(String query, String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findByFarmer_User_UsernameAndNameContainingIgnoreCase(username, query, pageable).getContent();
    }

    public List<Livestock> filterLivestock(String type, String breed, String status, String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findByFilters(type, breed, status, username, pageable).getContent();
    }

    public void addHealthRecord(Long id, String healthRecord, String username) {
        Livestock livestock = getLivestockById(id, username);
        String notes = Optional.ofNullable(livestock.getNotes()).orElse("");
        notes += notes.isEmpty() ? "Health Record: " + healthRecord : "\nHealth Record: " + healthRecord;
        livestock.setNotes(notes);
        repository.save(livestock);
    }

    private Livestock convertDtoToEntity(LivestockDto dto) {
        Livestock livestock = new Livestock();
        livestock.setName(dto.getName());
        livestock.setEstimatedAgeMonths(dto.getAge());
        livestock.setWeightKg(toBigDecimal(dto.getWeight()));
        livestock.setTagNumber(dto.getTagNumber());
        livestock.setColor(dto.getColor());
        livestock.setDateOfBirth(dto.getDateOfBirth());
        livestock.setAcquisitionDate(dto.getAcquisitionDate());
        livestock.setAcquisitionCost(toBigDecimal(dto.getAcquisitionCost()));
        livestock.setCurrentValue(toBigDecimal(dto.getCurrentValue()));
        livestock.setLocationOnFarm(dto.getLocationOnFarm());
        livestock.setNotes(dto.getNotes());
        livestock.setImages(dto.getImages());

        setEnumSafe(() -> Livestock.HealthStatus.valueOf(dto.getHealthStatus().toUpperCase()), livestock::setHealthStatus);
        setEnumSafe(() -> Livestock.Gender.valueOf(dto.getGender().toUpperCase()), livestock::setGender);
        setEnumSafe(() -> Livestock.AcquisitionMethod.valueOf(dto.getAcquisitionMethod().toUpperCase()), livestock::setAcquisitionMethod);

        categoryRepository.findById(dto.getCategoryId()).ifPresent(livestock::setCategory);
        breedRepository.findById(dto.getBreedId()).ifPresent(livestock::setBreed);

        return livestock;
    }

    private void updateEntityFromDto(Livestock livestock, LivestockDto dto) {
        livestock.setName(dto.getName());
        livestock.setEstimatedAgeMonths(dto.getAge());
        livestock.setWeightKg(toBigDecimal(dto.getWeight()));
        livestock.setTagNumber(dto.getTagNumber());
        livestock.setColor(dto.getColor());
        livestock.setDateOfBirth(dto.getDateOfBirth());
        livestock.setAcquisitionDate(dto.getAcquisitionDate());
        livestock.setAcquisitionCost(toBigDecimal(dto.getAcquisitionCost()));
        livestock.setCurrentValue(toBigDecimal(dto.getCurrentValue()));
        livestock.setLocationOnFarm(dto.getLocationOnFarm());
        livestock.setNotes(dto.getNotes());
        livestock.setImages(dto.getImages());

        setEnumSafe(() -> Livestock.HealthStatus.valueOf(dto.getHealthStatus().toUpperCase()), livestock::setHealthStatus);
        setEnumSafe(() -> Livestock.Gender.valueOf(dto.getGender().toUpperCase()), livestock::setGender);
        setEnumSafe(() -> Livestock.AcquisitionMethod.valueOf(dto.getAcquisitionMethod().toUpperCase()), livestock::setAcquisitionMethod);

        categoryRepository.findById(dto.getCategoryId()).ifPresent(livestock::setCategory);
        breedRepository.findById(dto.getBreedId()).ifPresent(livestock::setBreed);
    }

    private BigDecimal toBigDecimal(Double value) {
        return value != null ? BigDecimal.valueOf(value) : null;
    }

    private <E extends Enum<E>> void setEnumSafe(EnumSupplier<E> supplier, java.util.function.Consumer<E> setter) {
        try {
            E value = supplier.get();
            if (value != null) setter.accept(value);
        } catch (Exception ignored) {}
    }

    @FunctionalInterface
    private interface EnumSupplier<E extends Enum<E>> {
        E get();
    }
}
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

    // ✅ Add livestock without image
    public Livestock addLivestock(LivestockDto dto, Long userId) {
        FarmerProfile farmer = farmerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Farmer profile not found for user ID: " + userId));

        Livestock livestock = convertDtoToEntity(dto);
        livestock.setFarmer(farmer);
        return repository.save(livestock);
    }

    // ✅ Add livestock with image
    public Livestock addLivestockWithImage(LivestockDto dto, MultipartFile image, Long userId) throws IOException {
        String imagePath = image != null ? saveImageToFileSystem(image) : null;

        FarmerProfile farmer = farmerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Farmer profile not found for user ID: " + userId));

        Livestock livestock = convertDtoToEntity(dto);
        livestock.setFarmer(farmer);
        if (imagePath != null) {
            livestock.setImages("[\"" + imagePath + "\"]"); // Store as JSON array string
        }
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

    // ✅ Update livestock by email
    public Livestock updateLivestockByEmail(Long id, LivestockDto dto, String email) {
        Livestock livestock = getLivestockByIdAndEmail(id, email);
        updateEntityFromDto(livestock, dto);
        return repository.save(livestock);
    }

    // ✅ Delete livestock by email
    public void deleteLivestockByEmail(Long id, String email) {
        Livestock livestock = getLivestockByIdAndEmail(id, email);
        repository.delete(livestock);
    }

    // ✅ Get livestock by ID & email
    public Livestock getLivestockByIdAndEmail(Long id, String email) {
        return repository.findByIdAndFarmer_User_Email(id.intValue(), email)
                .orElseThrow(() -> new RuntimeException("Livestock not found with id: " + id));
    }

    // ✅ Get all livestock by email (paginated)
    public List<Livestock> getFarmerLivestockByEmail(String email, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findByFarmer_User_Email(email, pageable).getContent();
    }

    // ✅ Search livestock by email
    public List<Livestock> searchLivestockByEmail(String query, String email, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findByFarmer_User_EmailAndNameContainingIgnoreCase(email, query, pageable).getContent();
    }

    // ✅ Filter livestock by email
    public List<Livestock> filterLivestockByEmail(String type, String breed, String status, String email, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findByFilters(type, breed, status, email, pageable).getContent();
    }

    // ✅ Add health record by email
    public void addHealthRecordByEmail(Long id, String healthRecord, String email) {
        Livestock livestock = getLivestockByIdAndEmail(id, email);
        String notes = Optional.ofNullable(livestock.getNotes()).orElse("");
        notes += notes.isEmpty() ? "Health Record: " + healthRecord : "\nHealth Record: " + healthRecord;
        livestock.setNotes(notes);
        repository.save(livestock);
    }

    // ✅ Convert DTO -> Entity
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

    // ✅ Update entity from DTO
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

package com.farmtech.livestock.repository;

import com.farmtech.livestock.model.LivestockBreed;
import com.farmtech.livestock.model.LivestockCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LivestockBreedRepository extends JpaRepository<LivestockBreed, Integer> {

    // Find all active breeds
    List<LivestockBreed> findByIsActiveTrue();

    // Find all active breeds with pagination
    Page<LivestockBreed> findByIsActiveTrue(Pageable pageable);

    // Find breeds by category
    List<LivestockBreed> findByCategory(LivestockCategory category);

    // Find active breeds by category
    List<LivestockBreed> findByCategoryAndIsActiveTrue(LivestockCategory category);

    // Find active breeds by category with pagination
    Page<LivestockBreed> findByCategoryAndIsActiveTrue(LivestockCategory category, Pageable pageable);

    // Find breeds by category ID
    List<LivestockBreed> findByCategory_CategoryId(Integer categoryId);

    // Find active breeds by category ID
    List<LivestockBreed> findByCategory_CategoryIdAndIsActiveTrue(Integer categoryId);

    // Find breed by name (case-insensitive)
    Optional<LivestockBreed> findByNameIgnoreCase(String name);

    // Find active breed by name (case-insensitive)
    Optional<LivestockBreed> findByNameIgnoreCaseAndIsActiveTrue(String name);

    // Search breeds by name containing (case-insensitive)
    List<LivestockBreed> findByNameContainingIgnoreCase(String name);

    // Search active breeds by name containing (case-insensitive)
    List<LivestockBreed> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);

    // Search breeds by name or description containing (case-insensitive)
    @Query("SELECT b FROM LivestockBreed b WHERE " +
            "(LOWER(b.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(b.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
            "b.isActive = true")
    List<LivestockBreed> searchActiveBreeds(@Param("searchTerm") String searchTerm);

    // Search breeds by name or description containing with pagination
    @Query("SELECT b FROM LivestockBreed b WHERE " +
            "(LOWER(b.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(b.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
            "b.isActive = true")
    Page<LivestockBreed> searchActiveBreeds(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Find breeds by category and search term
    @Query("SELECT b FROM LivestockBreed b WHERE " +
            "b.category.categoryId = :categoryId AND " +
            "(LOWER(b.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(b.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
            "b.isActive = true")
    List<LivestockBreed> searchActiveBreedsInCategory(@Param("categoryId") Integer categoryId,
                                                      @Param("searchTerm") String searchTerm);

    // Find breeds by primary purpose
    List<LivestockBreed> findByPrimaryPurposeAndIsActiveTrue(String primaryPurpose);

    // Find breeds by origin country
    List<LivestockBreed> findByOriginCountryIgnoreCaseAndIsActiveTrue(String originCountry);

    // Count breeds by category
    long countByCategory_CategoryId(Integer categoryId);

    // Count active breeds by category
    long countByCategory_CategoryIdAndIsActiveTrue(Integer categoryId);

    // Check if breed name exists (for validation)
    boolean existsByNameIgnoreCase(String name);

    // Check if active breed name exists (for validation)
    boolean existsByNameIgnoreCaseAndIsActiveTrue(String name);

    // Custom query to find breeds with livestock count
    @Query("SELECT b, COUNT(l) FROM LivestockBreed b LEFT JOIN b.livestock l " +
            "WHERE b.isActive = true GROUP BY b ORDER BY b.name")
    List<Object[]> findActiveBreedsWithLivestockCount();
}
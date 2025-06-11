package com.farmtech.livestock.repository;

import com.farmtech.livestock.model.Livestock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LivestockRepository extends JpaRepository<Livestock, Integer> {

    // Basic method to find livestock by farmer's username (without pagination)
    List<Livestock> findByFarmer_User_Username(String username);

    // Basic method to find livestock by farmer's username with pagination
    Page<Livestock> findByFarmer_User_Username(String username, Pageable pageable);

    // Search functionality - search by name
    Page<Livestock> findByFarmer_User_UsernameAndNameContainingIgnoreCase(String username, String query, Pageable pageable);

    // Method to find a single livestock by ID and verify ownership
    @Query("SELECT l FROM Livestock l WHERE l.livestockId = :id AND l.farmer.user.username = :username")
    Optional<Livestock> findByIdAndFarmer_User_Username(@Param("id") Integer id, @Param("username") String username);

    // Filtering functionality - updated to match actual entity structure
    @Query("SELECT l FROM Livestock l WHERE l.farmer.user.username = :username " +
            "AND (:categoryName IS NULL OR l.category.name = :categoryName) " +
            "AND (:breedName IS NULL OR l.breed.name = :breedName) " +
            "AND (:status IS NULL OR l.healthStatus = :status)")
    Page<Livestock> findByFilters(@Param("categoryName") String categoryName,
                                  @Param("breedName") String breedName,
                                  @Param("status") String status,
                                  @Param("username") String username,
                                  Pageable pageable);

    // Additional useful methods

    // Find by tag number (unique identifier)
    @Query("SELECT l FROM Livestock l WHERE l.tagNumber = :tagNumber AND l.farmer.user.username = :username")
    Optional<Livestock> findByTagNumberAndFarmer_User_Username(@Param("tagNumber") String tagNumber, @Param("username") String username);

    // Find by health status
    Page<Livestock> findByFarmer_User_UsernameAndHealthStatus(String username, Livestock.HealthStatus healthStatus, Pageable pageable);

    // Find by category
    @Query("SELECT l FROM Livestock l WHERE l.farmer.user.username = :username AND l.category.name = :categoryName")
    Page<Livestock> findByFarmer_User_UsernameAndCategory_Name(@Param("username") String username, @Param("categoryName") String categoryName, Pageable pageable);

    // Find by breed
    @Query("SELECT l FROM Livestock l WHERE l.farmer.user.username = :username AND l.breed.name = :breedName")
    Page<Livestock> findByFarmer_User_UsernameAndBreed_Name(@Param("username") String username, @Param("breedName") String breedName, Pageable pageable);

    // Count livestock by farmer
    long countByFarmer_User_Username(String username);

    // Find livestock for sale
    @Query("SELECT l FROM Livestock l WHERE l.farmer.user.username = :username AND l.isForSale = true")
    Page<Livestock> findByFarmer_User_UsernameAndIsForSale(@Param("username") String username, Pageable pageable);
}
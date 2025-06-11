package com.farmtech.livestock.repository;

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
public interface LivestockCategoryRepository extends JpaRepository<LivestockCategory, Integer> {

    // Find all active categories
    List<LivestockCategory> findByIsActiveTrue();

    // Find all active categories with pagination
    Page<LivestockCategory> findByIsActiveTrue(Pageable pageable);

    // Find all categories ordered by sort order
    List<LivestockCategory> findByIsActiveTrueOrderBySortOrderAsc();

    // Find category by name (case-insensitive)
    Optional<LivestockCategory> findByNameIgnoreCase(String name);

    // Find active category by name (case-insensitive)
    Optional<LivestockCategory> findByNameIgnoreCaseAndIsActiveTrue(String name);

    // Search categories by name containing (case-insensitive)
    List<LivestockCategory> findByNameContainingIgnoreCase(String name);

    // Search active categories by name containing (case-insensitive)
    List<LivestockCategory> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);

    // Search categories by name or description containing (case-insensitive)
    @Query("SELECT c FROM LivestockCategory c WHERE " +
            "(LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(c.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
            "c.isActive = true ORDER BY c.sortOrder ASC")
    List<LivestockCategory> searchActiveCategories(@Param("searchTerm") String searchTerm);

    // Search categories by name or description containing with pagination
    @Query("SELECT c FROM LivestockCategory c WHERE " +
            "(LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(c.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
            "c.isActive = true ORDER BY c.sortOrder ASC")
    Page<LivestockCategory> searchActiveCategories(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Check if category name exists (for validation)
    boolean existsByNameIgnoreCase(String name);

    // Check if active category name exists (for validation)
    boolean existsByNameIgnoreCaseAndIsActiveTrue(String name);

    // Find categories with their breed count
    @Query("SELECT c, COUNT(b) FROM LivestockCategory c LEFT JOIN c.breeds b " +
            "WHERE c.isActive = true AND (b.isActive = true OR b.isActive IS NULL) " +
            "GROUP BY c ORDER BY c.sortOrder ASC")
    List<Object[]> findActiveCategoriesWithBreedCount();

    // Find categories with their livestock count
    @Query("SELECT c, COUNT(l) FROM LivestockCategory c LEFT JOIN c.livestock l " +
            "WHERE c.isActive = true GROUP BY c ORDER BY c.sortOrder ASC")
    List<Object[]> findActiveCategoriesWithLivestockCount();

    // Find categories with both breed and livestock counts
    @Query("SELECT c, COUNT(DISTINCT b), COUNT(DISTINCT l) FROM LivestockCategory c " +
            "LEFT JOIN c.breeds b ON b.isActive = true " +
            "LEFT JOIN c.livestock l " +
            "WHERE c.isActive = true " +
            "GROUP BY c ORDER BY c.sortOrder ASC")
    List<Object[]> findActiveCategoriesWithCounts();

    // Count active categories
    long countByIsActiveTrue();

    // Find the maximum sort order (for adding new categories)
    @Query("SELECT MAX(c.sortOrder) FROM LivestockCategory c WHERE c.isActive = true")
    Integer findMaxSortOrder();

    // Find categories that have livestock
    @Query("SELECT DISTINCT c FROM LivestockCategory c JOIN c.livestock l WHERE c.isActive = true")
    List<LivestockCategory> findCategoriesWithLivestock();

    // Find categories that have breeds
    @Query("SELECT DISTINCT c FROM LivestockCategory c JOIN c.breeds b WHERE c.isActive = true AND b.isActive = true")
    List<LivestockCategory> findCategoriesWithActiveBreeds();

    // Find popular categories (with most livestock)
    @Query("SELECT c FROM LivestockCategory c LEFT JOIN c.livestock l " +
            "WHERE c.isActive = true " +
            "GROUP BY c " +
            "ORDER BY COUNT(l) DESC")
    List<LivestockCategory> findPopularCategories(Pageable pageable);
}
package com.farmtech.livestock.repository;

import com.farmtech.livestock.model.LivestockCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LivestockCategoryRepository extends JpaRepository<LivestockCategory, Integer> {
    Optional<LivestockCategory> findByName(String name); // ✅ Add this line
}

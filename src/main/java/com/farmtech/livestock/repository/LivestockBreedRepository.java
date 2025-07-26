package com.farmtech.livestock.repository;

import com.farmtech.livestock.model.LivestockBreed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LivestockBreedRepository extends JpaRepository<LivestockBreed, Integer> {
    Optional<LivestockBreed> findByNameIgnoreCase(String name);
}

package com.farmtech.livestock.repository;

import com.farmtech.livestock.model.FarmerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FarmerProfileRepository extends JpaRepository<FarmerProfile, Integer> {

    Optional<FarmerProfile> findByUserId(Long userId);

}

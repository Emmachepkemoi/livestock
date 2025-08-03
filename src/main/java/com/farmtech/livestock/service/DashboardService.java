package com.farmtech.livestock.service;

import com.farmtech.livestock.model.UserRole.RoleName;
import com.farmtech.livestock.repository.LivestockBreedRepository;
import com.farmtech.livestock.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final LivestockBreedRepository livestockBreedRepository;

    @Autowired
    public DashboardService(UserRepository userRepository,
                            LivestockBreedRepository livestockBreedRepository) {
        this.userRepository = userRepository;
        this.livestockBreedRepository = livestockBreedRepository;
    }

    public Map<String, Long> getDashboardStats() {
        long totalFarmers = userRepository.countByRoleName(RoleName.FARMER);
        long totalVets = userRepository.countByRoleName(RoleName.VETERINARIAN);
        long totalBreeds = livestockBreedRepository.count();

        Map<String, Long> stats = new HashMap<>();
        stats.put("totalFarmers", totalFarmers);
        stats.put("totalVets", totalVets);
        stats.put("totalBreeds", totalBreeds);

        return stats;
    }
}

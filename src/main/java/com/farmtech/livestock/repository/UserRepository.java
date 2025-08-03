package com.farmtech.livestock.repository;

import com.farmtech.livestock.model.User;
import com.farmtech.livestock.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.active = true AND u.username = :username")
    Optional<User> findActiveByUsername(@Param("username") String username);

    Optional<User> findByUsernameAndActive(String username, boolean active);

    Optional<User> findByEmailAndActive(String email, boolean active);

    // ✅ New Queries for Role

    // Get all active users with a specific role name (e.g., FARMER)
    @Query("SELECT u FROM User u WHERE u.role.roleName = :roleName AND u.active = true")
    List<User> findAllByRoleName(@Param("roleName") UserRole.RoleName roleName);

    // Get user by username and role
    @Query("SELECT u FROM User u WHERE u.username = :username AND u.role.roleName = :roleName AND u.active = true")
    Optional<User> findByUsernameAndRole(@Param("username") String username, @Param("roleName") UserRole.RoleName roleName);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role.roleName = :roleName AND u.active = true")
    long countByRoleName(@Param("roleName") UserRole.RoleName roleName);
}

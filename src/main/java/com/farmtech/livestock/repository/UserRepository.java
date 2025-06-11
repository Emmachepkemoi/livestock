package com.farmtech.livestock.repository;

import com.farmtech.livestock.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by username
     */
    Optional<User> findByUsername(String username);

    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if username exists
     */
    boolean existsByUsername(String username);

    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);

    /**
     * Find active users only (for soft delete)
     */
    @Query("SELECT u FROM User u WHERE u.active = true AND u.username = :username")
    Optional<User> findActiveByUsername(@Param("username") String username);

    /**
     * Find user by username and active status
     */
    Optional<User> findByUsernameAndActive(String username, boolean active);

    /**
     * Find user by email and active status
     */
    Optional<User> findByEmailAndActive(String email, boolean active);
}
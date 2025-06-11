package com.farmtech.livestock.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "livestock_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LivestockCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;

    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon", length = 100)
    private String icon; // Icon name or path for UI

    @Column(name = "color", length = 7)
    private String color; // Hex color code for UI

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // One-to-many relationship with LivestockBreed
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<LivestockBreed> breeds;

    // One-to-many relationship with Livestock
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Livestock> livestock;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Convenience constructor
    public LivestockCategory(String name) {
        this.name = name;
        this.isActive = true;
    }

    // Convenience constructor with description
    public LivestockCategory(String name, String description) {
        this.name = name;
        this.description = description;
        this.isActive = true;
    }

    // Convenience constructor with all display properties
    public LivestockCategory(String name, String description, String icon, String color) {
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.color = color;
        this.isActive = true;
    }
}
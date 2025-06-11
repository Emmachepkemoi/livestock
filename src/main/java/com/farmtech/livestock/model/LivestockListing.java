package com.farmtech.livestock.model;

// src/main/java/com/livestock/model/LivestockListing.java


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "livestock_listings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LivestockListing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "listing_id")
    private Integer listingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "livestock_id", nullable = false)
    private Livestock livestock;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private FarmerProfile farmer;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "asking_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal askingPrice;

    @Column(name = "minimum_price", precision = 10, scale = 2)
    private BigDecimal minimumPrice;

    @Column(name = "negotiable")
    private Boolean negotiable = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "listing_status")
    private ListingStatus listingStatus = ListingStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "listing_type")
    private ListingType listingType = ListingType.SALE;

    @Column(name = "auction_end_date")
    private LocalDateTime auctionEndDate;

    @Column(name = "featured")
    private Boolean featured = false;

    @Column(name = "view_count")
    private Integer viewCount = 0;

    @Column(name = "contact_count")
    private Integer contactCount = 0;

    @Column(name = "images", columnDefinition = "JSON")
    private String images;

    @Column(name = "video_url", length = 500)
    private String videoUrl;

    @Column(name = "location_visible")
    private Boolean locationVisible = true;

    @Column(name = "delivery_available")
    private Boolean deliveryAvailable = false;

    @Column(name = "delivery_cost", precision = 8, scale = 2)
    private BigDecimal deliveryCost;

    @Column(name = "certification_documents", columnDefinition = "JSON")
    private String certificationDocuments;

    @Column(name = "health_certificate_url", length = 500)
    private String healthCertificateUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (expiresAt == null) {
            expiresAt = createdAt.plusDays(30);
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ListingStatus {
        ACTIVE, SOLD, WITHDRAWN, EXPIRED
    }

    public enum ListingType {
        SALE, AUCTION
    }
}

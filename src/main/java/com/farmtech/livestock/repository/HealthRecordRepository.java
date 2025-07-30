package com.farmtech.livestock.repository;

import com.farmtech.livestock.model.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, Integer> {

    // Find all health records for a specific livestock
    List<HealthRecord> findByLivestock_LivestockId(Integer livestockId);

    // Find health records by livestock and status
    List<HealthRecord> findByLivestock_LivestockIdAndStatus(Integer livestockId, HealthRecord.RecordStatus status);

    // Find health records after a specific date
    List<HealthRecord> findByExaminationDateAfter(LocalDate date);

    // Find health records between dates
    List<HealthRecord> findByExaminationDateBetween(LocalDate startDate, LocalDate endDate);

    // Find health records by examination type
    List<HealthRecord> findByExaminationType(HealthRecord.ExaminationType examinationType);

    // Find health records requiring follow-up
    List<HealthRecord> findByFollowUpRequiredTrue();

    // Find health records by status
    List<HealthRecord> findByStatus(HealthRecord.RecordStatus status);

    // Custom query to find health records with high consultation fees
    @Query("SELECT hr FROM HealthRecord hr WHERE hr.consultationFee > :amount")
    List<HealthRecord> findByConsultationFeeGreaterThan(@Param("amount") Double amount);

    // Custom query to find recent health records for a livestock
    @Query("SELECT hr FROM HealthRecord hr WHERE hr.livestock.livestockId = :livestockId AND hr.examinationDate >= :date ORDER BY hr.examinationDate DESC")
    List<HealthRecord> findRecentRecordsByLivestock(@Param("livestockId") Integer livestockId, @Param("date") LocalDate date);

    // Count health records by livestock
    long countByLivestock_LivestockId(Integer livestockId);

    // Find the latest health record for a livestock
    @Query("SELECT hr FROM HealthRecord hr WHERE hr.livestock.livestockId = :livestockId ORDER BY hr.examinationDate DESC LIMIT 1")
    HealthRecord findLatestByLivestock(@Param("livestockId") Integer livestockId);

    // Custom query to get health records with pagination and sorting
    @Query("SELECT hr FROM HealthRecord hr WHERE " +
            "(:livestockId IS NULL OR hr.livestock.livestockId = :livestockId) AND " +
            "(:status IS NULL OR hr.status = :status) AND " +
            "(:startDate IS NULL OR hr.examinationDate >= :startDate) AND " +
            "(:endDate IS NULL OR hr.examinationDate <= :endDate)")
    List<HealthRecord> findHealthRecordsWithFilters(
            @Param("livestockId") Integer livestockId,
            @Param("status") HealthRecord.RecordStatus status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
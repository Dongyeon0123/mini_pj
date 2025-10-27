package com.ureca.web.repository;

import com.ureca.web.entity.WatchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WatchHistoryRepository extends JpaRepository<WatchHistory, Long> {

    // 사용자와 콘텐츠로 시청 기록 찾기
    Optional<WatchHistory> findByUserIdAndContentId(Long userId, Long contentId);

    // 사용자의 시청 기록 목록 조회 (최신순, Content 정보 포함)
    @Query("SELECT w FROM WatchHistory w JOIN FETCH w.content WHERE w.user.id = :userId ORDER BY w.lastWatchedAt DESC")
    List<WatchHistory> findByUserIdWithContent(@Param("userId") Long userId);

    // 사용자의 시청 중인 콘텐츠 (완료되지 않은 것만)
    @Query("SELECT w FROM WatchHistory w JOIN FETCH w.content WHERE w.user.id = :userId AND w.completed = false ORDER BY w.lastWatchedAt DESC")
    List<WatchHistory> findContinueWatchingByUserId(@Param("userId") Long userId);

    // 콘텐츠의 시청 기록 수
    long countByContentId(Long contentId);

    // 사용자의 시청 기록 존재 여부
    boolean existsByUserIdAndContentId(Long userId, Long contentId);

    // ==================== 관리자용 통계 메서드 (추가) ====================
    
    // 사용자의 총 시청 기록 수
    Long countByUserId(Long userId);
    
    // 특정 날짜 이후에 시청한 고유 사용자 수
    @Query("SELECT COUNT(DISTINCT w.user.id) FROM WatchHistory w WHERE w.lastWatchedAt >= :date")
    Long countDistinctUsersByLastWatchedAtAfter(@Param("date") LocalDateTime date);
    
    // 특정 기간 동안 시청한 고유 사용자 수
    @Query("SELECT COUNT(DISTINCT w.user.id) FROM WatchHistory w WHERE w.lastWatchedAt BETWEEN :start AND :end")
    Long countDistinctUsersByLastWatchedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    // 특정 기간 동안의 총 시청 횟수
    Long countByLastWatchedAtBetween(LocalDateTime start, LocalDateTime end);
}
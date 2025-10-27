package com.ureca.web.repository;

import com.ureca.web.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    // 사용자 ID와 콘텐츠 ID로 찜하기 찾기
    Optional<Favorite> findByUserIdAndContentId(Long userId, Long contentId);

    // 사용자 ID와 콘텐츠 ID로 찜하기 존재 여부 확인
    boolean existsByUserIdAndContentId(Long userId, Long contentId);

    // 사용자의 모든 찜하기 조회 (최신순)
    List<Favorite> findByUserIdOrderByCreatedAtDesc(Long userId);

    // 사용자의 모든 찜하기 조회 (Content 정보 포함)
    @Query("SELECT f FROM Favorite f JOIN FETCH f.content WHERE f.user.id = :userId ORDER BY f.createdAt DESC")
    List<Favorite> findByUserIdWithContent(@Param("userId") Long userId);

    // 콘텐츠의 찜하기 수 조회
    long countByContentId(Long contentId);

    // 사용자의 찜하기 수 조회
    long countByUserId(Long userId);

    // 특정 콘텐츠를 찜한 모든 사용자 조회
    List<Favorite> findByContentId(Long contentId);
}
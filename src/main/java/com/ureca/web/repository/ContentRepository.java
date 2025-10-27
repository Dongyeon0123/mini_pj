package com.ureca.web.repository;

import com.ureca.web.entity.Content;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {
    
    // 콘텐츠 타입으로 조회
    Page<Content> findByContentType(Content.ContentType contentType, Pageable pageable);
    
    // 장르로 조회
    Page<Content> findByGenre(String genre, Pageable pageable);
    
    // 콘텐츠 타입과 장르로 조회
    Page<Content> findByContentTypeAndGenre(Content.ContentType contentType, String genre, Pageable pageable);
    
    // 제목으로 검색
    Page<Content> findByTitleContaining(String keyword, Pageable pageable);
    
    // 콘텐츠 타입과 제목으로 검색
    Page<Content> findByContentTypeAndTitleContaining(Content.ContentType contentType, String keyword, Pageable pageable);
    
    // 복합 검색 (제목 또는 설명에 키워드 포함)
    @Query("SELECT c FROM Content c WHERE " +
           "(:contentType IS NULL OR c.contentType = :contentType) AND " +
           "(:genre IS NULL OR c.genre = :genre) AND " +
           "(:keyword IS NULL OR c.title LIKE %:keyword% OR c.description LIKE %:keyword%)")
    Page<Content> searchContents(
            @Param("contentType") Content.ContentType contentType,
            @Param("genre") String genre,
            @Param("keyword") String keyword,
            Pageable pageable
    );
    
    // 인기 콘텐츠 (조회수 기준)
    List<Content> findTop10ByOrderByViewCountDesc();
    
    // 콘텐츠 타입별 인기 콘텐츠
    List<Content> findTop10ByContentTypeOrderByViewCountDesc(Content.ContentType contentType);
    
    // 최신 콘텐츠
    List<Content> findTop10ByOrderByCreatedAtDesc();
    
    // 콘텐츠 타입별 최신 콘텐츠
    List<Content> findTop10ByContentTypeOrderByCreatedAtDesc(Content.ContentType contentType);
    
    // 평점 높은 콘텐츠
    List<Content> findTop10ByOrderByRatingDesc();
}
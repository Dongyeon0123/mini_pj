package com.ureca.web.service;

import com.ureca.web.dto.ContentListResponse;
import com.ureca.web.dto.ContentResponse;
import com.ureca.web.entity.Content;
import com.ureca.web.repository.ContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContentService {
    
    private final ContentRepository contentRepository;
    
    // 콘텐츠 목록 조회 (필터링, 검색, 정렬, 페이징)
    public ContentListResponse getContents(
            Content.ContentType contentType,
            String genre,
            String keyword,
            String sortBy,
            int page,
            int size
    ) {
        Sort sort = getSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Content> contentPage;
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            // 검색
            if (contentType != null) {
                contentPage = contentRepository.findByContentTypeAndTitleContaining(
                        contentType, keyword, pageable
                );
            } else {
                contentPage = contentRepository.findByTitleContaining(keyword, pageable);
            }
        } else if (genre != null && !genre.equals("전체")) {
            // 장르 필터링
            if (contentType != null) {
                contentPage = contentRepository.findByContentTypeAndGenre(
                        contentType, genre, pageable
                );
            } else {
                contentPage = contentRepository.findByGenre(genre, pageable);
            }
        } else if (contentType != null) {
            // 콘텐츠 타입 필터링
            contentPage = contentRepository.findByContentType(contentType, pageable);
        } else {
            // 전체 조회
            contentPage = contentRepository.findAll(pageable);
        }
        
        List<ContentResponse> contents = contentPage.getContent().stream()
                .map(ContentResponse::fromEntity)  // ✅ from -> fromEntity
                .collect(Collectors.toList());
        
        ContentListResponse.PageInfo pageInfo = ContentListResponse.PageInfo.builder()
                .page(contentPage.getNumber())
                .size(contentPage.getSize())
                .totalElements(contentPage.getTotalElements())
                .totalPages(contentPage.getTotalPages())
                .build();
        
        return ContentListResponse.builder()
                .contents(contents)
                .pageInfo(pageInfo)
                .build();
    }
    
    // 콘텐츠 상세 조회
    @Transactional
    public ContentResponse getContentById(Long id) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("콘텐츠를 찾을 수 없습니다. ID: " + id));
        
        // 조회수 증가
        content.setViewCount(content.getViewCount() + 1);
        
        return ContentResponse.fromEntity(content);  // ✅ from -> fromEntity
    }
    
    // 추천 콘텐츠 조회 (평점 높은 순)
    public List<ContentResponse> getRecommendedContents(int limit) {
        List<Content> contents = contentRepository.findTop10ByOrderByRatingDesc();
        
        return contents.stream()
                .limit(limit)
                .map(ContentResponse::fromEntity)  // ✅ from -> fromEntity
                .collect(Collectors.toList());
    }
    
    // 인기 콘텐츠 조회
    public List<ContentResponse> getPopularContents(Content.ContentType contentType, int limit) {
        List<Content> contents;
        
        if (contentType != null) {
            contents = contentRepository.findTop10ByContentTypeOrderByViewCountDesc(contentType);
        } else {
            contents = contentRepository.findTop10ByOrderByViewCountDesc();
        }
        
        return contents.stream()
                .limit(limit)
                .map(ContentResponse::fromEntity)  // ✅ from -> fromEntity
                .collect(Collectors.toList());
    }
    
    // 최신 콘텐츠 조회
    public List<ContentResponse> getLatestContents(Content.ContentType contentType, int limit) {
        List<Content> contents;
        
        if (contentType != null) {
            contents = contentRepository.findTop10ByContentTypeOrderByCreatedAtDesc(contentType);
        } else {
            contents = contentRepository.findTop10ByOrderByCreatedAtDesc();
        }
        
        return contents.stream()
                .limit(limit)
                .map(ContentResponse::fromEntity)  // ✅ from -> fromEntity
                .collect(Collectors.toList());
    }
    
    // 장르별 콘텐츠 조회
    public ContentListResponse getContentsByGenre(String genre, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Content> contentPage = contentRepository.findByGenre(genre, pageable);
        
        List<ContentResponse> contents = contentPage.getContent().stream()
                .map(ContentResponse::fromEntity)  // ✅ from -> fromEntity
                .collect(Collectors.toList());
        
        ContentListResponse.PageInfo pageInfo = ContentListResponse.PageInfo.builder()
                .page(contentPage.getNumber())
                .size(contentPage.getSize())
                .totalElements(contentPage.getTotalElements())
                .totalPages(contentPage.getTotalPages())
                .build();
        
        return ContentListResponse.builder()
                .contents(contents)
                .pageInfo(pageInfo)
                .build();
    }
    
    // 정렬 옵션 변환
    private Sort getSort(String sortBy) {
        if (sortBy == null) {
            return Sort.by("createdAt").descending();
        }
        
        return switch (sortBy) {
            case "rating" -> Sort.by("rating").descending();
            case "popular" -> Sort.by("viewCount").descending();
            case "title" -> Sort.by("title").ascending();
            default -> Sort.by("createdAt").descending();
        };
    }
}
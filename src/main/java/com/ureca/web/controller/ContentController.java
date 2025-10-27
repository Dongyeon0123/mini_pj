package com.ureca.web.controller;

import com.ureca.web.dto.ApiResponse;
import com.ureca.web.dto.ContentListResponse;
import com.ureca.web.dto.ContentResponse;
import com.ureca.web.entity.Content;
import com.ureca.web.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contents")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ContentController {
    
    private final ContentService contentService;
    
    /**
     * 콘텐츠 목록 조회 (필터링, 검색, 정렬, 페이징)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<ContentListResponse>> getContents(
            @RequestParam(required = false) Content.ContentType contentType,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "latest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        ContentListResponse response = contentService.getContents(
                contentType, genre, keyword, sortBy, page, size
        );
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * 콘텐츠 상세 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContentResponse>> getContentById(@PathVariable Long id) {
        ContentResponse response = contentService.getContentById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * 추천 콘텐츠 조회
     */
    @GetMapping("/recommended")
    public ResponseEntity<ApiResponse<List<ContentResponse>>> getRecommendedContents(
            @RequestParam(defaultValue = "10") int limit
    ) {
        List<ContentResponse> response = contentService.getRecommendedContents(limit);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * 인기 콘텐츠 조회
     */
    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<ContentResponse>>> getPopularContents(
            @RequestParam(required = false) Content.ContentType contentType,
            @RequestParam(defaultValue = "10") int limit
    ) {
        List<ContentResponse> response = contentService.getPopularContents(contentType, limit);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * 최신 콘텐츠 조회
     */
    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<List<ContentResponse>>> getLatestContents(
            @RequestParam(required = false) Content.ContentType contentType,
            @RequestParam(defaultValue = "10") int limit
    ) {
        List<ContentResponse> response = contentService.getLatestContents(contentType, limit);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * 장르별 콘텐츠 조회
     */
    @GetMapping("/genre/{genre}")
    public ResponseEntity<ApiResponse<ContentListResponse>> getContentsByGenre(
            @PathVariable String genre,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        ContentListResponse response = contentService.getContentsByGenre(genre, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * 콘텐츠 검색
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<ContentListResponse>> searchContents(
            @RequestParam String keyword,
            @RequestParam(required = false) Content.ContentType contentType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        ContentListResponse response = contentService.getContents(
                contentType, null, keyword, "latest", page, size
        );
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
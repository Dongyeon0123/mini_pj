package com.ureca.web.controller;

import com.ureca.web.dto.ApiResponse;
import com.ureca.web.dto.FavoriteResponse;
import com.ureca.web.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class FavoriteController {

    private final FavoriteService favoriteService;

    /**
     * 찜하기 추가
     * POST /api/favorites
     */
    @PostMapping
    public ResponseEntity<ApiResponse<FavoriteResponse>> addFavorite(
            @RequestParam Long userId,
            @RequestParam Long contentId) {
        
        log.info("📌 찜하기 추가 API 호출 - userId: {}, contentId: {}", userId, contentId);
        
        ApiResponse<FavoriteResponse> response = favoriteService.addFavorite(userId, contentId);
        
        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 찜하기 제거
     * DELETE /api/favorites
     */
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            @RequestParam Long userId,
            @RequestParam Long contentId) {
        
        log.info("🗑️ 찜하기 제거 API 호출 - userId: {}, contentId: {}", userId, contentId);
        
        ApiResponse<Void> response = favoriteService.removeFavorite(userId, contentId);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * 사용자의 찜하기 목록 조회
     * GET /api/favorites/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getUserFavorites(
            @PathVariable Long userId) {
        
        log.info("📋 사용자 찜하기 목록 조회 API 호출 - userId: {}", userId);
        
        ApiResponse<List<FavoriteResponse>> response = favoriteService.getUserFavorites(userId);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * 찜하기 여부 확인
     * GET /api/favorites/check
     */
    @GetMapping("/check")
    public ResponseEntity<ApiResponse<Boolean>> checkFavorite(
            @RequestParam Long userId,
            @RequestParam Long contentId) {
        
        log.info("✅ 찜하기 여부 확인 API 호출 - userId: {}, contentId: {}", userId, contentId);
        
        ApiResponse<Boolean> response = favoriteService.checkFavorite(userId, contentId);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 콘텐츠의 찜하기 수 조회
     * GET /api/favorites/count/{contentId}
     */
    @GetMapping("/count/{contentId}")
    public ResponseEntity<ApiResponse<Long>> getFavoriteCount(
            @PathVariable Long contentId) {
        
        log.info("🔢 찜하기 수 조회 API 호출 - contentId: {}", contentId);
        
        ApiResponse<Long> response = favoriteService.getFavoriteCount(contentId);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * 찜하기 토글 (있으면 제거, 없으면 추가)
     * POST /api/favorites/toggle
     */
    @PostMapping("/toggle")
    public ResponseEntity<ApiResponse<?>> toggleFavorite(
            @RequestParam Long userId,
            @RequestParam Long contentId) {
        
        log.info("🔄 찜하기 토글 API 호출 - userId: {}, contentId: {}", userId, contentId);
        
        // 1. 찜하기 여부 확인
        ApiResponse<Boolean> checkResponse = favoriteService.checkFavorite(userId, contentId);
        
        if (!checkResponse.isSuccess()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("찜하기 상태 확인 중 오류가 발생했습니다."));
        }
        
        boolean isFavorite = checkResponse.getData();
        
        // 2. 찜하기 추가 또는 제거
        if (isFavorite) {
            // 이미 찜한 경우 -> 제거
            ApiResponse<Void> response = favoriteService.removeFavorite(userId, contentId);
            return ResponseEntity.ok(response);
        } else {
            // 찜하지 않은 경우 -> 추가
            ApiResponse<FavoriteResponse> response = favoriteService.addFavorite(userId, contentId);
            if (response.isSuccess()) {
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        }
    }

    /**
     * 특정 사용자의 찜하기 수 조회
     * GET /api/favorites/user/{userId}/count
     */
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<ApiResponse<Long>> getUserFavoriteCount(
            @PathVariable Long userId) {
        
        log.info("🔢 사용자 찜하기 수 조회 API 호출 - userId: {}", userId);
        
        try {
            ApiResponse<List<FavoriteResponse>> response = favoriteService.getUserFavorites(userId);
            
            if (response.isSuccess()) {
                long count = response.getData() != null ? response.getData().size() : 0L;
                return ResponseEntity.ok(ApiResponse.success("사용자의 찜하기 수를 조회했습니다.", count));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error(response.getMessage()));
            }
        } catch (Exception e) {
            log.error("사용자 찜하기 수 조회 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("찜하기 수 조회 중 오류가 발생했습니다."));
        }
    }
}
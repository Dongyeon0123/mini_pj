package com.ureca.web.controller;

import com.ureca.web.dto.ApiResponse;
import com.ureca.web.dto.SaveWatchHistoryRequest;
import com.ureca.web.dto.WatchHistoryResponse;
import com.ureca.web.service.WatchHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/watch-history")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class WatchHistoryController {

    private final WatchHistoryService watchHistoryService;

    /**
     * 시청 위치 저장/업데이트
     * POST /api/watch-history
     */
    @PostMapping
    public ResponseEntity<ApiResponse<WatchHistoryResponse>> saveWatchHistory(
            @RequestBody SaveWatchHistoryRequest request) {
        
        log.info("💾 시청 위치 저장 API 호출 - userId: {}, contentId: {}, position: {}초",
                request.getUserId(), request.getContentId(), request.getWatchPosition());
        
        ApiResponse<WatchHistoryResponse> response = watchHistoryService.saveWatchHistory(request);
        
        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 시청 위치 조회
     * GET /api/watch-history
     */
    @GetMapping
    public ResponseEntity<ApiResponse<WatchHistoryResponse>> getWatchHistory(
            @RequestParam Long userId,
            @RequestParam Long contentId) {
        
        log.info("🔍 시청 위치 조회 API 호출 - userId: {}, contentId: {}", userId, contentId);
        
        ApiResponse<WatchHistoryResponse> response = watchHistoryService.getWatchHistory(userId, contentId);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 사용자의 시청 기록 목록 조회
     * GET /api/watch-history/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<WatchHistoryResponse>>> getUserWatchHistory(
            @PathVariable Long userId) {
        
        log.info("📋 사용자 시청 기록 조회 API 호출 - userId: {}", userId);
        
        ApiResponse<List<WatchHistoryResponse>> response = watchHistoryService.getUserWatchHistory(userId);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * 이어보기 목록 조회 (시청 중인 콘텐츠만)
     * GET /api/watch-history/continue/{userId}
     */
    @GetMapping("/continue/{userId}")
    public ResponseEntity<ApiResponse<List<WatchHistoryResponse>>> getContinueWatching(
            @PathVariable Long userId) {
        
        log.info("▶️ 이어보기 목록 조회 API 호출 - userId: {}", userId);
        
        ApiResponse<List<WatchHistoryResponse>> response = watchHistoryService.getContinueWatching(userId);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * 시청 기록 삭제
     * DELETE /api/watch-history
     */
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteWatchHistory(
            @RequestParam Long userId,
            @RequestParam Long contentId) {
        
        log.info("🗑️ 시청 기록 삭제 API 호출 - userId: {}, contentId: {}", userId, contentId);
        
        ApiResponse<Void> response = watchHistoryService.deleteWatchHistory(userId, contentId);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * 시청 위치 빠른 저장 (간단한 버전)
     * PUT /api/watch-history/position
     */
    @PutMapping("/position")
    public ResponseEntity<ApiResponse<WatchHistoryResponse>> updateWatchPosition(
            @RequestParam Long userId,
            @RequestParam Long contentId,
            @RequestParam Integer position) {
        
        SaveWatchHistoryRequest request = SaveWatchHistoryRequest.builder()
                .userId(userId)
                .contentId(contentId)
                .watchPosition(position)
                .completed(false)
                .build();
        
        ApiResponse<WatchHistoryResponse> response = watchHistoryService.saveWatchHistory(request);
        
        return ResponseEntity.ok(response);
    }
}
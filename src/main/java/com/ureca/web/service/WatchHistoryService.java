package com.ureca.web.service;

import com.ureca.web.dto.ApiResponse;
import com.ureca.web.dto.SaveWatchHistoryRequest;
import com.ureca.web.dto.WatchHistoryResponse;
import com.ureca.web.entity.Content;
import com.ureca.web.entity.User;
import com.ureca.web.entity.WatchHistory;
import com.ureca.web.repository.ContentRepository;
import com.ureca.web.repository.UserRepository;
import com.ureca.web.repository.WatchHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WatchHistoryService {

    private final WatchHistoryRepository watchHistoryRepository;
    private final UserRepository userRepository;
    private final ContentRepository contentRepository;

    /**
     * 시청 위치 저장 또는 업데이트
     */
    @Transactional
    public ApiResponse<WatchHistoryResponse> saveWatchHistory(SaveWatchHistoryRequest request) {
        log.info("💾 시청 위치 저장 - userId: {}, contentId: {}, position: {}초",
                request.getUserId(), request.getContentId(), request.getWatchPosition());

        try {
            // 사용자 확인
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없음."));

            // 콘텐츠 확인
            Content content = contentRepository.findById(request.getContentId())
                    .orElseThrow(() -> new IllegalArgumentException("콘텐츠를 찾을 수 없음."));

            // 기존 시청 기록 확인
            WatchHistory history = watchHistoryRepository
                    .findByUserIdAndContentId(request.getUserId(), request.getContentId())
                    .orElse(null);

            if (history == null) {
                // 새로운 시청 기록 생성
                history = WatchHistory.builder()
                        .user(user)
                        .content(content)
                        .watchPosition(request.getWatchPosition())
                        .watchDuration(request.getWatchPosition())
                        .completed(request.getCompleted() != null ? request.getCompleted() : false)
                        .build();
                log.info("새로운 시청 기록 생성");
            } else {
                // 기존 시청 기록 업데이트
                history.setWatchPosition(request.getWatchPosition());
                history.setWatchDuration(Math.max(history.getWatchDuration(), request.getWatchPosition()));
                if (request.getCompleted() != null) {
                    history.setCompleted(request.getCompleted());
                }
                log.info("✏기존 시청 기록 업데이트");
            }

            WatchHistory savedHistory = watchHistoryRepository.save(history);

            // 콘텐츠 조회수 증가 (새로운 시청 기록인 경우만)
            if (history.getId() == null) {
                content.setViewCount(content.getViewCount() + 1);
                contentRepository.save(content);
            }

            WatchHistoryResponse response = WatchHistoryResponse.fromEntity(savedHistory);
            return ApiResponse.success("시청 위치가 저장되었습니다.", response);

        } catch (IllegalArgumentException e) {
            log.error("시청 위치 저장 실패 - {}", e.getMessage());
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            log.error("시청 위치 저장 중 오류 발생", e);
            return ApiResponse.error("시청 위치 저장 중 오류가 발생했습니다.");
        }
    }

    /**
     * 시청 위치 조회
     */
    @Transactional(readOnly = true)
    public ApiResponse<WatchHistoryResponse> getWatchHistory(Long userId, Long contentId) {
        log.info("시청 위치 조회 - userId: {}, contentId: {}", userId, contentId);

        try {
            WatchHistory history = watchHistoryRepository
                    .findByUserIdAndContentId(userId, contentId)
                    .orElse(null);

            if (history == null) {
                return ApiResponse.success("시청 기록이 없습니다.", null);
            }

            WatchHistoryResponse response = WatchHistoryResponse.fromEntity(history);
            log.info("✅ 시청 위치: {}초", response.getWatchPosition());
            return ApiResponse.success("시청 위치를 조회했습니다.", response);

        } catch (Exception e) {
            log.error("❌ 시청 위치 조회 중 오류 발생", e);
            return ApiResponse.error("시청 위치 조회 중 오류가 발생했습니다.");
        }
    }

    /**
     * 사용자의 시청 기록 목록 조회
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<WatchHistoryResponse>> getUserWatchHistory(Long userId) {
        log.info("📋 사용자 시청 기록 조회 - userId: {}", userId);

        try {
            if (!userRepository.existsById(userId)) {
                throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
            }

            List<WatchHistory> histories = watchHistoryRepository.findByUserIdWithContent(userId);

            List<WatchHistoryResponse> responses = histories.stream()
                    .map(WatchHistoryResponse::fromEntity)
                    .collect(Collectors.toList());

            log.info("✅ 시청 기록 {}개 조회 완료", responses.size());
            return ApiResponse.success("시청 기록을 조회했습니다.", responses);

        } catch (IllegalArgumentException e) {
            log.error("❌ 시청 기록 조회 실패 - {}", e.getMessage());
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            log.error("❌ 시청 기록 조회 중 오류 발생", e);
            return ApiResponse.error("시청 기록 조회 중 오류가 발생했습니다.");
        }
    }

    /**
     * 이어보기 목록 조회 (시청 중인 콘텐츠만)
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<WatchHistoryResponse>> getContinueWatching(Long userId) {
        log.info("▶️ 이어보기 목록 조회 - userId: {}", userId);

        try {
            if (!userRepository.existsById(userId)) {
                throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
            }

            List<WatchHistory> histories = watchHistoryRepository.findContinueWatchingByUserId(userId);

            List<WatchHistoryResponse> responses = histories.stream()
                    .map(WatchHistoryResponse::fromEntity)
                    .collect(Collectors.toList());

            log.info("✅ 이어보기 {}개 조회 완료", responses.size());
            return ApiResponse.success("이어보기 목록을 조회했습니다.", responses);

        } catch (IllegalArgumentException e) {
            log.error("❌ 이어보기 목록 조회 실패 - {}", e.getMessage());
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            log.error("❌ 이어보기 목록 조회 중 오류 발생", e);
            return ApiResponse.error("이어보기 목록 조회 중 오류가 발생했습니다.");
        }
    }

    /**
     * 시청 기록 삭제
     */
    @Transactional
    public ApiResponse<Void> deleteWatchHistory(Long userId, Long contentId) {
        log.info("🗑️ 시청 기록 삭제 - userId: {}, contentId: {}", userId, contentId);

        try {
            WatchHistory history = watchHistoryRepository
                    .findByUserIdAndContentId(userId, contentId)
                    .orElseThrow(() -> new IllegalArgumentException("시청 기록을 찾을 수 없습니다."));

            watchHistoryRepository.delete(history);
            log.info("✅ 시청 기록 삭제 완료");
            return ApiResponse.success("시청 기록이 삭제되었습니다.", null);

        } catch (IllegalArgumentException e) {
            log.error("❌ 시청 기록 삭제 실패 - {}", e.getMessage());
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            log.error("❌ 시청 기록 삭제 중 오류 발생", e);
            return ApiResponse.error("시청 기록 삭제 중 오류가 발생했습니다.");
        }
    }
}
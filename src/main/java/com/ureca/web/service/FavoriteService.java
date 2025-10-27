package com.ureca.web.service;

import com.ureca.web.dto.ApiResponse;
import com.ureca.web.dto.FavoriteResponse;
import com.ureca.web.entity.Content;
import com.ureca.web.entity.Favorite;
import com.ureca.web.entity.User;
import com.ureca.web.repository.ContentRepository;
import com.ureca.web.repository.FavoriteRepository;
import com.ureca.web.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ContentRepository contentRepository;
    private final UserRepository userRepository;

    /**
     * 찜하기 추가
     */
    @Transactional
    public ApiResponse<FavoriteResponse> addFavorite(Long userId, Long contentId) {
        log.info("찜하기 추가 요청 - userId: {}, contentId: {}", userId, contentId);
        
        try {
            // 1. 사용자 존재 확인
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. ID: " + userId));

            // 2. 콘텐츠 존재 확인
            Content content = contentRepository.findById(contentId)
                    .orElseThrow(() -> new IllegalArgumentException("콘텐츠를 찾을 수 없습니다. ID: " + contentId));

            // 3. 이미 찜하기 했는지 확인
            if (favoriteRepository.existsByUserIdAndContentId(userId, contentId)) {
                log.warn("이미 찜한 콘텐츠입니다 - userId: {}, contentId: {}", userId, contentId);
                return ApiResponse.error("이미 찜한 콘텐츠입니다.");
            }

            // 4. 찜하기 생성
            Favorite favorite = Favorite.builder()
                    .user(user)
                    .content(content)
                    .build();

            Favorite savedFavorite = favoriteRepository.save(favorite);

            // 5. 콘텐츠의 찜하기 수 증가
            Long currentLikeCount = content.getLikeCount() != null ? content.getLikeCount() : 0L;
            content.setLikeCount(currentLikeCount + 1);
            contentRepository.save(content);

            log.info("찜하기 추가 성공 - favoriteId: {}", savedFavorite.getId());
            
            FavoriteResponse response = FavoriteResponse.fromEntity(savedFavorite);
            return ApiResponse.success("찜하기가 추가되었습니다.", response);

        } catch (IllegalArgumentException e) {
            log.error("찜하기 추가 실패 - {}", e.getMessage());
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            log.error("찜하기 추가 중 예상치 못한 오류 발생", e);
            return ApiResponse.error("찜하기 추가 중 오류가 발생했습니다.");
        }
    }

    /**
     * 찜하기 제거
     */
    @Transactional
    public ApiResponse<Void> removeFavorite(Long userId, Long contentId) {
        log.info("찜하기 제거 요청 - userId: {}, contentId: {}", userId, contentId);
        
        try {
            // 1. 찜하기 찾기
            Favorite favorite = favoriteRepository.findByUserIdAndContentId(userId, contentId)
                    .orElseThrow(() -> new IllegalArgumentException("찜하기를 찾을 수 없습니다."));

            // 2. 찜하기 삭제
            favoriteRepository.delete(favorite);

            // 3. 콘텐츠의 찜하기 수 감소
            Content content = contentRepository.findById(contentId)
                    .orElseThrow(() -> new IllegalArgumentException("콘텐츠를 찾을 수 없습니다. ID: " + contentId));
            
            Long currentLikeCount = content.getLikeCount() != null ? content.getLikeCount() : 0L;
            if (currentLikeCount > 0) {
                content.setLikeCount(currentLikeCount - 1);
                contentRepository.save(content);
            }

            log.info("찜하기 제거 성공 - favoriteId: {}", favorite.getId());
            return ApiResponse.success("찜하기가 제거되었습니다.", null);

        } catch (IllegalArgumentException e) {
            log.error("찜하기 제거 실패 - {}", e.getMessage());
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            log.error("찜하기 제거 중 예상치 못한 오류 발생", e);
            return ApiResponse.error("찜하기 제거 중 오류가 발생했습니다.");
        }
    }

    /**
     * 사용자의 찜하기 목록 조회
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<FavoriteResponse>> getUserFavorites(Long userId) {
        log.info("찜하기 목록 조회 요청 - userId: {}", userId);
        
        try {
            // 1. 사용자 존재 확인
            if (!userRepository.existsById(userId)) {
                throw new IllegalArgumentException("사용자를 찾을 수 없습니다. ID: " + userId);
            }

            // 2. 찜하기 목록 조회 (Content 정보 포함)
            List<Favorite> favorites = favoriteRepository.findByUserIdWithContent(userId);
            
            // 3. DTO로 변환
            List<FavoriteResponse> responses = favorites.stream()
                    .map(FavoriteResponse::fromEntity)
                    .collect(Collectors.toList());

            log.info("찜하기 목록 조회 성공 - userId: {}, count: {}", userId, responses.size());
            return ApiResponse.success("찜하기 목록을 조회했습니다.", responses);

        } catch (IllegalArgumentException e) {
            log.error("찜하기 목록 조회 실패 - {}", e.getMessage());
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            log.error("찜하기 목록 조회 중 예상치 못한 오류 발생", e);
            return ApiResponse.error("찜하기 목록 조회 중 오류가 발생했습니다.");
        }
    }

    /**
     * 찜하기 여부 확인
     */
    @Transactional(readOnly = true)
    public ApiResponse<Boolean> checkFavorite(Long userId, Long contentId) {
        log.info("찜하기 여부 확인 - userId: {}, contentId: {}", userId, contentId);
        
        try {
            boolean isFavorite = favoriteRepository.existsByUserIdAndContentId(userId, contentId);
            log.info("찜하기 여부: {}", isFavorite);
            return ApiResponse.success("찜하기 여부를 확인했습니다.", isFavorite);

        } catch (Exception e) {
            log.error("찜하기 여부 확인 중 오류 발생", e);
            return ApiResponse.error("찜하기 여부 확인 중 오류가 발생했습니다.");
        }
    }

    /**
     * 콘텐츠의 찜하기 수 조회
     */
    @Transactional(readOnly = true)
    public ApiResponse<Long> getFavoriteCount(Long contentId) {
        log.info("찜하기 수 조회 - contentId: {}", contentId);
        
        try {
            // 1. 콘텐츠 존재 확인
            if (!contentRepository.existsById(contentId)) {
                throw new IllegalArgumentException("콘텐츠를 찾을 수 없습니다. ID: " + contentId);
            }

            // 2. 찜하기 수 조회
            Long count = favoriteRepository.countByContentId(contentId);
            log.info("찜하기 수: {}", count);
            return ApiResponse.success("찜하기 수를 조회했습니다.", count);

        } catch (IllegalArgumentException e) {
            log.error("찜하기 수 조회 실패 - {}", e.getMessage());
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            log.error("찜하기 수 조회 중 오류 발생", e);
            return ApiResponse.error("찜하기 수 조회 중 오류가 발생했습니다.");
        }
    }
}
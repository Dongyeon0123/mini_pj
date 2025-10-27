package com.ureca.web.service;

import com.ureca.web.dto.*;
import com.ureca.web.entity.Content;
import com.ureca.web.entity.User;
import com.ureca.web.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AdminService {

    private final UserRepository userRepository;
    private final ContentRepository contentRepository;
    private final WatchHistoryRepository watchHistoryRepository;
    private final FavoriteRepository favoriteRepository;

    // ==================== 통계 ====================
    
    @Transactional(readOnly = true)
    public AdminStatsResponse getAdminStats() {
        log.info("📊 관리자 통계 조회 시작");
        
        try {
            // 기본 통계
            Long totalUsers = userRepository.count();
            Long totalContents = contentRepository.count();
            Long totalViews = watchHistoryRepository.count();
            Long totalFavorites = favoriteRepository.count();
            
            // 오늘 활성 사용자 (오늘 시청 기록이 있는 사용자)
            LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
            Long activeUsersToday = watchHistoryRepository.countDistinctUsersByLastWatchedAtAfter(today);
            
            // 이번 달 신규 가입자
            LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            Long newUsersThisMonth = userRepository.countByCreatedAtAfter(startOfMonth);
            
            // 일별 통계 (최근 7일)
            List<AdminStatsResponse.DailyStats> dailyStats = generateDailyStats();
            
            // 월별 통계 (최근 6개월)
            List<AdminStatsResponse.MonthlyStats> monthlyStats = generateMonthlyStats();
            
            // 인기 콘텐츠 Top 10
            List<AdminStatsResponse.PopularContent> popularContents = getPopularContents();
            
            // 장르별 통계
            Map<String, Long> genreStats = getGenreStats();
            
            log.info("✅ 통계 조회 완료 - 총 사용자: {}, 총 콘텐츠: {}", totalUsers, totalContents);
            
            return AdminStatsResponse.builder()
                    .totalUsers(totalUsers)
                    .totalContents(totalContents)
                    .totalViews(totalViews)
                    .totalFavorites(totalFavorites)
                    .activeUsersToday(activeUsersToday != null ? activeUsersToday : 0L)
                    .newUsersThisMonth(newUsersThisMonth != null ? newUsersThisMonth : 0L)
                    .dailyStats(dailyStats)
                    .monthlyStats(monthlyStats)
                    .popularContents(popularContents)
                    .genreStats(genreStats)
                    .build();
                    
        } catch (Exception e) {
            log.error("❌ 통계 조회 실패: {}", e.getMessage(), e);
            throw new RuntimeException("통계 조회에 실패했습니다: " + e.getMessage());
        }
    }
    
    private List<AdminStatsResponse.DailyStats> generateDailyStats() {
        List<AdminStatsResponse.DailyStats> stats = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        try {
            for (int i = 6; i >= 0; i--) {
                LocalDate date = LocalDate.now().minusDays(i);
                LocalDateTime startOfDay = date.atStartOfDay();
                LocalDateTime endOfDay = date.atTime(23, 59, 59);
                
                Long newUsers = userRepository.countByCreatedAtBetween(startOfDay, endOfDay);
                Long activeUsers = watchHistoryRepository.countDistinctUsersByLastWatchedAtBetween(startOfDay, endOfDay);
                Long views = watchHistoryRepository.countByLastWatchedAtBetween(startOfDay, endOfDay);
                
                stats.add(AdminStatsResponse.DailyStats.builder()
                        .date(date.format(formatter))
                        .newUsers(newUsers != null ? newUsers : 0L)
                        .activeUsers(activeUsers != null ? activeUsers : 0L)
                        .totalViews(views != null ? views : 0L)
                        .build());
            }
        } catch (Exception e) {
            log.error("❌ 일별 통계 생성 실패: {}", e.getMessage());
        }
        
        return stats;
    }
    
    private List<AdminStatsResponse.MonthlyStats> generateMonthlyStats() {
        List<AdminStatsResponse.MonthlyStats> stats = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        
        try {
            for (int i = 5; i >= 0; i--) {
                LocalDate monthStart = LocalDate.now().minusMonths(i).withDayOfMonth(1);
                LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);
                LocalDateTime startOfMonth = monthStart.atStartOfDay();
                LocalDateTime endOfMonth = monthEnd.atTime(23, 59, 59);
                
                Long newUsers = userRepository.countByCreatedAtBetween(startOfMonth, endOfMonth);
                Long views = watchHistoryRepository.countByLastWatchedAtBetween(startOfMonth, endOfMonth);
                
                stats.add(AdminStatsResponse.MonthlyStats.builder()
                        .month(monthStart.format(formatter))
                        .newUsers(newUsers != null ? newUsers : 0L)
                        .totalViews(views != null ? views : 0L)
                        .revenue((newUsers != null ? newUsers : 0L) * 12900L)
                        .build());
            }
        } catch (Exception e) {
            log.error("❌ 월별 통계 생성 실패: {}", e.getMessage());
        }
        
        return stats;
    }
    
    private List<AdminStatsResponse.PopularContent> getPopularContents() {
        try {
            List<Content> contents = contentRepository.findAll();
            
            return contents.stream()
                    .map(content -> {
                        Long favoriteCount = favoriteRepository.countByContentId(content.getId());
                        return AdminStatsResponse.PopularContent.builder()
                                .contentId(content.getId())
                                .title(content.getTitle())
                                .type(content.getContentType().name())
                                .viewCount(content.getViewCount() != null ? content.getViewCount() : 0L)
                                .favoriteCount(favoriteCount != null ? favoriteCount : 0L)
                                .build();
                    })
                    .sorted((a, b) -> Long.compare(b.getViewCount(), a.getViewCount()))
                    .limit(10)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("❌ 인기 콘텐츠 조회 실패: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
    
    private Map<String, Long> getGenreStats() {
        try {
            List<Content> contents = contentRepository.findAll();
            return contents.stream()
                    .filter(content -> content.getGenre() != null)
                    .collect(Collectors.groupingBy(Content::getGenre, Collectors.counting()));
        } catch (Exception e) {
            log.error("❌ 장르별 통계 조회 실패: {}", e.getMessage());
            return new HashMap<>();
        }
    }

    // ==================== 회원 관리 ====================
    
    @Transactional(readOnly = true)
    public List<UserManagementResponse> getAllUsers(int page, int size) {
        log.info("👥 회원 목록 조회 - page: {}, size: {}", page, size);
        
        try {
            List<User> users = userRepository.findAll(PageRequest.of(page, size)).getContent();
            
            return users.stream()
                    .map(user -> {
                        Long watchCount = watchHistoryRepository.countByUserId(user.getId());
                        Long favoriteCount = favoriteRepository.countByUserId(user.getId());
                        return UserManagementResponse.fromEntity(user, watchCount, favoriteCount);
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("❌ 회원 목록 조회 실패: {}", e.getMessage());
            throw new RuntimeException("회원 목록 조회에 실패했습니다: " + e.getMessage());
        }
    }
    
    public void toggleUserStatus(Long userId) {
        log.info("🔄 회원 상태 변경 - userId: {}", userId);
        
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            
            // ✅ Boolean 타입이라 isEnabled() 사용
            user.setEnabled(!user.isEnabled());
            userRepository.save(user);
            
            log.info("✅ 회원 상태 변경 완료 - enabled: {}", user.isEnabled());
        } catch (Exception e) {
            log.error("❌ 회원 상태 변경 실패: {}", e.getMessage());
            throw new RuntimeException("회원 상태 변경에 실패했습니다: " + e.getMessage());
        }
    }
    
    public void deleteUser(Long userId) {
        log.info("🗑️ 회원 삭제 - userId: {}", userId);
        
        try {
            if (!userRepository.existsById(userId)) {
                throw new RuntimeException("사용자를 찾을 수 없습니다.");
            }
            
            userRepository.deleteById(userId);
            log.info("✅ 회원 삭제 완료");
        } catch (Exception e) {
            log.error("❌ 회원 삭제 실패: {}", e.getMessage());
            throw new RuntimeException("회원 삭제에 실패했습니다: " + e.getMessage());
        }
    }

    // ==================== 콘텐츠 관리 ====================
    
    public ContentResponse createContent(CreateContentRequest request) {
        log.info("➕ 콘텐츠 생성 - title: {}", request.getTitle());
        
        try {
            Content content = Content.builder()
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .genre(request.getGenre())
                    .year(request.getYear())
                    .rating(request.getRating() != null ? request.getRating() : 0.0)
                    .duration(request.getDuration())
                    .episodes(request.getEpisodes())
                    .seasons(request.getSeasons())
                    .image(request.getImage())
                    .thumbnailUrl(request.getThumbnailUrl())
                    .contentType(Content.ContentType.valueOf(request.getContentType()))
                    .trailerUrl(request.getTrailerUrl())
                    .videoUrl(request.getVideoUrl())
                    .director(request.getDirector())
                    .cast(request.getCast())
                    .ageRating(request.getAgeRating())
                    .country(request.getCountry())
                    .language(request.getLanguage())
                    .tags(request.getTags())
                    .viewCount(0L)
                    .likeCount(0L)
                    .build();
            
            Content savedContent = contentRepository.save(content);
            log.info("✅ 콘텐츠 생성 완료 - id: {}", savedContent.getId());
            
            return ContentResponse.fromEntity(savedContent);
        } catch (Exception e) {
            log.error("❌ 콘텐츠 생성 실패: {}", e.getMessage());
            throw new RuntimeException("콘텐츠 생성에 실패했습니다: " + e.getMessage());
        }
    }
    
    public ContentResponse updateContent(Long contentId, CreateContentRequest request) {
        log.info("✏️ 콘텐츠 수정 - contentId: {}", contentId);
        
        try {
            Content content = contentRepository.findById(contentId)
                    .orElseThrow(() -> new RuntimeException("콘텐츠를 찾을 수 없습니다."));
            
            // 수정 가능한 필드 업데이트
            if (request.getTitle() != null && !request.getTitle().trim().isEmpty()) {
                content.setTitle(request.getTitle());
            }
            if (request.getDescription() != null) {
                content.setDescription(request.getDescription());
            }
            if (request.getGenre() != null && !request.getGenre().trim().isEmpty()) {
                content.setGenre(request.getGenre());
            }
            if (request.getYear() != null) {
                content.setYear(request.getYear());
            }
            if (request.getRating() != null) {
                content.setRating(request.getRating());
            }
            if (request.getDuration() != null) {
                content.setDuration(request.getDuration());
            }
            if (request.getEpisodes() != null) {
                content.setEpisodes(request.getEpisodes());
            }
            if (request.getSeasons() != null) {
                content.setSeasons(request.getSeasons());
            }
            if (request.getImage() != null) {
                content.setImage(request.getImage());
            }
            if (request.getThumbnailUrl() != null) {
                content.setThumbnailUrl(request.getThumbnailUrl());
            }
            if (request.getTrailerUrl() != null) {
                content.setTrailerUrl(request.getTrailerUrl());
            }
            if (request.getVideoUrl() != null) {
                content.setVideoUrl(request.getVideoUrl());
            }
            if (request.getDirector() != null) {
                content.setDirector(request.getDirector());
            }
            if (request.getCast() != null) {
                content.setCast(request.getCast());
            }
            if (request.getAgeRating() != null) {
                content.setAgeRating(request.getAgeRating());
            }
            if (request.getCountry() != null) {
                content.setCountry(request.getCountry());
            }
            if (request.getLanguage() != null) {
                content.setLanguage(request.getLanguage());
            }
            if (request.getTags() != null) {
                content.setTags(request.getTags());
            }
            
            Content updatedContent = contentRepository.save(content);
            log.info("✅ 콘텐츠 수정 완료");
            
            return ContentResponse.fromEntity(updatedContent);
        } catch (Exception e) {
            log.error("❌ 콘텐츠 수정 실패: {}", e.getMessage());
            throw new RuntimeException("콘텐츠 수정에 실패했습니다: " + e.getMessage());
        }
    }
    
    public void deleteContent(Long contentId) {
        log.info("🗑️ 콘텐츠 삭제 - contentId: {}", contentId);
        
        try {
            if (!contentRepository.existsById(contentId)) {
                throw new RuntimeException("콘텐츠를 찾을 수 없습니다.");
            }
            
            contentRepository.deleteById(contentId);
            log.info("✅ 콘텐츠 삭제 완료");
        } catch (Exception e) {
            log.error("❌ 콘텐츠 삭제 실패: {}", e.getMessage());
            throw new RuntimeException("콘텐츠 삭제에 실패했습니다: " + e.getMessage());
        }
    }
}
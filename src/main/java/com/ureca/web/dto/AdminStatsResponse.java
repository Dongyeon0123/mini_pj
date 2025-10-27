package com.ureca.web.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsResponse {
    private Long totalUsers;
    private Long totalContents;
    private Long totalViews;
    private Long totalFavorites;
    private Long activeUsersToday;
    private Long newUsersThisMonth;
    
    // 일별 통계 (최근 7일)
    private List<DailyStats> dailyStats;
    
    // 월별 통계 (최근 6개월)
    private List<MonthlyStats> monthlyStats;
    
    // 인기 콘텐츠 Top 10
    private List<PopularContent> popularContents;
    
    // 장르별 통계
    private Map<String, Long> genreStats;
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DailyStats {
        private String date;
        private Long newUsers;
        private Long activeUsers;
        private Long totalViews;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyStats {
        private String month;
        private Long newUsers;
        private Long totalViews;
        private Long revenue;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PopularContent {
        private Long contentId;
        private String title;
        private String type;
        private Long viewCount;
        private Long favoriteCount;
    }
}
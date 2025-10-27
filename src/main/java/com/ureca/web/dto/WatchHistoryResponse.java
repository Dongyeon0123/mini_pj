package com.ureca.web.dto;

import com.ureca.web.entity.WatchHistory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WatchHistoryResponse {
    private Long id;
    private Long userId;
    private Long contentId;
    private String contentTitle;
    private String contentImage;
    private String contentType;
    private Integer watchPosition;      // 현재 시청 위치
    private Integer watchDuration;      // 총 시청 시간
    private Boolean completed;          // 시청 완료 여부
    private LocalDateTime lastWatchedAt;
    private LocalDateTime createdAt;

    public static WatchHistoryResponse fromEntity(WatchHistory history) {
        return WatchHistoryResponse.builder()
                .id(history.getId())
                .userId(history.getUser().getId())
                .contentId(history.getContent().getId())
                .contentTitle(history.getContent().getTitle())
                .contentImage(history.getContent().getImage())
                .contentType(history.getContent().getContentType().name())
                .watchPosition(history.getWatchPosition())
                .watchDuration(history.getWatchDuration())
                .completed(history.getCompleted())
                .lastWatchedAt(history.getLastWatchedAt())
                .createdAt(history.getCreatedAt())
                .build();
    }
}
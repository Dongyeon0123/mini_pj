package com.ureca.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaveWatchHistoryRequest {
    private Long userId;
    private Long contentId;
    private Integer watchPosition;  // 시청 위치 (초)
    private Boolean completed;      // 시청 완료 여부
}
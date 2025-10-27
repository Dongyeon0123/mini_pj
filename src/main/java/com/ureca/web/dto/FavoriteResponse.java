package com.ureca.web.dto;

import com.ureca.web.entity.Favorite;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteResponse {
    
    private Long id;
    private Long userId;
    private Long contentId;
    private String contentTitle;
    private String contentImage;
    private String contentType;
    private LocalDateTime createdAt;

    // Entity -> DTO 변환
    public static FavoriteResponse fromEntity(Favorite favorite) {
        return FavoriteResponse.builder()
                .id(favorite.getId())
                .userId(favorite.getUser().getId())
                .contentId(favorite.getContent().getId())
                .contentTitle(favorite.getContent().getTitle())
                .contentImage(favorite.getContent().getImage())
                .contentType(favorite.getContent().getContentType().name())
                .createdAt(favorite.getCreatedAt())
                .build();
    }
}
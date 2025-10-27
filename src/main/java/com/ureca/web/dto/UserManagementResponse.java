package com.ureca.web.dto;

import com.ureca.web.entity.User;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserManagementResponse {
    private Long id;
    private String email;
    private String name;
    private String phoneNumber;
    private String role;
    private Boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long totalWatchCount;
    private Long totalFavoriteCount;
    
    public static UserManagementResponse fromEntity(User user, Long watchCount, Long favoriteCount) {
        return UserManagementResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .enabled(user.isEnabled())  // ✅ getEnabled() -> isEnabled()
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .totalWatchCount(watchCount != null ? watchCount : 0L)
                .totalFavoriteCount(favoriteCount != null ? favoriteCount : 0L)
                .build();
    }
}
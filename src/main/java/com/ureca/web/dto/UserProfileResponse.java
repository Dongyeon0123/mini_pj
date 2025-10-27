package com.ureca.web.dto;

import com.ureca.web.entity.User;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private Long id;
    private String email;
    private String name;
    private String phoneNumber;
    private String role;
    private LocalDateTime createdAt;

    public static UserProfileResponse fromEntity(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
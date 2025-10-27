package com.ureca.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private Long id;        // 사용자 ID 추가!
    private String token;
    private String email;
    private String name;
    private String role;
    private String message;
}
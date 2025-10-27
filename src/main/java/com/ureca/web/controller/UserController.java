package com.ureca.web.controller;

import com.ureca.web.dto.*;
import com.ureca.web.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    // 프로필 조회
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserProfile(@PathVariable Long userId) {
        log.info("=== 프로필 조회 API 호출 ===");
        log.info("User ID: {}", userId);

        try {
            UserProfileResponse profile = userService.getUserProfile(userId);
            
            ApiResponse<UserProfileResponse> response = ApiResponse.<UserProfileResponse>builder()
                    .success(true)
                    .message("프로필 조회에 성공했습니다.")
                    .data(profile)
                    .build();
                    
            log.info("✅ 프로필 조회 성공");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ 프로필 조회 실패: {}", e.getMessage());
            
            ApiResponse<UserProfileResponse> response = ApiResponse.<UserProfileResponse>builder()
                    .success(false)
                    .message("프로필 조회에 실패했습니다: " + e.getMessage())
                    .build();
                    
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 프로필 수정
    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @PathVariable Long userId,
            @RequestBody UpdateProfileRequest request) {
        
        log.info("=== 프로필 수정 API 호출 ===");
        log.info("User ID: {}, Request: {}", userId, request);

        try {
            UserProfileResponse updatedProfile = userService.updateProfile(userId, request);
            
            ApiResponse<UserProfileResponse> response = ApiResponse.<UserProfileResponse>builder()
                    .success(true)
                    .message("프로필이 수정되었습니다.")
                    .data(updatedProfile)
                    .build();
                    
            log.info("✅ 프로필 수정 성공");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ 프로필 수정 실패: {}", e.getMessage());
            
            ApiResponse<UserProfileResponse> response = ApiResponse.<UserProfileResponse>builder()
                    .success(false)
                    .message("프로필 수정에 실패했습니다: " + e.getMessage())
                    .build();
                    
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 비밀번호 변경
    @PutMapping("/{userId}/password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @PathVariable Long userId,
            @RequestBody ChangePasswordRequest request) {
        
        log.info("=== 비밀번호 변경 API 호출 ===");
        log.info("User ID: {}", userId);

        try {
            userService.changePassword(userId, request);
            
            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(true)
                    .message("비밀번호가 변경되었습니다.")
                    .build();
                    
            log.info("✅ 비밀번호 변경 성공");
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.error("❌ 비밀번호 변경 실패 (잘못된 비밀번호): {}", e.getMessage());
            
            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();
                    
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception e) {
            log.error("❌ 비밀번호 변경 실패: {}", e.getMessage());
            
            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(false)
                    .message("비밀번호 변경에 실패했습니다: " + e.getMessage())
                    .build();
                    
            return ResponseEntity.badRequest().body(response);
        }
    }
}
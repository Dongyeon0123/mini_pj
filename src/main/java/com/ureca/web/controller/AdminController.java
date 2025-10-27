package com.ureca.web.controller;

import com.ureca.web.dto.*;
import com.ureca.web.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final AdminService adminService;

    // ==================== 통계 API ====================
    
    @GetMapping("/stats")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getAdminStats() {
        log.info("=== 관리자 통계 조회 API 호출 ===");
        
        try {
            AdminStatsResponse stats = adminService.getAdminStats();
            
            ApiResponse<AdminStatsResponse> response = ApiResponse.<AdminStatsResponse>builder()
                    .success(true)
                    .message("통계 조회에 성공했습니다.")
                    .data(stats)
                    .build();
                    
            log.info("✅ 통계 조회 성공");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ 통계 조회 실패: {}", e.getMessage());
            
            ApiResponse<AdminStatsResponse> response = ApiResponse.<AdminStatsResponse>builder()
                    .success(false)
                    .message("통계 조회에 실패했습니다: " + e.getMessage())
                    .build();
                    
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ==================== 회원 관리 API ====================
    
    @GetMapping("/users")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserManagementResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        log.info("=== 회원 목록 조회 API 호출 === page: {}, size: {}", page, size);
        
        try {
            List<UserManagementResponse> users = adminService.getAllUsers(page, size);
            
            ApiResponse<List<UserManagementResponse>> response = ApiResponse.<List<UserManagementResponse>>builder()
                    .success(true)
                    .message("회원 목록 조회에 성공했습니다.")
                    .data(users)
                    .build();
                    
            log.info("✅ 회원 목록 조회 성공, 개수: {}", users.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ 회원 목록 조회 실패: {}", e.getMessage());
            
            ApiResponse<List<UserManagementResponse>> response = ApiResponse.<List<UserManagementResponse>>builder()
                    .success(false)
                    .message("회원 목록 조회에 실패했습니다: " + e.getMessage())
                    .build();
                    
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/users/{userId}/toggle")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> toggleUserStatus(@PathVariable Long userId) {
        log.info("=== 회원 상태 변경 API 호출 === userId: {}", userId);
        
        try {
            adminService.toggleUserStatus(userId);
            
            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(true)
                    .message("회원 상태가 변경되었습니다.")
                    .build();
                    
            log.info("✅ 회원 상태 변경 성공");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ 회원 상태 변경 실패: {}", e.getMessage());
            
            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(false)
                    .message("회원 상태 변경에 실패했습니다: " + e.getMessage())
                    .build();
                    
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/users/{userId}")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long userId) {
        log.info("=== 회원 삭제 API 호출 === userId: {}", userId);
        
        try {
            adminService.deleteUser(userId);
            
            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(true)
                    .message("회원이 삭제되었습니다.")
                    .build();
                    
            log.info("✅ 회원 삭제 성공");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ 회원 삭제 실패: {}", e.getMessage());
            
            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(false)
                    .message("회원 삭제에 실패했습니다: " + e.getMessage())
                    .build();
                    
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ==================== 콘텐츠 관리 API ====================
    
    @PostMapping("/contents")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ContentResponse>> createContent(@RequestBody CreateContentRequest request) {
        log.info("=== 콘텐츠 생성 API 호출 ===");
        log.info("Title: {}, Type: {}", request.getTitle(), request.getContentType());
        
        try {
            ContentResponse content = adminService.createContent(request);
            
            ApiResponse<ContentResponse> response = ApiResponse.<ContentResponse>builder()
                    .success(true)
                    .message("콘텐츠가 생성되었습니다.")
                    .data(content)
                    .build();
                    
            log.info("✅ 콘텐츠 생성 성공, ID: {}", content.getId());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ 콘텐츠 생성 실패: {}", e.getMessage());
            
            ApiResponse<ContentResponse> response = ApiResponse.<ContentResponse>builder()
                    .success(false)
                    .message("콘텐츠 생성에 실패했습니다: " + e.getMessage())
                    .build();
                    
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/contents/{contentId}")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ContentResponse>> updateContent(
            @PathVariable Long contentId,
            @RequestBody CreateContentRequest request) {
        
        log.info("=== 콘텐츠 수정 API 호출 === contentId: {}", contentId);
        
        try {
            ContentResponse content = adminService.updateContent(contentId, request);
            
            ApiResponse<ContentResponse> response = ApiResponse.<ContentResponse>builder()
                    .success(true)
                    .message("콘텐츠가 수정되었습니다.")
                    .data(content)
                    .build();
                    
            log.info("✅ 콘텐츠 수정 성공");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ 콘텐츠 수정 실패: {}", e.getMessage());
            
            ApiResponse<ContentResponse> response = ApiResponse.<ContentResponse>builder()
                    .success(false)
                    .message("콘텐츠 수정에 실패했습니다: " + e.getMessage())
                    .build();
                    
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/contents/{contentId}")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteContent(@PathVariable Long contentId) {
        log.info("=== 콘텐츠 삭제 API 호출 === contentId: {}", contentId);
        
        try {
            adminService.deleteContent(contentId);
            
            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(true)
                    .message("콘텐츠가 삭제되었습니다.")
                    .build();
                    
            log.info("✅ 콘텐츠 삭제 성공");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ 콘텐츠 삭제 실패: {}", e.getMessage());
            
            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(false)
                    .message("콘텐츠 삭제에 실패했습니다: " + e.getMessage())
                    .build();
                    
            return ResponseEntity.badRequest().body(response);
        }
    }
}
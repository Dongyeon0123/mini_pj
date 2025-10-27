package com.ureca.web.controller;

import com.ureca.web.dto.LoginRequest;
import com.ureca.web.dto.LoginResponse;
import com.ureca.web.dto.SignupRequest;
import com.ureca.web.entity.User;
import com.ureca.web.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            // 요청 데이터 로그 출력
            log.info("=== 회원가입 요청 시작 ===");
            log.info("이메일: {}", signupRequest.getEmail());
            log.info("이름: {}", signupRequest.getName());
            log.info("전화번호: {}", signupRequest.getPhoneNumber());
            log.info("비밀번호 길이: {}", signupRequest.getPassword() != null ? signupRequest.getPassword().length() : 0);
            log.info("전체 요청 데이터: {}", signupRequest);
            
            User user = authService.signup(signupRequest);
            
            // 성공 로그
            log.info("=== 회원가입 성공 ===");
            log.info("생성된 사용자 ID: {}", user.getId());
            log.info("생성된 사용자 이메일: {}", user.getEmail());
            log.info("생성된 사용자 이름: {}", user.getName());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "회원가입이 완료되었습니다.");
            response.put("data", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "name", user.getName()
            ));
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (RuntimeException e) {
            // 에러 로그
            log.error("=== 회원가입 실패 ===");
            log.error("에러 메시지: {}", e.getMessage());
            log.error("에러 스택: ", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // 로그인 요청 로그
            log.info("=== 로그인 요청 시작 ===");
            log.info("이메일: {}", loginRequest.getEmail());
            log.info("비밀번호 길이: {}", loginRequest.getPassword() != null ? loginRequest.getPassword().length() : 0);
            
            LoginResponse loginResponse = authService.login(loginRequest);
            
            // 로그인 성공 로그
            log.info("=== 로그인 성공 ===");
            log.info("토큰 생성 완료");
            log.info("사용자 이메일: {}", loginResponse.getEmail());
            log.info("사용자 이름: {}", loginResponse.getName());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "로그인에 성공했습니다.");
            response.put("data", loginResponse);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            // 로그인 실패 로그
            log.error("=== 로그인 실패 ===");
            log.error("에러 메시지: {}", e.getMessage());
            log.error("에러 스택: ", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}
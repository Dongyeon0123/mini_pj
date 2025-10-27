package com.ureca.web.service;

import com.ureca.web.dto.LoginRequest;
import com.ureca.web.dto.LoginResponse;
import com.ureca.web.dto.SignupRequest;
import com.ureca.web.entity.User;
import com.ureca.web.repository.UserRepository;
import com.ureca.web.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public User signup(SignupRequest signupRequest) {
        log.info("=== AuthService.signup 시작 ===");
        log.info("받은 데이터 - 이메일: {}, 이름: {}, 전화번호: {}", 
                signupRequest.getEmail(), signupRequest.getName(), signupRequest.getPhoneNumber());
        
        // 이메일 중복 확인
        boolean emailExists = userRepository.existsByEmail(signupRequest.getEmail());
        log.info("이메일 중복 확인 결과: {}", emailExists);
        
        if (emailExists) {
            log.error("이메일 중복으로 인한 회원가입 실패: {}", signupRequest.getEmail());
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(signupRequest.getPassword());
        log.info("비밀번호 암호화 완료");
        
        // 사용자 생성
        User user = User.builder()
                .email(signupRequest.getEmail())
                .password(encodedPassword)
                .name(signupRequest.getName())
                .phoneNumber(signupRequest.getPhoneNumber())
                .role(User.Role.USER)
                .build();
        
        log.info("사용자 객체 생성 완료: {}", user);
        
        // 데이터베이스 저장
        User savedUser = userRepository.save(user);
        log.info("=== 데이터베이스 저장 완료 ===");
        log.info("저장된 사용자 ID: {}", savedUser.getId());
        log.info("저장된 사용자 정보: {}", savedUser);
        
        return savedUser;
    }
    
    public LoginResponse login(LoginRequest loginRequest) {
        log.info("=== AuthService.login 시작 ===");
        log.info("로그인 시도 - 이메일: {}", loginRequest.getEmail());
        
        try {
            // 사용자 조회
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> {
                        log.error("사용자를 찾을 수 없음: {}", loginRequest.getEmail());
                        return new RuntimeException("사용자를 찾을 수 없습니다.");
                    });
            
            log.info("사용자 조회 성공 - ID: {}, 이메일: {}", user.getId(), user.getEmail());
            
            // 비밀번호 확인
            boolean passwordMatches = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
            log.info("비밀번호 확인 결과: {}", passwordMatches);
            
            if (!passwordMatches) {
                log.error("비밀번호 불일치");
                throw new RuntimeException("비밀번호가 일치하지 않습니다.");
            }
            
            // JWT 토큰 생성
            String token = jwtUtil.generateToken(user);
            log.info("JWT 토큰 생성 완료");
            
            // LoginResponse 생성 (ID 추가!)
            LoginResponse response = LoginResponse.builder()
                    .id(user.getId())        // ✅ ID 추가!
                    .token(token)
                    .email(user.getEmail())
                    .name(user.getName())
                    .role(user.getRole().name())
                    .build();
            
            log.info("=== 로그인 성공 ===");
            log.info("응답 데이터 - ID: {}, 이메일: {}, 이름: {}", response.getId(), response.getEmail(), response.getName());
            
            return response;
                    
        } catch (Exception e) {
            log.error("로그인 처리 중 에러 발생: {}", e.getMessage());
            log.error("에러 스택: ", e);
            throw new RuntimeException("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
        }
    }
}
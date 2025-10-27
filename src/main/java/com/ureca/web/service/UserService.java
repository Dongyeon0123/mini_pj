package com.ureca.web.service;

import com.ureca.web.dto.ChangePasswordRequest;
import com.ureca.web.dto.UpdateProfileRequest;
import com.ureca.web.dto.UserProfileResponse;
import com.ureca.web.entity.User;
import com.ureca.web.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 프로필 조회
    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(Long userId) {
        log.info("📋 프로필 조회 시작 - User ID: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("❌ 사용자를 찾을 수 없음 - User ID: {}", userId);
                    return new RuntimeException("사용자를 찾을 수 없습니다.");
                });
        
        log.info("✅ 프로필 조회 성공 - Email: {}", user.getEmail());
        return UserProfileResponse.fromEntity(user);
    }

    // 프로필 수정
    public UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        log.info("📝 프로필 수정 시작 - User ID: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("❌ 사용자를 찾을 수 없음 - User ID: {}", userId);
                    return new RuntimeException("사용자를 찾을 수 없습니다.");
                });
        
        // 이름 수정
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            log.info("✏️ 이름 변경: {} -> {}", user.getName(), request.getName());
            user.setName(request.getName());
        }
        
        // 전화번호 수정
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty()) {
            log.info("✏️ 전화번호 변경: {} -> {}", user.getPhoneNumber(), request.getPhoneNumber());
            user.setPhoneNumber(request.getPhoneNumber());
        }
        
        User updatedUser = userRepository.save(user);
        log.info("✅ 프로필 수정 완료");
        
        return UserProfileResponse.fromEntity(updatedUser);
    }

    // 비밀번호 변경
    public void changePassword(Long userId, ChangePasswordRequest request) {
        log.info("🔐 비밀번호 변경 시작 - User ID: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("❌ 사용자를 찾을 수 없음 - User ID: {}", userId);
                    return new RuntimeException("사용자를 찾을 수 없습니다.");
                });
        
        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            log.error("❌ 현재 비밀번호가 일치하지 않음");
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }
        
        // 새 비밀번호 암호화
        String encodedNewPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(encodedNewPassword);
        
        userRepository.save(user);
        log.info("✅ 비밀번호 변경 완료");
    }
}
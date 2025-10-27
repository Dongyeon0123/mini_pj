package com.ureca.web.repository;

import com.ureca.web.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    Optional<User> findByName(String name);
    
    // ==================== 관리자용 통계 메서드 ====================
    
    // 특정 날짜 이후에 가입한 사용자 수
    Long countByCreatedAtAfter(LocalDateTime date);
    
    // 특정 기간 동안 가입한 사용자 수
    Long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
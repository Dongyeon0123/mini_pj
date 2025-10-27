package com.ureca.web.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "watch_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @Column(name = "watch_position", nullable = false)
    private Integer watchPosition = 0;  // 시청 위치 (초 단위)

    @Column(name = "watch_duration")
    private Integer watchDuration = 0;  // 총 시청 시간 (초 단위)

    @Column(name = "completed")
    private Boolean completed = false;  // 시청 완료 여부

    @Column(name = "last_watched_at")
    private LocalDateTime lastWatchedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.lastWatchedAt = LocalDateTime.now();
    }
}
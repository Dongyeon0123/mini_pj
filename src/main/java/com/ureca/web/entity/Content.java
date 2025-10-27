package com.ureca.web.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "contents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Content {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false, length = 50)
    private String genre;
    
    @Column(nullable = false)
    private Integer year;
    
    @Column(nullable = false, columnDefinition = "DECIMAL(3,1) DEFAULT 0.0")
    private Double rating = 0.0;
    
    @Column(length = 20)
    private String duration;
    
    private Integer episodes;
    
    private Integer seasons;
    
    @Column(length = 500)
    private String image;
    
    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "content_type", nullable = false, length = 20)
    private ContentType contentType;
    
    @Column(name = "trailer_url", length = 500)
    private String trailerUrl;
    
    @Column(name = "video_url", length = 500)
    private String videoUrl;
    
    @Column(length = 100)
    private String director;
    
    @Column(columnDefinition = "TEXT")
    private String cast;
    
    @Column(name = "age_rating", length = 20)
    private String ageRating;
    
    @Column(name = "release_date")
    private LocalDate releaseDate;
    
    @Column(length = 50)
    private String country;
    
    @Column(length = 50)
    private String language;
    
    @Column(columnDefinition = "TEXT")
    private String tags;
    
    @Column(name = "view_count")
    private Long viewCount = 0L;
    
    @Column(name = "like_count")
    private Long likeCount = 0L;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum ContentType {
        MOVIE, SERIES
    }
}
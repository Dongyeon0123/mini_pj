package com.ureca.web.dto;

import com.ureca.web.entity.Content;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentResponse {
    private Long id;
    private String title;
    private String description;
    private String genre;
    private Integer year;
    private Double rating;
    private String duration;
    private Integer episodes;
    private Integer seasons;
    private String image;
    private String thumbnailUrl;
    private String contentType;
    private String trailerUrl;
    private String videoUrl;
    private String director;
    private String cast;
    private String ageRating;
    private String releaseDate;
    private String country;
    private String language;
    private String tags;
    private Long viewCount;
    private Long likeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ✅ fromEntity 메서드 추가
    public static ContentResponse fromEntity(Content content) {
        return ContentResponse.builder()
                .id(content.getId())
                .title(content.getTitle())
                .description(content.getDescription())
                .genre(content.getGenre())
                .year(content.getYear())
                .rating(content.getRating())
                .duration(content.getDuration())
                .episodes(content.getEpisodes())
                .seasons(content.getSeasons())
                .image(content.getImage())
                .thumbnailUrl(content.getThumbnailUrl())
                .contentType(content.getContentType() != null ? content.getContentType().name() : null)
                .trailerUrl(content.getTrailerUrl())
                .videoUrl(content.getVideoUrl())
                .director(content.getDirector())
                .cast(content.getCast())
                .ageRating(content.getAgeRating())
                .releaseDate(content.getReleaseDate() != null ? content.getReleaseDate().toString() : null)
                .country(content.getCountry())
                .language(content.getLanguage())
                .tags(content.getTags())
                .viewCount(content.getViewCount())
                .likeCount(content.getLikeCount())
                .createdAt(content.getCreatedAt())
                .updatedAt(content.getUpdatedAt())
                .build();
    }
}
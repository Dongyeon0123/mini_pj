package com.ureca.web.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateContentRequest {
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
    private String contentType; // MOVIE or SERIES
    private String trailerUrl;
    private String videoUrl;
    private String director;
    private String cast;
    private String ageRating;
    private String releaseDate;
    private String country;
    private String language;
    private String tags;
}
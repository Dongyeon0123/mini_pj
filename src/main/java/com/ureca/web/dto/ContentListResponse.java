package com.ureca.web.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentListResponse {
    
    private List<ContentResponse> contents;
    private PageInfo pageInfo;
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PageInfo {
        private int page;
        private int size;
        private long totalElements;
        private int totalPages;
    }
}
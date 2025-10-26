// API 기본 설정
const API_BASE_URL = 'http://localhost:8080/api';

// API 응답 타입 정의
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// 회원가입 요청 타입
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

// 회원가입 응답 타입
export interface SignupResponse {
  id: number;
  email: string;
  name: string;
}

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  token: string;
  email: string;
  name: string;
  role: string;
}

// API 호출 함수들
export const authApi = {
  // 회원가입
  signup: async (data: SignupRequest): Promise<ApiResponse<SignupResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || '회원가입에 실패했습니다.');
      }

      return result;
    } catch (error) {
      console.error('회원가입 API 에러:', error);
      throw error;
    }
  },

  // 로그인
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    try {
      console.log('=== API 호출 시작 ===');
      console.log('요청 URL:', `${API_BASE_URL}/auth/login`);
      console.log('요청 데이터:', data);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('=== 백엔드 응답 ===');
      console.log('응답 상태:', response.status);
      console.log('응답 OK:', response.ok);
      console.log('응답 헤더:', response.headers);

      const result = await response.json();
      console.log('응답 데이터:', result);
      
      if (!response.ok) {
        console.log('=== 로그인 실패 ===');
        console.log('실패 상태 코드:', response.status);
        console.log('실패 메시지:', result.message);
        throw new Error(result.message || '로그인에 실패했습니다.');
      }

      console.log('=== 로그인 성공 ===');
      return result;
    } catch (error) {
      console.error('로그인 API 에러:', error);
      throw error;
    }
  },
};

// 토큰 관리 함수들
export const tokenManager = {
  // 토큰 저장
  setToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },

  // 토큰 가져오기
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // 토큰 삭제
  removeToken: () => {
    localStorage.removeItem('authToken');
  },

  // 인증된 요청 헤더 생성
  getAuthHeaders: () => {
    const token = tokenManager.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },
};

// ============================================
// 콘텐츠 관련 타입 정의
// ============================================

// 콘텐츠 타입
export enum ContentType {
  MOVIE = 'MOVIE',
  SERIES = 'SERIES',
}

// 콘텐츠 기본 정보
export interface Content {
  id: number;
  title: string;
  description?: string;
  genre: string;
  year: number;
  rating: number;
  duration?: string; // 영화의 경우 "120분"
  episodes?: number; // 시리즈의 경우
  seasons?: number; // 시리즈의 경우
  image: string;
  thumbnailUrl?: string;
  contentType: ContentType;
  createdAt?: string;
  updatedAt?: string;
}

// 콘텐츠 상세 정보
export interface ContentDetail extends Content {
  trailerUrl?: string;
  videoUrl?: string;
  director?: string;
  cast?: string[];
  ageRating?: string;
  releaseDate?: string;
  country?: string;
  language?: string;
  tags?: string[];
  viewCount?: number;
  likeCount?: number;
}

// 콘텐츠 필터 조건
export interface ContentFilter {
  contentType?: ContentType;
  genre?: string;
  keyword?: string;
  sortBy?: 'latest' | 'rating' | 'popular' | 'title';
  page?: number;
  size?: number;
}

// 페이징 정보
export interface PageInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// 콘텐츠 목록 응답
export interface ContentListResponse {
  contents: Content[];
  pageInfo: PageInfo;
}

// 장르 목록
export const GENRES = [
  '전체',
  '드라마',
  '액션',
  '공포',
  '코미디',
  '로맨스',
  '스릴러',
  '판타지',
  'SF',
  '다큐멘터리',
];

// ============================================
// 콘텐츠 API
// ============================================

export const contentApi = {
  // 콘텐츠 목록 조회 (필터링, 검색, 페이징)
  getContents: async (
    filter: ContentFilter
  ): Promise<ApiResponse<ContentListResponse>> => {
    try {
      const params = new URLSearchParams();
      
      if (filter.contentType) params.append('contentType', filter.contentType);
      if (filter.genre && filter.genre !== '전체') params.append('genre', filter.genre);
      if (filter.keyword) params.append('keyword', filter.keyword);
      if (filter.sortBy) params.append('sortBy', filter.sortBy);
      params.append('page', (filter.page || 0).toString());
      params.append('size', (filter.size || 20).toString());

      const response = await fetch(
        `${API_BASE_URL}/contents?${params.toString()}`,
        {
          method: 'GET',
          headers: tokenManager.getAuthHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '콘텐츠 목록 조회에 실패했습니다.');
      }

      return result;
    } catch (error) {
      console.error('콘텐츠 목록 조회 API 에러:', error);
      throw error;
    }
  },

  // 콘텐츠 상세 조회
  getContentById: async (
    id: number
  ): Promise<ApiResponse<ContentDetail>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/contents/${id}`, {
        method: 'GET',
        headers: tokenManager.getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '콘텐츠 조회에 실패했습니다.');
      }

      return result;
    } catch (error) {
      console.error('콘텐츠 상세 조회 API 에러:', error);
      throw error;
    }
  },

  // 추천 콘텐츠 조회
  getRecommendedContents: async (
    limit: number = 10
  ): Promise<ApiResponse<Content[]>> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/contents/recommended?limit=${limit}`,
        {
          method: 'GET',
          headers: tokenManager.getAuthHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '추천 콘텐츠 조회에 실패했습니다.');
      }

      return result;
    } catch (error) {
      console.error('추천 콘텐츠 조회 API 에러:', error);
      throw error;
    }
  },

  // 인기 콘텐츠 조회
  getPopularContents: async (
    contentType?: ContentType,
    limit: number = 10
  ): Promise<ApiResponse<Content[]>> => {
    try {
      const params = new URLSearchParams();
      if (contentType) params.append('contentType', contentType);
      params.append('limit', limit.toString());

      const response = await fetch(
        `${API_BASE_URL}/contents/popular?${params.toString()}`,
        {
          method: 'GET',
          headers: tokenManager.getAuthHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '인기 콘텐츠 조회에 실패했습니다.');
      }

      return result;
    } catch (error) {
      console.error('인기 콘텐츠 조회 API 에러:', error);
      throw error;
    }
  },

  // 최신 콘텐츠 조회
  getLatestContents: async (
    contentType?: ContentType,
    limit: number = 10
  ): Promise<ApiResponse<Content[]>> => {
    try {
      const params = new URLSearchParams();
      if (contentType) params.append('contentType', contentType);
      params.append('limit', limit.toString());

      const response = await fetch(
        `${API_BASE_URL}/contents/latest?${params.toString()}`,
        {
          method: 'GET',
          headers: tokenManager.getAuthHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '최신 콘텐츠 조회에 실패했습니다.');
      }

      return result;
    } catch (error) {
      console.error('최신 콘텐츠 조회 API 에러:', error);
      throw error;
    }
  },

  // 장르별 콘텐츠 조회
  getContentsByGenre: async (
    genre: string,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<ContentListResponse>> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/contents/genre/${genre}?page=${page}&size=${size}`,
        {
          method: 'GET',
          headers: tokenManager.getAuthHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '장르별 콘텐츠 조회에 실패했습니다.');
      }

      return result;
    } catch (error) {
      console.error('장르별 콘텐츠 조회 API 에러:', error);
      throw error;
    }
  },

  // 콘텐츠 검색
  searchContents: async (
    keyword: string,
    contentType?: ContentType,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<ContentListResponse>> => {
    try {
      const params = new URLSearchParams();
      params.append('keyword', keyword);
      if (contentType) params.append('contentType', contentType);
      params.append('page', page.toString());
      params.append('size', size.toString());

      const response = await fetch(
        `${API_BASE_URL}/contents/search?${params.toString()}`,
        {
          method: 'GET',
          headers: tokenManager.getAuthHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '콘텐츠 검색에 실패했습니다.');
      }

      return result;
    } catch (error) {
      console.error('콘텐츠 검색 API 에러:', error);
      throw error;
    }
  },
};
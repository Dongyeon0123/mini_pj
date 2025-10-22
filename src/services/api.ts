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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface PracticeResponse {
  code: number;
  message: string;
  ts?: string;
}
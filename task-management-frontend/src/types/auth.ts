export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

export interface LoginRequest {
  email: string;
  password: string;
}
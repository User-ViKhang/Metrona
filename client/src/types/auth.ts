export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export type UserRole = 'USER' | 'SELLER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  language: 'VI' | 'EN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatar?: string;
  language?: 'VI' | 'EN';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

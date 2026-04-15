import { request } from './config';
import { LoginRequest, LoginResponse, RegisterRequest } from '../types/auth';

export const loginUser = (credentials: LoginRequest): Promise<LoginResponse> =>
  request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

export const registerUser = (data: RegisterRequest): Promise<void> =>
  request<void>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

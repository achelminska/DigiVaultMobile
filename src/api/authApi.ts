import { BASE_URL } from '../config/constants';
import { LoginRequest, LoginResponse } from '../types/auth';

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/api/Auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Login failed');
  }

  return data;
};
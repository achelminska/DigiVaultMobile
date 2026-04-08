import { authRequest } from './config';

export interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
  totalWithdrawn: number;
  warningsCount: number;
}

export interface UpdateNameRequest {
  idUser: number;
  firstName: string;
  lastName: string;
}

export interface UpdateEmailRequest {
  idUser: number;
  email: string;
  password: string;
}

export interface UpdatePasswordRequest {
  idUser: number;
  password: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export const fetchUserProfile = (): Promise<UserProfile> =>
  authRequest<UserProfile>('/api/Profile');

export const updateName = (data: UpdateNameRequest): Promise<void> =>
  authRequest<void>('/api/Profile/name', { method: 'PATCH', body: JSON.stringify(data) });

export const updateEmail = (data: UpdateEmailRequest): Promise<void> =>
  authRequest<void>('/api/Profile/email', { method: 'PATCH', body: JSON.stringify(data) });

export const updatePassword = (data: UpdatePasswordRequest): Promise<void> =>
  authRequest<void>('/api/Profile/password', { method: 'PATCH', body: JSON.stringify(data) });

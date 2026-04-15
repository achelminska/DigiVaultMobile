import { authRequest } from './config';
import { UserProfile, UpdateNameRequest, UpdateEmailRequest, UpdatePasswordRequest } from '../types/user';

export const fetchUserProfile = (): Promise<UserProfile> =>
  authRequest<UserProfile>('/api/profile');

export const updateName = (data: UpdateNameRequest): Promise<void> =>
  authRequest<void>('/api/profile/name', { method: 'PATCH', body: JSON.stringify(data) });

export const updateEmail = (data: UpdateEmailRequest): Promise<void> =>
  authRequest<void>('/api/profile/email', { method: 'PATCH', body: JSON.stringify(data) });

export const updatePassword = (data: UpdatePasswordRequest): Promise<void> =>
  authRequest<void>('/api/profile/password', { method: 'PATCH', body: JSON.stringify(data) });

import { authRequest } from './config';
import { Notification } from '../types/notification';

export const fetchNotifications = (): Promise<Notification[]> =>
  authRequest<Notification[]>('/api/notifications');

export const markAsRead = (idNotification: number): Promise<void> =>
  authRequest<void>(`/api/notifications/${idNotification}`, { method: 'PATCH' });

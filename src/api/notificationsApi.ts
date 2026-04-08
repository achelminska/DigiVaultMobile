import { authRequest } from './config';

export interface Notification {
  idNotification: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const fetchNotifications = (): Promise<Notification[]> =>
  authRequest<Notification[]>('/api/Notifications');

export const markAsRead = (idNotification: number): Promise<void> =>
  authRequest<void>(`/api/Notifications/${idNotification}`, { method: 'PATCH' });

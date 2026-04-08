import { authRequest } from './config';
import { Course } from '../types/course';

export const fetchWishlist = (): Promise<Course[]> =>
  authRequest<Course[]>('/api/wishlist');

export const addToWishlist = (courseId: number): Promise<void> =>
  authRequest<void>(`/api/wishlist/${courseId}`, { method: 'POST' });

export const removeFromWishlist = (courseId: number): Promise<void> =>
  authRequest<void>(`/api/wishlist/${courseId}`, { method: 'DELETE' });

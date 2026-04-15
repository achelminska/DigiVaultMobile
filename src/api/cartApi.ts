import { authRequest } from './config';
import { Course } from '../types/course';
import { Order } from '../types/order';

export const fetchCart = (): Promise<Course[]> =>
  authRequest<Course[]>('/api/cart');

export const addToCart = (courseId: number): Promise<void> =>
  authRequest<void>(`/api/cart/${courseId}`, { method: 'POST' });

export const removeFromCart = (courseId: number): Promise<void> =>
  authRequest<void>(`/api/cart/${courseId}`, { method: 'DELETE' });

export const checkout = (): Promise<Order> =>
  authRequest<Order>('/api/orders', { method: 'POST' });
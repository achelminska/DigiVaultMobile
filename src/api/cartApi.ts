import { authRequest, request, BASE_URL } from './config';
import { Course } from '../types/course';
import { Order } from '../types/order';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchCart = (): Promise<Course[]> =>
  authRequest<Course[]>('/api/cart');

export const addToCart = (courseId: number): Promise<void> =>
  authRequest<void>(`/api/cart/${courseId}`, { method: 'POST' });

export const removeFromCart = (courseId: number): Promise<void> =>
  authRequest<void>(`/api/cart/${courseId}`, { method: 'DELETE' });

export class CheckoutConflictError extends Error {
  readonly isConflict = true;
}

export const checkout = async (): Promise<Order> => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/api/Orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (response.status === 409) throw new CheckoutConflictError('Already purchased');
  if (!response.ok) throw new Error(`Checkout failed: ${response.status}`);
  return response.json();
};

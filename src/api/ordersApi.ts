import { authRequest } from './config';
import { Order, OrderSummary } from '../types/order';

export const fetchOrders = (): Promise<OrderSummary[]> =>
  authRequest<OrderSummary[]>('/api/orders');

export const fetchOrderById = (idOrder: number): Promise<Order> =>
  authRequest<Order>(`/api/orders/${idOrder}`);

export const checkout = (): Promise<Order> =>
  authRequest<Order>('/api/orders', { method: 'POST' });

import { authRequest } from './config';
import { Order, OrderSummary } from '../types/order';

export const fetchOrders = (): Promise<OrderSummary[]> =>
  authRequest<OrderSummary[]>('/api/Orders');

export const fetchOrderById = (idOrder: number): Promise<Order> =>
  authRequest<Order>(`/api/Orders/${idOrder}`);

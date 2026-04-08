import { useQuery } from '@tanstack/react-query';
import { fetchOrders, fetchOrderById } from '../api/ordersApi';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });
};

export const useOrderDetail = (idOrder: number) => {
  return useQuery({
    queryKey: ['order', idOrder],
    queryFn: () => fetchOrderById(idOrder),
  });
};

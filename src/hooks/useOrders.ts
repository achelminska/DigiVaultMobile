import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOrders, fetchOrderById, checkout } from '../api/ordersApi';

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

export const useCheckout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['courses', 'purchased'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

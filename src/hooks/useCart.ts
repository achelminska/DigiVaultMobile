import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCart, addToCart, removeFromCart, checkout } from '../api/cartApi';

export const useCart = () => 
    useQuery({
        queryKey: ['cart'],
        queryFn: fetchCart,
    });

export const useAddToCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addToCart,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    });
}

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: removeFromCart,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    });
}

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
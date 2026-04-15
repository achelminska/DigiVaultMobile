import { fetchWishlist, addToWishlist, removeFromWishlist } from '../api/wishlistApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useWishlist = () => 
    useQuery({
        queryKey: ['wishlist'],
        queryFn: fetchWishlist,
});

export const useAddToWishlist = () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: addToWishlist,
            onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
        });
};
    
export const useRemoveFromWishlist = () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: removeFromWishlist,
            onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
        });
};
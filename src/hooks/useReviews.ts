import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchReviews, addOrUpdateReview, deleteReview } from '../api/reviewsApi';
import { AddReviewRequest } from '../types/review';

export const useReviews = (idCourse: number) =>
  useQuery({
    queryKey: ['reviews', idCourse],
    queryFn: () => fetchReviews(idCourse),
  });

export const useAddReview = (idCourse: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddReviewRequest) => addOrUpdateReview(idCourse, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', idCourse] });
      queryClient.invalidateQueries({ queryKey: ['course', idCourse] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useDeleteReview = (idCourse: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteReview(idCourse),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', idCourse] });
      queryClient.invalidateQueries({ queryKey: ['course', idCourse] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

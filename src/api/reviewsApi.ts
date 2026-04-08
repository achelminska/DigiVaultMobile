import { authRequest } from './config';
import { Review, AddReviewRequest } from '../types/review';

export const fetchReviews = (idCourse: number): Promise<Review[]> =>
  authRequest<Review[]>(`/api/courses/${idCourse}/reviews`);

export const addOrUpdateReview = (idCourse: number, data: AddReviewRequest): Promise<void> =>
  authRequest<void>(`/api/courses/${idCourse}/reviews`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const deleteReview = (idCourse: number): Promise<void> =>
  authRequest<void>(`/api/courses/${idCourse}/reviews`, { method: 'DELETE' });

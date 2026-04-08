import { authRequest } from './config';
import { SellerCourse, CreateCourseRequest, UpdateCourseRequest } from '../types/seller';

export interface SellerCoursesResponse {
  items: SellerCourse[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const fetchSellerCourses = (): Promise<SellerCoursesResponse> =>
  authRequest<SellerCoursesResponse>('/api/Seller/courses?page=1&pageSize=100');

export const createCourse = (data: CreateCourseRequest): Promise<{ idCourse: number }> =>
  authRequest<{ idCourse: number }>('/api/Seller/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateCourse = (idCourse: number, data: UpdateCourseRequest): Promise<void> =>
  authRequest<void>(`/api/Seller/courses/${idCourse}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const toggleCourseVisibility = (idCourse: number, isVisible: boolean): Promise<void> =>
  authRequest<void>(`/api/Seller/courses/${idCourse}/visibility`, {
    method: 'PATCH',
    body: JSON.stringify({ isVisible }),
  });

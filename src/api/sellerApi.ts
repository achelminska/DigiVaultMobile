import { authRequest } from './config';
import { SellerCourse, CreateCourseRequest, UpdateCourseRequest, SellerCoursesResponse } from '../types/seller';


export const fetchSellerCourses = async (): Promise<SellerCoursesResponse> => {
  const data = await authRequest<SellerCoursesResponse | SellerCourse[]>('/api/seller/courses?page=1&pageSize=100');
  if (Array.isArray(data)) {
    return { items: data, total: data.length, page: 1, pageSize: 100, totalPages: 1 };
  }
  return data;
};

export const createCourse = (data: CreateCourseRequest): Promise<{ idCourse: number }> =>
  authRequest<{ idCourse: number }>('/api/seller/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateCourse = (idCourse: number, data: UpdateCourseRequest): Promise<void> =>
  authRequest<void>(`/api/seller/courses/${idCourse}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const toggleCourseVisibility = (idCourse: number, isVisible: boolean): Promise<void> =>
  authRequest<void>(`/api/seller/courses/${idCourse}/visibility`, {
    method: 'PATCH',
    body: JSON.stringify({ isVisible }),
  });

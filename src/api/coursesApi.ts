import { request, authRequest } from './config';
import { Course, Category } from '../types/course';

export const fetchPopularCourses = (): Promise<Course[]> =>
  request<Course[]>('/api/courses/popular');

export const fetchNewestCourses = (): Promise<Course[]> =>
  request<Course[]>('/api/courses/newest');

export const fetchTopRatedCourses = (): Promise<Course[]> =>
  request<Course[]>('/api/courses/top-rated');

export const fetchCategories = (): Promise<Category[]> =>
  request<Category[]>('/api/categories');

export const fetchCourseSearch = (params: {
  search?: string;
  idCategory?: number;
  sortBy?: string;
}): Promise<Course[]> => {
  const query = new URLSearchParams();
  if (params.search)      query.set('search',      params.search);
  if (params.idCategory)  query.set('idCategory',  params.idCategory.toString());
  if (params.sortBy)      query.set('sortBy',       params.sortBy);
  return request<Course[]>(`/api/courses?${query.toString()}`);
};

export const fetchPurchasedCourses = (): Promise<Course[]> =>
  authRequest<Course[]>('/api/courses/purchased');

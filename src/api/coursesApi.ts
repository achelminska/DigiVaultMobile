import { Course, Category } from '../types/course';
import { BASE_URL } from '../config/constants';

export const fetchPopularCourses = async (): Promise<Course[]> => {
  const response = await fetch(`${BASE_URL}/api/courses/popular`);
  if (!response.ok) throw new Error('Failed to fetch popular courses');
  return response.json();
};

export const fetchNewestCourses = async (): Promise<Course[]> => {
  const response = await fetch(`${BASE_URL}/api/courses/newest`);
  if (!response.ok) throw new Error('Failed to fetch newest courses');
  return response.json();
};

export const fetchTopRatedCourses = async (): Promise<Course[]> => {
  const response = await fetch(`${BASE_URL}/api/courses/top-rated`);
  if (!response.ok) throw new Error('Failed to fetch top rated courses');
  return response.json();
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${BASE_URL}/api/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};
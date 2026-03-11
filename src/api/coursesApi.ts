import { Platform } from 'react-native';

export const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:5052'
  : 'http://localhost:5052';

export interface Course {
  idCourse: number;
  title: string;
  authorName: string;
  averageRating: number;
  ratingsCount: number;
  price: number;
  imageUrl?: string;
}

export interface Category {
  idCategory: number;
  name: string;
}

export const fetchPopularCourses = async (): Promise<Course[]> => {
  const response = await fetch(`${BASE_URL}/api/courses/popular`);
  if (!response.ok) throw new Error('Błąd pobierania popularnych kursów');
  return response.json();
};

export const fetchNewestCourses = async (): Promise<Course[]> => {
  const response = await fetch(`${BASE_URL}/api/courses/newest`);
  if (!response.ok) throw new Error('Błąd pobierania najnowszych kursów');
  return response.json();
};

export const fetchTopRatedCourses = async (): Promise<Course[]> => {
  const response = await fetch(`${BASE_URL}/api/courses/top-rated`);
  if (!response.ok) throw new Error('Błąd pobierania najwyżej ocenianych kursów');
  return response.json();
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${BASE_URL}/api/categories`);
  if (!response.ok) throw new Error('Błąd pobierania kategorii');
  return response.json();
};
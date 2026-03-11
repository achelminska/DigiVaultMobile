import { useQuery } from '@tanstack/react-query';
import {
  fetchPopularCourses,
  fetchNewestCourses,
  fetchTopRatedCourses,
  fetchCategories,
} from '../api/coursesApi';

export const usePopularCourses = () =>
  useQuery({
    queryKey: ['courses', 'popular'],
    queryFn: fetchPopularCourses,
  });

export const useNewestCourses = () =>
  useQuery({
    queryKey: ['courses', 'newest'],
    queryFn: fetchNewestCourses,
  });

export const useTopRatedCourses = () =>
  useQuery({
    queryKey: ['courses', 'top-rated'],
    queryFn: fetchTopRatedCourses,
  });

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

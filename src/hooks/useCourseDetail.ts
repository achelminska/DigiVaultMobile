import { useQuery } from '@tanstack/react-query';
import { fetchCourseById } from '../api/courseDetailApi';

export const useCourseDetail = (idCourse: number) =>
  useQuery({
    queryKey: ['course', idCourse],
    queryFn: () => fetchCourseById(idCourse),
    enabled: !!idCourse,
  });

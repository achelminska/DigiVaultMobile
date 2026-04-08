import { request } from './config';
import { CourseDetail } from '../types/courseDetail';

export const fetchCourseById = (idCourse: number): Promise<CourseDetail> =>
  request<CourseDetail>(`/api/courses/${idCourse}`);

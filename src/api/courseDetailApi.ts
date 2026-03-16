import { BASE_URL } from '../config/constants';
import { CourseDetail } from '../types/courseDetail';

export const fetchCourseById = async (idCourse: number): Promise<CourseDetail> => {
  const response = await fetch(`${BASE_URL}/api/courses/${idCourse}`);
  if (!response.ok) throw new Error('Course not found');
  return response.json();
};
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchSellerCourses,
  createCourse,
  updateCourse,
  toggleCourseVisibility,
} from '../api/sellerApi';
import { CreateCourseRequest, UpdateCourseRequest } from '../types/seller';

export const useSellerCourses = () =>
  useQuery({
    queryKey: ['sellerCourses'],
    queryFn: fetchSellerCourses,
  });

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCourseRequest) => createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerCourses'] });
    },
  });
};

export const useUpdateCourse = (idCourse: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCourseRequest) => updateCourse(idCourse, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerCourses'] });
    },
  });
};

export const useToggleVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ idCourse, isVisible }: { idCourse: number; isVisible: boolean }) =>
      toggleCourseVisibility(idCourse, isVisible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerCourses'] });
    },
  });
};

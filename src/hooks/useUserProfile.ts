import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchUserProfile,
  updateName,
  updateEmail,
  updatePassword,
} from '../api/userApi';

export const useUserProfile = () =>
  useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000,
  });

export const useUpdateName = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateName,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useUpdateEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEmail,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userProfile'] }),
  });
};

export const useUpdatePassword = () =>
  useMutation({ mutationFn: updatePassword });

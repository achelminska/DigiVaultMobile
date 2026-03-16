import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../api/authApi';

export const useLogin = (onSuccess: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      await AsyncStorage.setItem('token', data.token);
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      onSuccess();
    },
  });
};
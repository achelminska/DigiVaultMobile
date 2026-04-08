import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/authApi';
import { RegisterRequest } from '../types/auth';

export const useRegister = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (data: RegisterRequest) => registerUser(data),
    onSuccess,
  });

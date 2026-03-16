import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../types/auth';

export const useCurrentUser = () => {
  const { data: firstName = null } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return null;
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.FirstName ?? decoded.Login ?? null;
    },
    staleTime: Infinity,
  });

  return { firstName };
};

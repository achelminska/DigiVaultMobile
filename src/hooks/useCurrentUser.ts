import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../types/auth';

export const useCurrentUser = () => {
  const { data } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return null;
      const decoded = jwtDecode<JwtPayload>(token);
      return {
        idUser: decoded.IdUser ? parseInt(decoded.IdUser, 10) : null,
        firstName: decoded.FirstName ?? decoded.Login ?? null,
        lastName: decoded.LastName ?? null,
      };
    },
    staleTime: Infinity,
  });

  return {
    idUser: data?.idUser ?? null,
    firstName: data?.firstName ?? null,
    lastName: data?.lastName ?? null,
  };
};

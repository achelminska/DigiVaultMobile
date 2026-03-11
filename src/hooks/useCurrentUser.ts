import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../types/course';

export const useCurrentUser = () => {
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode<JwtPayload>(token);
          setFirstName(decoded.FirstName ?? decoded.Login ?? null);
        }
      } catch {
        setFirstName(null);
      }
    };
    loadUser();
  }, []);

  return { firstName };
};

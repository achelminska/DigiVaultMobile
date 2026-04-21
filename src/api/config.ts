import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/constants';

// ── Shared HTTP handler ───────────────────────────────────────────────────────

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  console.log(`[API] ${options.method ?? 'GET'} ${url}`);

  const response = await fetch(url, { ...options, headers });

  const contentLength = response.headers.get('content-length');
  const hasBody = contentLength !== '0' && response.status !== 204;

  if (!hasBody) return {} as T;

  const data = await response.json();

  if (!response.ok) {
    throw data ?? { message: `HTTP ${response.status}` };
  }

  return data;
}

export async function authRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await AsyncStorage.getItem('token');
  return request<T>(endpoint, {
    ...options,
    headers: {
      ...(options.headers as Record<string, string>),
      'Authorization': `Bearer ${token}`,
    },
  });
}

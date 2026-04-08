import { authRequest } from './config';

export const addReport = (idCourse: number, reason: string): Promise<void> =>
  authRequest<void>('/api/reports', {
    method: 'POST',
    body: JSON.stringify({ idCourse, reason }),
  });

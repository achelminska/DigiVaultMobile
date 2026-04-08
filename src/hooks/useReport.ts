import { useMutation } from '@tanstack/react-query';
import { addReport } from '../api/reportsApi';

export const useAddReport = (idCourse: number) =>
  useMutation({
    mutationFn: (reason: string) => addReport(idCourse, reason),
  });

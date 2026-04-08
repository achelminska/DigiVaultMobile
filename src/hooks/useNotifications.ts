import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications, markAsRead } from '../api/notificationsApi';

export const useNotifications = () =>
  useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idNotification: number) => markAsRead(idNotification),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

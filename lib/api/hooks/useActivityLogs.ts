import { useQuery } from '@tanstack/react-query';
import { activityLogService } from '../services/activityLog.service';
import type { ActivityLogsParams } from '@/types/api';

export const useActivityLogs = (params?: ActivityLogsParams) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['activity-logs', params],
    queryFn: () => activityLogService.getActivityLogs(params),
    staleTime: 30 * 1000, // 30 seconds
  });

  return {
    entries: data?.data ?? [],
    meta: data?.meta,
    links: data?.links,
    isLoading,
    error,
    refetch,
  };
};

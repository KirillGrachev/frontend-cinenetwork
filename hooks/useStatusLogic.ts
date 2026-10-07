
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { statusService } from '../services/apiService';
import { useLocale } from '../context/LocaleContext';
import { ServiceStatus } from '../types';

export const useStatusLogic = () => {
  const { t } = useLocale();
  
  // Use React Query for SWR
  // Refetch every 30 seconds to keep status updated
  const { data: statusGroups, isLoading: queryLoading, isPending, error } = useQuery({
      queryKey: ['systemStatus'],
      queryFn: statusService.getSystemStatus,
      refetchInterval: 30000, 
      staleTime: 10000,
  });

  const isLoading = queryLoading || isPending || !statusGroups || statusGroups.length === 0;
  
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  // Translate names dynamically
  const translatedGroups = useMemo(() => {
      if (!statusGroups) return [];
      return statusGroups.map(group => ({
          ...group,
          name: t(group.name),
          services: group.services.map(service => ({
              ...service,
              name: t(service.name)
          }))
      }));
  }, [statusGroups, t]);

  const allOperational = useMemo(() => {
      if (translatedGroups.length === 0) return true;
      return translatedGroups.every(g => g.services.every(s => s.status === ServiceStatus.Operational));
  }, [translatedGroups]);

  const actions = {
      toggleService: (id: string) => {
          setExpandedServiceId(prev => prev === id ? null : id);
      }
  };

  return {
      state: {
          statusGroups: translatedGroups,
          allOperational,
          expandedServiceId,
          isLoading,
          error
      },
      actions
  };
};

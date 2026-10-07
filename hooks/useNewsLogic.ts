
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { newsService } from '../services/apiService';
import { QueryKey } from '../types';

export const useNewsLogic = () => {
  const { data: newsItems, isLoading, error } = useQuery({
    queryKey: [QueryKey.NewsItems],
    queryFn: newsService.getNewsItems,
    staleTime: 1000 * 60 * 2,
  });

  const processedData = useMemo(() => {
      if (!newsItems || newsItems.length === 0) return { featured: null, grid: [] };

      // First item is always featured in our layout logic
      const featured = newsItems[0];
      const grid = newsItems.slice(1);

      return { featured, grid };

  }, [newsItems]);

  return {
      state: {
          isLoading,
          error,
          featuredItem: processedData.featured,
          gridItems: processedData.grid,
          totalItems: newsItems?.length || 0
      },
      actions: {
          setPage: (p: number) => {} // No-op
      }
  };
};

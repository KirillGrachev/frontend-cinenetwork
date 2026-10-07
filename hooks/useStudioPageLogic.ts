
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { animeService } from '../services/apiService';

export const useStudioPageLogic = (studioName: string) => {
  const { data: animeList, isLoading, error, isPlaceholderData } = useQuery({
    queryKey: ['studioAnime', studioName],
    queryFn: () => animeService.getStudioAnime(studioName),
    enabled: !!studioName,
    placeholderData: keepPreviousData
  });

  return {
      state: {
          studioName,
          animeList: animeList || [],
          isLoading: isLoading && !isPlaceholderData,
          error
      }
  };
};

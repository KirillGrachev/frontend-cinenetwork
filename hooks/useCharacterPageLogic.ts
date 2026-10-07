import { useQuery } from '@tanstack/react-query';
import { animeService } from '../services/apiService';
import { QueryKey } from '../types';

export const useCharacterPageLogic = (id: number) => {
  const { data: character, isLoading, error } = useQuery({
    queryKey: ['characterDetails', id],
    queryFn: () => animeService.getCharacterDetails(id),
    enabled: !!id,
  });

  return {
      state: {
          character,
          isLoading,
          error
      }
  };
};
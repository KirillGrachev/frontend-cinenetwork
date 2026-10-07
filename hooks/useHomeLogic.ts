import { useQuery } from '@tanstack/react-query';
import { animeService } from '../services/apiService';
import { QueryKey } from '../types';

export const useHomeLogic = () => {
  const { data: homeData, isLoading, error } = useQuery({
    queryKey: [QueryKey.HomeData],
    queryFn: () => Promise.all([
      animeService.getFeaturedAnime(),
      animeService.getNewReleases(),
      animeService.getTrendingAnime(),
      animeService.getHomeBanners(),
    ]),
    staleTime: 1000 * 60 * 5, /** Cache home page data for 5 minutes */
  });

  const [featured, newReleases, trending, banners] = homeData || [null, [], [], []];

  return {
      state: {
          isLoading,
          error,
          featured,
          newReleases,
          trending,
          banners
      }
  };
};
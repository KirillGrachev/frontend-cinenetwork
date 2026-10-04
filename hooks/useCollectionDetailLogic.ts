import { useQuery } from '@tanstack/react-query';
import { collectionService } from '../services/apiService';
import { QueryKey } from '../types';

export const useCollectionDetailLogic = (id: number) => {
    const {
        data: collection,
        isLoading: isCollectionLoading,
        error: collectionError,
    } = useQuery({
        queryKey: [QueryKey.Collection, id],
        queryFn: () => collectionService.getCollectionById(id),
        enabled: !!id,
    });

    const {
        data: animeList,
        isLoading: isAnimeLoading,
        error: animeError,
    } = useQuery({
        queryKey: [QueryKey.CollectionAnime, id],
        queryFn: () => collectionService.getAnimeByCollectionId(id),
        enabled: !!id,
    });

    const isLoading = isCollectionLoading || isAnimeLoading;
    const error = collectionError || animeError;

    return {
        state: {
            collection,
            animeList: animeList || [],
            isLoading,
            error,
        },
    };
};

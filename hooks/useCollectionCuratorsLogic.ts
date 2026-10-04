import { useQuery } from '@tanstack/react-query';
import { collectionService } from '../services/apiService';
import { QueryKey } from '../types';

export const useCollectionCuratorsLogic = (id: number) => {
    const { data: collection, isLoading: isCollectionLoading } = useQuery({
        queryKey: [QueryKey.Collection, id],
        queryFn: () => collectionService.getCollectionById(id),
        enabled: !!id,
    });

    const {
        data: curators,
        isLoading: isCuratorsLoading,
        error,
    } = useQuery({
        queryKey: [QueryKey.CollectionCurators, id],
        queryFn: () => collectionService.getCuratorsByCollectionId(id),
        enabled: !!id,
    });

    return {
        state: {
            collection,
            curators: curators || [],
            isLoading: isCollectionLoading || isCuratorsLoading,
            error,
        },
    };
};

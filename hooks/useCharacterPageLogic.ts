import { useQuery } from '@tanstack/react-query';
import { animeService } from '../services/apiService';

export const useCharacterPageLogic = (id: number) => {
    const {
        data: character,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['characterDetails', id],
        queryFn: () => animeService.getCharacterDetails(id),
        enabled: !!id,
    });

    return {
        state: {
            character,
            isLoading,
            error,
        },
    };
};

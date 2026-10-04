import { useState, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { adminService } from '../services/apiService';
import { useLocale } from '../context/LocaleContext';
import { formatRelativeTime } from '../utils/datetime';
import type { ActivityType } from '../types';
import { FILTER_ALL } from '../types';

export const useActivityLogLogic = () => {
    const { t, locale } = useLocale();
    const [filterType, setFilterType] = useState<typeof FILTER_ALL | ActivityType>(FILTER_ALL);
    const [searchUser, setSearchUser] = useState('');

    const {
        data: logs = [],
        isLoading,
        isPlaceholderData,
    } = useQuery({
        queryKey: ['adminActivityLog', filterType, searchUser],
        queryFn: adminService.getActivityLog,
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
    });

    // Translate keys and format timestamps; entries carry ISO time and
    // description keys with an optional {id} placeholder.
    const visibleLogs = useMemo(() => {
        return logs
            .map((log) => ({
                ...log,
                description: t(log.description, { id: log.id }),
                time: formatRelativeTime(log.time, locale),
            }))
            .filter((log) => {
                if (filterType !== FILTER_ALL && log.type !== filterType) return false;
                if (searchUser && !log.user.toLowerCase().includes(searchUser.toLowerCase()))
                    return false;
                return true;
            });
    }, [logs, filterType, searchUser, t, locale]);

    // Actions
    const actions = {
        setFilterType,
        setSearchUser,
    };

    return {
        state: {
            isLoading: isLoading && !isPlaceholderData,
            visibleLogs,
            filterType,
            searchUser,
        },
        actions,
    };
};

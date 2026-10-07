
import { useState, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { adminService } from '../services/apiService';
import { useLocale } from '../context/LocaleContext';
import { ActivityType, FILTER_ALL } from '../types';

export interface LogEntry {
    id: number;
    action: string;
    description: string;
    user: string;
    time: string;
    type: ActivityType;
    ip: string;
}

export const useActivityLogLogic = (itemsPerPage: number = 12) => {
    const { t } = useLocale();
    const [currentPage, setCurrentPage] = useState(1);
    const [filterType, setFilterType] = useState<typeof FILTER_ALL | ActivityType>(FILTER_ALL);
    const [searchUser, setSearchUser] = useState('');

    const { data: logs = [], isLoading, isPlaceholderData } = useQuery({
        queryKey: ['adminActivityLog', filterType, searchUser, currentPage],
        queryFn: adminService.getActivityLog,
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData
    });

    // Translate and Filter (Simulating backend behavior)
    const visibleLogs = useMemo(() => {
        return logs.map(log => ({
            ...log,
            description: t(log.description), // Translate description key
            time: log.time.includes('.') ? t(log.time, { count: 5 }) : log.time
        })).filter(log => {
            if (filterType !== FILTER_ALL && log.type !== filterType) return false;
            if (searchUser && !log.user.toLowerCase().includes(searchUser.toLowerCase())) return false;
            return true;
        });
    }, [logs, filterType, searchUser, t]);

    // Actions
    const actions = {
        setPage: setCurrentPage,
        setFilterType: (type: typeof FILTER_ALL | ActivityType) => {
            setFilterType(type);
            setCurrentPage(1);
        },
        setSearchUser: (user: string) => {
            setSearchUser(user);
            setCurrentPage(1);
        }
    };

    return {
        state: {
            isLoading: isLoading && !isPlaceholderData,
            visibleLogs, 
            totalPages: 1, 
            currentPage,
            filterType,
            searchUser
        },
        actions
    };
};

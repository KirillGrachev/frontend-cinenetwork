import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { adminService } from '../services/apiService';
import { AdminPeriod } from '../types';
import type { ActivityLogItem, Transaction } from '../types/admin';
import { useLocale } from '../context/LocaleContext';
import { formatRelativeTime } from '../utils/datetime';

export const useAdminStats = () => {
    const { t, locale } = useLocale();
    const [activePeriod, setActivePeriod] = useState<AdminPeriod>(AdminPeriod.Day7);

    const { data, isLoading, isPlaceholderData } = useQuery({
        queryKey: ['adminStats', activePeriod],
        queryFn: () => adminService.getStats(activePeriod),
        staleTime: 1000 * 60 * 5, // 5 minutes
        placeholderData: keepPreviousData, // SWR: Show previous period data while fetching new one
    });

    /**
     * Transactions/activity carry ISO timestamps and i18n plan keys;
     * presentation-ready values are derived here (single formatting place).
     */
    const translateTransactions = (txs: Transaction[]) =>
        txs.map((tx) => ({
            ...tx,
            plan: t(tx.plan),
            date: formatRelativeTime(tx.date, locale),
        }));

    const translateActivity = (logs: ActivityLogItem[]) =>
        logs.map((log) => ({
            ...log,
            time: formatRelativeTime(log.time, locale),
        }));

    return {
        state: {
            isLoading: isLoading && !isPlaceholderData, // Only show spinner on initial load
            metrics: data?.metrics || [],
            trafficHistory: data?.trafficHistory || [],
            contentDistribution:
                data?.contentDistribution?.map((c) => ({ ...c, label: t(c.label) })) || [],
            transactions: translateTransactions(data?.transactions || []),
            topContent: data?.topContent || [],
            activityLog: translateActivity(data?.activityLog || []),
            platformStats: data?.platformStats || { media: 0, encoding: 0, cdn: 0, streams: 0 },
            activePeriod,
        },
        actions: {
            setActivePeriod,
        },
    };
};

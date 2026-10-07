
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { adminService } from '../services/apiService';
import { Trend, TransactionStatus, ActivityType, AdminPeriod, AnimeType } from '../types';
import { useLocale } from '../context/LocaleContext';

export interface StatMetric {
    id: string;
    label: string;
    value: number; 
    change: string;
    trend: Trend;
    icon: string;
    color: string;
}

export interface ActivityLogItem {
    id: number;
    action: string;
    user: string;
    time: string;
    type: ActivityType;
}

export interface Transaction {
    id: string;
    user: string;
    plan: string;
    amount: string;
    status: TransactionStatus;
    date: string;
}

export interface TopContent {
    id: number;
    title: string;
    views: number;
    rating: number;
    image: string;
    type: AnimeType;
}

export const useAdminStats = () => {
    const { t } = useLocale();
    const [activePeriod, setActivePeriod] = useState<AdminPeriod>(AdminPeriod.Day7);

    const { data, isLoading, isPlaceholderData } = useQuery({
        queryKey: ['adminStats', activePeriod],
        queryFn: () => adminService.getStats(activePeriod),
        staleTime: 1000 * 60 * 5, // 5 minutes
        placeholderData: keepPreviousData // SWR: Show previous period data while fetching new one
    });

    // Helper to translate dynamic keys from service
    const translateTransactions = (txs: Transaction[]) => txs.map(tx => ({
        ...tx,
        plan: t(tx.plan),
        date: tx.date.includes('.') ? t(tx.date, { count: 5 }) : tx.date // Mock translation logic
    }));

    const translateActivity = (logs: ActivityLogItem[]) => logs.map(log => ({
        ...log,
        time: log.time.includes('.') ? t(log.time, { count: 5 }) : log.time
    }));

    return {
        state: {
            isLoading: isLoading && !isPlaceholderData, // Only show spinner on initial load
            metrics: data?.metrics || [],
            trafficHistory: data?.trafficHistory || [],
            contentDistribution: data?.contentDistribution?.map(c => ({ ...c, label: t(c.label) })) || [],
            transactions: translateTransactions(data?.transactions || []),
            topContent: data?.topContent || [],
            activityLog: translateActivity(data?.activityLog || []),
            serverStats: data?.serverStats || { cpu: 0, ram: 0, storage: 0, net: 0 },
            activePeriod
        },
        actions: {
            setActivePeriod
        }
    };
};

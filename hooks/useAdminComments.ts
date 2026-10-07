
import { useMemo, useState } from 'react';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { adminService } from '../services/apiService';
import { CommentStatus, FlagReason, FILTER_ALL } from '../types';
import { useLocale } from '../context/LocaleContext';

export interface TicketMessage {
    id: string;
    sender: 'user' | 'admin';
    content: string;
    timestamp: string;
}

export interface Comment {
    id: string;
    userId: string;
    username: string;
    avatar: string | null;
    content: string;
    animeTitle: string; 
    episode?: number;
    time: string;
    status: CommentStatus;
    flagReason: FlagReason | null;
    rating?: number; 
    type: 'comment' | 'review' | 'ticket';
    messages?: TicketMessage[]; 
}

export const useAdminComments = (activeSection: 'comments' | 'reviews' | 'tickets') => {
    const { t } = useLocale();
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState<typeof FILTER_ALL | CommentStatus>(FILTER_ALL);

    const { data: comments = [], isLoading, isPlaceholderData } = useQuery({
        queryKey: ['adminComments', activeSection],
        queryFn: () => adminService.getComments(activeSection),
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData // SWR: Keep old list visible while new section loads
    });

    const translatedComments = useMemo(() => {
        return comments.map(c => ({
            ...c,
            // Translate time if it's a key
            time: c.time.includes('.') ? t(c.time, { count: 2 }) : c.time,
            // Translate messages time
            messages: c.messages?.map(m => ({
                ...m,
                timestamp: m.timestamp.includes('.') ? t(m.timestamp, { count: 2 }) : m.timestamp
            }))
        }));
    }, [comments, t]);

    const filteredComments = useMemo(() => {
        if (filter === FILTER_ALL) return translatedComments;
        return translatedComments.filter(c => c.status === filter);
    }, [translatedComments, filter]);

    const updateCache = (updater: (list: Comment[]) => Comment[]) => {
        queryClient.setQueryData(['adminComments', activeSection], (oldData: Comment[] | undefined) => {
            return oldData ? updater(oldData) : [];
        });
    };

    const actions = {
        setFilter,
        approveComment: (id: string) => {
            updateCache(list => list.map(c => c.id === id ? { ...c, status: CommentStatus.Approved } : c));
        },
        rejectComment: (id: string) => {
            updateCache(list => list.map(c => c.id === id ? { ...c, status: CommentStatus.Rejected } : c));
        },
        updateTicket: (ticket: Comment) => {
            updateCache(list => list.map(c => c.id === ticket.id ? ticket : c));
        }
    };

    return {
        comments: filteredComments,
        isLoading: isLoading && !isPlaceholderData,
        filter,
        setFilter: actions.setFilter,
        approveComment: actions.approveComment,
        rejectComment: actions.rejectComment,
        updateTicket: actions.updateTicket
    };
};


import { useState, useMemo } from 'react';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { adminService } from '../services/apiService';
import { useLocale } from '../context/LocaleContext';
import { useToast } from '../context/ToastContext';
import { AdminUser, UserRole, UserStatus, FILTER_ALL, ToastType } from '../types';

export const useAdminUsers = (itemsPerPage: number = 10) => {
    const { t } = useLocale();
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<typeof FILTER_ALL | UserRole | 'banned'>(FILTER_ALL);
    const [currentPage, setCurrentPage] = useState(1);

    const { data: users = [], isLoading, isPlaceholderData } = useQuery({
        queryKey: ['adminUsers', searchQuery, roleFilter], // SWR: Key changes on filter change
        queryFn: adminService.getUsers,
        staleTime: 1000 * 60 * 10,
        placeholderData: keepPreviousData
    });

    const filteredUsers = useMemo(() => {
        // Client-side filtering simulation (in real app, params go to queryFn)
        return users.filter(user => {
            const matchesSearch = 
                user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (!matchesSearch) return false;

            if (roleFilter === FILTER_ALL) return true;
            if (roleFilter === 'banned') return user.status === UserStatus.Banned;
            return user.role === roleFilter && user.status !== UserStatus.Banned;
        });
    }, [users, searchQuery, roleFilter]);

    // Optimistic Update Helper
    const updateCache = (updater: (users: AdminUser[]) => AdminUser[]) => {
        queryClient.setQueryData(['adminUsers', searchQuery, roleFilter], (oldData: AdminUser[] | undefined) => {
            return oldData ? updater(oldData) : [];
        });
    };

    const actions = {
        setSearchQuery: (q: string) => { setSearchQuery(q); setCurrentPage(1); },
        setRoleFilter: (f: typeof roleFilter) => { setRoleFilter(f); setCurrentPage(1); },
        setPage: setCurrentPage,
        
        updateUserRole: (id: string, newRole: UserRole) => {
            updateCache(list => list.map(u => u.id === id ? { ...u, role: newRole } : u));
            showToast(t('admin.users.toasts.roleUpdated'), ToastType.Success);
        },
        
        banUser: (id: string) => {
            updateCache(list => list.map(u => u.id === id ? { ...u, status: UserStatus.Banned, banReason: "Admin action" } : u));
            showToast(t('admin.users.toasts.userBanned'), ToastType.Warning);
        },

        unbanUser: (id: string) => {
            updateCache(list => list.map(u => u.id === id ? { ...u, status: UserStatus.Active, banReason: undefined } : u));
            showToast(t('admin.users.toasts.userUnbanned'), ToastType.Success);
        },

        deleteUser: (id: string) => {
            updateCache(list => list.filter(u => u.id !== id));
            showToast(t('admin.users.toasts.userDeleted'), ToastType.Error);
        }
    };

    return {
        state: {
            isLoading: isLoading && !isPlaceholderData,
            users: filteredUsers,
            totalPages: 1, 
            currentPage,
            searchQuery,
            roleFilter
        },
        actions
    };
};

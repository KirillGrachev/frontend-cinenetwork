
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { TableVirtuoso } from 'react-virtuoso';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import Input from '../ui/Input';
import UserRow from './users/UserRow';
import UserModal from './users/UserModal';
import { useLocale } from '../../context/LocaleContext';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import { AppRoute, FILTER_ALL, UserRole, AdminUser } from '../../types';

import UsersTableSkeleton from '../skeletons/UsersTableSkeleton';

const Users: React.FC = () => {
    const { t } = useLocale();
    const navigate = useNavigate();
    const { state, actions } = useAdminUsers(10);
    const { isLoading, users, searchQuery, roleFilter } = state;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [modalMode, setModalMode] = useState<'edit' | 'ban' | 'delete'>('edit');

    const openModal = (user: AdminUser, mode: 'edit' | 'ban' | 'delete') => {
        setSelectedUser(user);
        setModalMode(mode);
        setIsModalOpen(true);
    };

    const filters = [
        { id: FILTER_ALL, label: t('admin.users.filters.all'), icon: 'fa-solid fa-users' },
        { id: UserRole.Admin, label: t('admin.users.filters.admin'), icon: 'fa-solid fa-shield-halved' },
        { id: UserRole.Moderator, label: t('admin.users.filters.moderator'), icon: 'fa-solid fa-gavel' },
        { id: UserRole.User, label: t('admin.users.filters.user'), icon: 'fa-solid fa-user' },
        { id: 'banned', label: t('admin.users.filters.banned'), icon: 'fa-solid fa-ban' },
    ];

    const currentFilterIndex = filters.findIndex(f => f.id === roleFilter);
    const currentFilter = filters[currentFilterIndex] || filters[0];

    const handleCycleFilter = () => {
        const nextIndex = (currentFilterIndex + 1) % filters.length;
        actions.setRoleFilter(filters[nextIndex].id as Parameters<typeof actions.setRoleFilter>[0]);
    };

    if (isLoading) {
        return <UsersTableSkeleton />;
    }

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-8 h-full flex flex-col">
                
                <div className="mb-8 animate-fade-in">
                    <Button 
                        variant="ghost" 
                        size="md" 
                        icon="fa-solid fa-arrow-left" 
                        onClick={() => navigate(AppRoute.AdminStats)}
                        className="pl-0 hover:!bg-transparent hover:text-white"
                    >
                        {t('admin.title')}
                    </Button>
                </div>

                <PageHeader
                    title={t('admin.users.title')}
                    description={t('admin.users.description')}
                    className="!mb-8"
                />

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in stagger-1 items-center">
                    <div className="w-full md:flex-1">
                        <Input 
                            placeholder={t('admin.users.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => actions.setSearchQuery(e.target.value)}
                            rightIcon="fa-solid fa-magnifying-glass"
                            className="bg-panel-primary border-border-light"
                        />
                    </div>
                    
                    <div className="w-full md:w-auto">
                        <Button 
                            variant="black" 
                            size="md" 
                            onClick={handleCycleFilter}
                            className="rounded-xl font-medium min-w-full md:min-w-[220px] group transition-all !px-4"
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                    <i className={`${currentFilter.icon} text-gray-400 group-hover:text-black transition-colors`}></i>
                                    <span>{currentFilter.label}</span>
                                </div>
                                <div className="bg-white/10 rounded-full w-6 h-6 flex items-center justify-center ml-3 group-hover:bg-black/10 transition-colors">
                                    <i className="fa-solid fa-rotate text-[10px] text-gray-400 group-hover:text-black transition-colors"></i>
                                </div>
                            </div>
                        </Button>
                    </div>
                </div>

                {/* Virtualized Table Container */}
                <div className="bg-panel-primary border border-border-medium rounded-3xl overflow-hidden shadow-xl animate-fade-in stagger-2 flex-1 min-h-[600px] flex flex-col">
                    {users.length > 0 ? (
                        <TableVirtuoso
                            useWindowScroll
                            data={users}
                            style={{ height: 600 }}
                            components={{
                                Table: (props) => <table {...props} className="w-full text-left" />,
                                TableHead: React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>((props, ref) => <thead {...props} ref={ref} className="bg-white/5 text-[10px] uppercase font-bold text-gray-500 tracking-wider" />),
                                TableBody: React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>((props, ref) => <tbody {...props} ref={ref} className="divide-y divide-border-light" />),
                            }}
                            fixedHeaderContent={() => (
                                <tr>
                                    <th className="px-6 py-4 bg-panel-primary border-b border-border-light">{t('admin.users.table.user')}</th>
                                    <th className="px-6 py-4 bg-panel-primary border-b border-border-light">{t('admin.users.table.role')}</th>
                                    <th className="px-6 py-4 bg-panel-primary border-b border-border-light">{t('admin.users.table.status')}</th>
                                    <th className="px-6 py-4 bg-panel-primary border-b border-border-light">{t('admin.users.table.joined')}</th>
                                    <th className="px-6 py-4 bg-panel-primary border-b border-border-light text-right">{t('admin.users.table.actions')}</th>
                                </tr>
                            )}
                            itemContent={(index, user) => (
                                <UserRow 
                                    user={user} 
                                    onEdit={(u) => openModal(u, 'edit')}
                                    onBan={(u) => openModal(u, 'ban')}
                                    onDelete={(u) => openModal(u, 'delete')}
                                />
                            )}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500 p-20">
                            {t('search.noResults')}
                        </div>
                    )}
                </div>

                {isModalOpen && (
                    <UserModal 
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        user={selectedUser}
                        mode={modalMode}
                        onSaveRole={actions.updateUserRole}
                        onSaveBan={actions.banUser}
                        onUnban={actions.unbanUser}
                        onDelete={actions.deleteUser}
                    />
                )}

            </div>
        </div>
    );
};

export default Users;

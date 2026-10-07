
import React from 'react';
import { AdminUser, UserRole, UserStatus } from '../../../types';
import { useLocale } from '../../../context/LocaleContext';

interface UserRowProps {
    user: AdminUser;
    onEdit: (user: AdminUser) => void;
    onBan: (user: AdminUser) => void;
    onDelete: (user: AdminUser) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onEdit, onBan, onDelete }) => {
    const { t } = useLocale();

    const getRoleBadge = (role: UserRole) => {
        switch (role) {
            case UserRole.Admin:
                return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case UserRole.Moderator:
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default:
                return 'bg-white/5 text-gray-400 border-white/10';
        }
    };

    const getStatusBadge = (status: UserStatus) => {
        // Both statuses now use simple text classes for perfect alignment
        return status === UserStatus.Active 
            ? 'text-green-500' 
            : 'text-red-500';
    };

    return (
        <tr className="hover:bg-white/5 transition-colors group">
            <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-item-primary flex items-center justify-center overflow-hidden  flex-shrink-0">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-500 font-bold text-lg">{user.username.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white truncate">{user.username}</h4>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                </div>
            </td>
            
            <td className="px-6 py-4">
                {/* CHANGED: rounded-lg -> rounded-full */}
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleBadge(user.role)}`}>
                    {t(`admin.users.roles.${user.role}`)}
                </span>
            </td>

            <td className="px-6 py-4">
                <span className={`text-xs ${getStatusBadge(user.status)}`}>
                    {t(`admin.users.status.${user.status}`)}
                </span>
            </td>

            <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                {user.joinDate}
            </td>

            <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    {/* CHANGED: rounded-lg -> rounded-xl for all action buttons */}
                    <button 
                        onClick={() => onEdit(user)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        title={t('admin.users.actions.edit')}
                    >
                        <i className="fa-solid fa-pen text-xs"></i>
                    </button>
                    
                    <button 
                        onClick={() => onBan(user)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                            user.status === UserStatus.Banned 
                            ? 'text-green-500 hover:bg-green-500/10' 
                            : 'text-orange-500 hover:bg-orange-500/10'
                        }`}
                        title={user.status === UserStatus.Banned ? t('admin.users.actions.unban') : t('admin.users.actions.ban')}
                    >
                        <i className={`fa-solid ${user.status === UserStatus.Banned ? 'fa-lock-open' : 'fa-gavel'} text-xs`}></i>
                    </button>

                    <button 
                        onClick={() => onDelete(user)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors"
                        title={t('admin.users.actions.delete')}
                    >
                        <i className="fa-solid fa-trash text-xs"></i>
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default UserRow;

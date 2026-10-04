import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTitle } from '@headlessui/react';
import BaseModal from '../../ui/BaseModal';
import Button from '../../ui/Button';
import Select from '../../ui/Select';
import Input from '../../ui/Input';
import type { AdminUser } from '../../../types';
import { UserRole, UserStatus, BanDuration } from '../../../types';
import { useLocale } from '../../../context/LocaleContext';
import type { AdminUserEditValues, AdminUserBanValues } from '../../../utils/validationSchemas';
import {
    createAdminUserEditSchema,
    createAdminUserBanSchema,
} from '../../../utils/validationSchemas';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: AdminUser | null;
    mode: 'edit' | 'ban' | 'delete';
    onSaveRole: (id: string, role: UserRole) => void;
    onSaveBan: (id: string) => void;
    onUnban: (id: string) => void;
    onDelete: (id: string) => void;
}

const UserModal: React.FC<UserModalProps> = ({
    isOpen,
    onClose,
    user,
    mode,
    onSaveRole,
    onSaveBan,
    onUnban,
    onDelete,
}) => {
    const { t } = useLocale();

    // Schemas
    const editSchema = createAdminUserEditSchema();
    const banSchema = createAdminUserBanSchema(t);

    // Form setup for Edit Mode
    const {
        control: editControl,
        handleSubmit: handleEditSubmit,
        reset: resetEdit,
    } = useForm<AdminUserEditValues>({
        resolver: zodResolver(editSchema),
        defaultValues: { role: UserRole.User },
    });

    // Form setup for Ban Mode
    const {
        register: registerBan,
        control: banControl,
        handleSubmit: handleBanSubmit,
        reset: resetBan,
        formState: { errors: banErrors },
    } = useForm<AdminUserBanValues>({
        resolver: zodResolver(banSchema),
        defaultValues: { banDuration: BanDuration.Day24, banReason: '' },
    });

    // Reset logic when modal opens
    useEffect(() => {
        if (isOpen && user) {
            if (mode === 'edit') {
                resetEdit({ role: user.role });
            } else if (mode === 'ban') {
                resetBan({ banDuration: BanDuration.Day24, banReason: '' });
            }
        }
    }, [isOpen, user, mode, resetEdit, resetBan]);

    if (!user) return null;

    const onEditValid = (data: AdminUserEditValues) => {
        onSaveRole(user.id, data.role);
        onClose();
    };

    const onBanValid = (_data: AdminUserBanValues) => {
        // TODO(api): send _data.reason / ban duration to the backend once available.
        onSaveBan(user.id);
        onClose();
    };

    const handleConfirmAction = () => {
        if (mode === 'edit') {
            handleEditSubmit(onEditValid)();
        } else if (mode === 'ban') {
            if (user.status === UserStatus.Banned) {
                onUnban(user.id);
                onClose();
            } else {
                handleBanSubmit(onBanValid)();
            }
        } else if (mode === 'delete') {
            onDelete(user.id);
            onClose();
        }
    };

    const roleOptions = Object.values(UserRole).map((r) => ({
        value: r,
        label: t(`admin.users.roles.${r}`),
    }));

    const banOptions = Object.values(BanDuration)
        .filter((d) => d !== BanDuration.None)
        .map((d) => ({
            value: d,
            label: t(`admin.comments.modal.bans.${d}`),
        }));

    const getTitle = () => {
        switch (mode) {
            case 'edit':
                return t('admin.users.modal.editTitle');
            case 'delete':
                return t('admin.users.modal.deleteTitle');
            case 'ban':
                return t('admin.users.modal.banTitle');
            default:
                return '';
        }
    };

    const getConfirmButtonText = () => {
        if (mode === 'edit') return t('admin.users.modal.confirmSave');
        if (mode === 'delete') return t('admin.users.modal.confirmDelete');
        return user.status === UserStatus.Banned
            ? t('admin.users.actions.unban')
            : t('admin.users.modal.confirmBan');
    };

    const isDestructive =
        mode === 'delete' || (mode === 'ban' && user.status === UserStatus.Active);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-sm relative bg-panel-primary border border-border-medium rounded-3xl p-8 shadow-2xl"
        >
            <DialogTitle as="h3" className="text-xl font-bold text-white mb-6 text-left">
                {getTitle()}
            </DialogTitle>

            <div className="flex items-center gap-4 mb-6 bg-white/5 p-4 rounded-xl border border-white/5 text-left">
                <div className="w-10 h-10 rounded-full bg-item-primary flex items-center justify-center font-bold text-gray-500">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                    <div className="text-sm font-bold text-white">{user.username}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                </div>
            </div>

            <div className="space-y-6 mb-8 text-left">
                {mode === 'edit' && (
                    <div>
                        <Controller
                            name="role"
                            control={editControl}
                            render={({ field }) => (
                                <Select
                                    label={t('admin.users.modal.roleLabel')}
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={roleOptions}
                                    variant="solid"
                                />
                            )}
                        />
                    </div>
                )}

                {mode === 'ban' &&
                    (user.status === UserStatus.Active ? (
                        <>
                            <div>
                                <Controller
                                    name="banDuration"
                                    control={banControl}
                                    render={({ field }) => (
                                        <Select
                                            label={t('admin.users.modal.banDurationLabel')}
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={banOptions}
                                            variant="solid"
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                                    {t('admin.users.modal.reasonLabel')}
                                </label>
                                <Input
                                    {...registerBan('banReason')}
                                    placeholder="..."
                                    error={banErrors.banReason?.message}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {t('admin.users.modal.confirmUnbanDescription', {
                                    user: user.username,
                                })}
                            </p>
                            {user.banReason && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide block mb-1">
                                        {t('admin.users.modal.banReasonLabel')}
                                    </span>
                                    <p className="text-sm text-red-200 font-medium">
                                        {user.banReason}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}

                {mode === 'delete' && (
                    <p className="text-gray-300 text-sm leading-relaxed">
                        {t('admin.users.modal.confirmDeleteDescription', { user: user.username })}
                    </p>
                )}
            </div>

            <div className="flex gap-3 w-full justify-center">
                <Button variant="soft" onClick={onClose} className="flex-1 rounded-xl">
                    {t('admin.users.modal.cancel')}
                </Button>
                <Button
                    variant="primary"
                    onClick={handleConfirmAction}
                    className={`flex-[2] rounded-xl ${isDestructive ? '!bg-red-500 !text-white hover:!bg-red-600' : ''}`}
                >
                    {getConfirmButtonText()}
                </Button>
            </div>
        </BaseModal>
    );
};

export default UserModal;

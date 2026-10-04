import React from 'react';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import { useLocale } from '../../context/LocaleContext';

const UsersTableSkeleton: React.FC = () => {
    const { t } = useLocale();

    return (
        <div className="min-h-screen pt-32 pb-20 animate-fade-in">
            <div className="container mx-auto px-4 md:px-8 h-full flex flex-col">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        size="md"
                        icon="fa-solid fa-arrow-left"
                        disabled
                        className="pl-0 opacity-50"
                    >
                        {t('admin.title')}
                    </Button>
                </div>

                <div className="mb-8">
                    <Skeleton className="h-10 w-64 rounded-xl mb-4" />
                    <Skeleton className="h-4 w-96 rounded" />
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
                    <div className="w-full md:flex-1">
                        <Skeleton className="h-12 w-full rounded-2xl" />
                    </div>
                    <div className="w-full md:w-auto">
                        <Skeleton className="h-12 w-full md:w-[220px] rounded-xl" />
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-panel-primary border border-border-medium rounded-3xl overflow-hidden shadow-xl flex-1 min-h-[600px] flex flex-col">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-border-light">
                            <tr>
                                <th className="px-6 py-4">
                                    <Skeleton className="h-4 w-20 rounded" />
                                </th>
                                <th className="px-6 py-4">
                                    <Skeleton className="h-4 w-16 rounded" />
                                </th>
                                <th className="px-6 py-4">
                                    <Skeleton className="h-4 w-20 rounded" />
                                </th>
                                <th className="px-6 py-4">
                                    <Skeleton className="h-4 w-24 rounded" />
                                </th>
                                <th className="px-6 py-4 text-right">
                                    <Skeleton className="h-4 w-16 rounded ml-auto" />
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="w-10 h-10 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-32 rounded" />
                                                <Skeleton className="h-3 w-24 rounded" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-6 w-20 rounded-lg" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-6 w-24 rounded-full" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-20 rounded" />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Skeleton className="w-8 h-8 rounded-full" />
                                            <Skeleton className="w-8 h-8 rounded-full" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersTableSkeleton;

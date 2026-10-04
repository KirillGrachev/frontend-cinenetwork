import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import PageHeader from './ui/PageHeader';
import Button from './ui/Button';
import HistoryClearModal from './history/HistoryClearModal';
import ConfirmationModal from './ui/ConfirmationModal';
import { useLocale } from '../context/LocaleContext';
import { useHistoryLogic } from '../hooks/useHistoryLogic';
import HistoryItemCard from './history/HistoryItemCard';
import { AppRoute } from '../types';
import HistorySkeleton from './skeletons/HistorySkeleton';
const History: React.FC = () => {
    const { t } = useLocale();
    const navigate = useNavigate();
    const { state, actions } = useHistoryLogic();
    const { isLoading, error, visibleItems, isEmpty } = state;
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);

    // State for single item removal confirmation
    const [itemToRemove, setItemToRemove] = useState<string | null>(null);
    const handleRemoveRequest = (id: string) => {
        setItemToRemove(id);
    };
    const confirmRemove = () => {
        if (itemToRemove) {
            actions.removeFromHistory(itemToRemove);
            setItemToRemove(null);
        }
    };
    if (isLoading) {
        return <HistorySkeleton />;
    }
    if (error) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center text-red-500">
                {t('history.loadingError')}
            </div>
        );
    }
    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-8 h-full flex flex-col">
                <PageHeader
                    title={t('history.title')}
                    description={t('history.description')}
                    actions={
                        !isEmpty && (
                            <Button
                                variant="ghost"
                                size="md"
                                icon="fa-regular fa-trash-can"
                                onClick={() => setIsClearModalOpen(true)}
                                className="text-gray-400 hover:!bg-transparent hover:text-red-500 transition-colors"
                            >
                                {t('history.clearHistory')}
                            </Button>
                        )
                    }
                />

                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-[32px] bg-white/5 text-center page-reveal">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5">
                            <i className="fa-solid fa-clock-rotate-left text-3xl text-gray-500"></i>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                            {t('history.emptyTitle')}
                        </h3>
                        <p className="text-gray-400 mb-8 max-w-sm">
                            {t('history.emptyDescription')}
                        </p>
                        <Button onClick={() => navigate(AppRoute.Catalog)}>
                            {t('history.exploreCatalog')}
                        </Button>
                    </div>
                ) : (
                    <div className="flex-1 min-h-[600px] page-reveal">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
                            {visibleItems.map((item, index) => {
                                const content = (
                                    <HistoryItemCard
                                        item={visibleItems[index]}
                                        onRemove={handleRemoveRequest}
                                    />
                                );
                                return (
                                    <div key={item.id} className="w-full">
                                        {content}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Global "Clear All" Modal */}
                {isClearModalOpen && (
                    <HistoryClearModal
                        isOpen={isClearModalOpen}
                        onClose={() => setIsClearModalOpen(false)}
                        onConfirm={actions.clearHistoryByPeriod}
                    />
                )}

                {/* Single Item "Remove" Confirmation Modal */}
                {itemToRemove && (
                    <ConfirmationModal
                        isOpen={!!itemToRemove}
                        onClose={() => setItemToRemove(null)}
                        onConfirm={confirmRemove}
                        title={t('history.removeModal.title')}
                        description={t('history.removeModal.description')}
                        confirmText={t('history.removeModal.confirm')}
                        variant="danger"
                    />
                )}
            </div>
        </div>
    );
};
export default History;

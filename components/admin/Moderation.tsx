import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import SmartList from '../ui/SmartList';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import { useLocale } from '../../context/LocaleContext';
import { useAdminComments } from '../../hooks/useAdminComments';
import type { Comment } from '../../types/admin';
import type { BanDuration } from '../../types';
import { CommentStatus, FILTER_ALL, AppRoute } from '../../types';
import CommentCard from './comments/CommentCard';
import ModerationModal from './comments/ModerationModal';
import TicketModal from './comments/TicketModal';
import ModerationSkeleton from '../skeletons/ModerationSkeleton';

const Moderation: React.FC = () => {
    const { t } = useLocale();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // --- Navigation State Derived from URL ---
    const tabParam = searchParams.get('tab');
    const ticketParam = searchParams.get('ticket');

    // Ensure URL has a tab param immediately upon entry
    useEffect(() => {
        if (!searchParams.has('tab') && !searchParams.has('ticket')) {
            setSearchParams({ tab: 'comments' }, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    let activeSection: 'comments' | 'reviews' | 'tickets' = 'comments';
    if (ticketParam) {
        activeSection = 'tickets';
    } else if (tabParam === 'reviews' || tabParam === 'tickets') {
        activeSection = tabParam;
    }

    const { comments, isLoading, filter, setFilter, approveComment, rejectComment, updateTicket } =
        useAdminComments(activeSection);

    // Modals State
    const [isModModalOpen, setIsModModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Comment | null>(null);
    const [modalAction, setModalAction] = useState<'approve' | 'reject'>('approve');

    /**
     * The ticket modal is URL-driven: `?ticket=<id>` is the single source of
     * truth. Deriving it (instead of mirroring the URL into state via an
     * effect) keeps deep links, the Back button and the modal consistent by
     * construction — and cache updates from handleTicketUpdate flow back
     * through `comments` automatically.
     */
    const selectedTicket = useMemo(() => {
        if (!ticketParam || activeSection !== 'tickets') return null;
        return comments.find((c) => c.id === ticketParam) ?? null;
    }, [ticketParam, activeSection, comments]);

    const sections = [
        { id: 'comments', label: t('admin.comments.sections.comments') },
        { id: 'reviews', label: t('admin.comments.sections.reviews') },
        { id: 'tickets', label: t('admin.comments.sections.tickets') },
    ];

    const filters: { id: typeof FILTER_ALL | CommentStatus; label: string }[] = [
        { id: FILTER_ALL, label: t('admin.comments.filters.all') },
        { id: CommentStatus.Pending, label: t('admin.comments.filters.pending') },
        { id: CommentStatus.Flagged, label: t('admin.comments.filters.flagged') },
        { id: CommentStatus.Approved, label: t('admin.comments.filters.approved') },
        { id: CommentStatus.Rejected, label: t('admin.comments.filters.rejected') },
    ];

    const currentFilter = filters.find((f) => f.id === filter) || filters[0];

    const handleCardAction = (item: Comment, action: 'approve' | 'reject') => {
        if (activeSection === 'tickets') {
            setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                params.set('tab', 'tickets');
                params.set('ticket', item.id);
                return params;
            });
        } else {
            setSelectedItem(item);
            setModalAction(action);
            setIsModModalOpen(true);
        }
    };

    const handleCloseTicketModal = () => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.delete('ticket');
            if (!params.has('tab')) params.set('tab', 'tickets');
            return params;
        });
    };

    const handleTicketUpdate = (updatedTicket: Comment) => {
        // Updates the React Query cache; `selectedTicket` re-derives from it.
        updateTicket(updatedTicket);
    };

    const handleFinalDecision = (commentId: string, _reason?: string, _duration?: BanDuration) => {
        if (modalAction === 'approve') {
            approveComment(commentId);
        } else {
            // TODO(api): forward `reason` and `duration` to the moderation
            // endpoint — the mock cache update only flips the status.
            rejectComment(commentId);
        }
    };

    const handleCycleFilter = () => {
        const currentIndex = filters.findIndex((f) => f.id === filter);
        const nextIndex = (currentIndex + 1) % filters.length;
        setFilter(filters[nextIndex].id);
    };

    const handleSectionChange = (id: 'comments' | 'reviews' | 'tickets') => {
        setSearchParams({ tab: id });
        setFilter(FILTER_ALL);
    };

    if (isLoading) {
        return <ModerationSkeleton />;
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
                    title={t('admin.comments.title')}
                    description={t('admin.comments.description')}
                    className="!mb-8"
                />

                <div className="flex flex-col md:flex-row items-center justify-start mb-8 animate-fade-in stagger-1 gap-3">
                    <div className="bg-panel-primary p-1 rounded-full  inline-flex shadow-lg h-14 items-center">
                        {sections.map((section) => {
                            const isActive = activeSection === section.id;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() =>
                                        handleSectionChange(
                                            section.id as 'comments' | 'reviews' | 'tickets',
                                        )
                                    }
                                    className={`flex items-center gap-2 px-6 h-12 rounded-full text-sm font-bold transition-all duration-300 relative z-10 whitespace-nowrap ${
                                        isActive
                                            ? 'bg-white text-black shadow-md'
                                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    {section.label}
                                </button>
                            );
                        })}
                    </div>

                    {activeSection !== 'tickets' && (
                        <Button
                            variant="black"
                            className="!h-14 rounded-full font-medium min-w-[200px] group transition-all !px-6  bg-panel-primary"
                            onClick={handleCycleFilter}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                    <i className="fa-solid fa-filter text-gray-400 group-hover:text-black transition-colors"></i>
                                    <span className="text-gray-300 group-hover:text-black transition-colors">
                                        {currentFilter.label}
                                    </span>
                                </div>
                                <div className="bg-white/10 rounded-full w-6 h-6 flex items-center justify-center ml-3 group-hover:bg-black/10 transition-colors">
                                    <i className="fa-solid fa-rotate text-[10px] text-gray-400 group-hover:text-black transition-colors"></i>
                                </div>
                            </div>
                        </Button>
                    )}
                </div>

                <div className="flex-1 min-h-[600px] animate-fade-in stagger-2">
                    {comments.length > 0 ? (
                        <SmartList
                            useWindowScroll
                            totalCount={comments.length}
                            overscan={200}
                            itemContent={(index) => (
                                <div className="pb-4">
                                    <CommentCard
                                        comment={comments[index]}
                                        onApprove={() =>
                                            handleCardAction(comments[index], 'approve')
                                        }
                                        onReject={() => handleCardAction(comments[index], 'reject')}
                                    />
                                </div>
                            )}
                        />
                    ) : (
                        <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl bg-white/5">
                            <p className="text-gray-400 text-sm font-medium">
                                {t('admin.comments.empty')}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {isModModalOpen && (
                <ModerationModal
                    isOpen={isModModalOpen}
                    onClose={() => setIsModModalOpen(false)}
                    comment={selectedItem}
                    action={modalAction}
                    onConfirm={handleFinalDecision}
                />
            )}

            {selectedTicket && (
                <TicketModal
                    key={selectedTicket.id}
                    isOpen
                    onClose={handleCloseTicketModal}
                    ticket={selectedTicket}
                    onUpdate={handleTicketUpdate}
                />
            )}
        </div>
    );
};

export default Moderation;

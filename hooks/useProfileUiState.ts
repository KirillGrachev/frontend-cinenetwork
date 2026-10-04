import type React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useLocale } from '../context/LocaleContext';
import { useToast } from '../context/ToastContext';
import { copyToClipboard } from '../utils/clipboard';
import { getSiteOrigin } from '../utils/siteUrl';
import { ToastType } from '../types';
import type { UserProfileData } from '../types';

export const useProfileUiState = (profile: UserProfileData | null) => {
    const { t } = useLocale();
    const { showToast } = useToast();
    const [searchParams, setSearchParams] = useSearchParams();

    // UI State
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFindFriendOpen, setIsFindFriendOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [dynamicsPeriod, setDynamicsPeriod] = useState<'14' | '30' | '90'>('14');
    const [reviewsFilter, setReviewsFilter] = useState<'all' | 'rating' | 'comment'>('all');

    // Tab Management
    const activeTab = searchParams.get('tab') || 'overview';

    useEffect(() => {
        if (!searchParams.get('tab')) {
            setSearchParams(
                (prev) => {
                    const newParams = new URLSearchParams(prev);
                    newParams.set('tab', 'overview');
                    return newParams;
                },
                { replace: true },
            );
        }
    }, [searchParams, setSearchParams]);

    const handleTabChange = (tabId: string) => {
        setSearchParams(
            (prev) => {
                const newParams = new URLSearchParams(prev);
                newParams.set('tab', tabId);
                return newParams;
            },
            { replace: true },
        );
    };

    // Actions
    const handleFollow = () => {
        setIsFollowing((prev) => !prev);
        showToast(
            !isFollowing
                ? t('info.profile.actions.followed')
                : t('info.profile.actions.unfollowed'),
            ToastType.Success,
        );
    };

    const handleReport = () => {
        setIsMenuOpen(false);
        setIsReportModalOpen(true);
    };

    const handleReportSubmit = (_reason: string, _description: string) => {
        // TODO(api): POST the report (_reason/_description) to the backend.
        showToast(t('common.toasts.reportSent'), ToastType.Success);
        setIsReportModalOpen(false);
    };

    const handleCopyLink = async () => {
        setIsMenuOpen(false);
        if (!profile) return;
        // BrowserRouter: clean shareable URL without the legacy '#/' prefix.
        const shareUrl = `${getSiteOrigin()}/profile/${profile.id}`;
        const ok = await copyToClipboard(shareUrl);
        showToast(
            ok ? t('info.blogPost.copied') : t('common.toasts.copyError'),
            ok ? ToastType.Success : ToastType.Error,
        );
    };

    const handleMessageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        showToast(t('settings.inDevelopment.title'), ToastType.Info);
    };

    return {
        activeTab,
        handleTabChange,
        isFollowing,
        handleFollow,
        isFindFriendOpen,
        setIsFindFriendOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        handleReport,
        handleReportSubmit,
        isMenuOpen,
        setIsMenuOpen,
        dynamicsPeriod,
        setDynamicsPeriod,
        reviewsFilter,
        setReviewsFilter,
        handleCopyLink,
        handleMessageClick,
    };
};

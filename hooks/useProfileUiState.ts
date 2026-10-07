import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useLocale } from '../context/LocaleContext';
import { useToast } from '../context/ToastContext';
import { ToastType, UserProfile } from '../types';

export const useProfileUiState = (profile: UserProfile | null) => {
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
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('tab', 'overview');
                return newParams;
            }, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const handleTabChange = (tabId: string) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('tab', tabId);
            return newParams;
        }, { replace: true });
    };

    // Actions
    const handleFollow = () => {
        setIsFollowing(prev => !prev);
        showToast(
            !isFollowing ? t('info.profile.actions.followed') : t('info.profile.actions.unfollowed'),
            ToastType.Success
        );
    };

    const handleReport = () => {
        setIsMenuOpen(false);
        setIsReportModalOpen(true);
    };

    const handleReportSubmit = (reason: string, description: string) => {
        console.log(`Reported profile ${profile?.username}: ${reason} - ${description}`);
        showToast(t('common.toasts.reportSent'), ToastType.Success);
        setIsReportModalOpen(false);
    };

    const handleCopyLink = async () => {
        setIsMenuOpen(false);
        if (!profile) return;
        const shareUrl = `${window.location.origin}${window.location.pathname}#/profile/${profile.id}`;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(shareUrl);
                showToast(t('info.blogPost.copied'), ToastType.Success);
            } else {
                throw new Error('Clipboard API unavailable');
            }
        } catch (err) {
            const textArea = document.createElement("textarea");
            textArea.value = shareUrl;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showToast(t('info.blogPost.copied'), ToastType.Success);
                } else {
                    showToast(t('common.toasts.copyError'), ToastType.Error);
                }
            } catch (e) {
                showToast(t('common.toasts.copyError'), ToastType.Error);
            }
            document.body.removeChild(textArea);
        }
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
        handleMessageClick
    };
};

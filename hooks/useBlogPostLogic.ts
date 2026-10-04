import { useState, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { newsService } from '../services/apiService';
import { useLocale } from '../context/LocaleContext';
import { copyToClipboard } from '../utils/clipboard';
import { getSiteUrl } from '../utils/siteUrl';
import { useToast } from '../context/ToastContext';
import { ToastType } from '../types';

export const useBlogPostLogic = (postId: number) => {
    const { t } = useLocale();
    const { showToast } = useToast();

    /** Data Fetching */
    const {
        data: post,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['newsItem', postId],
        queryFn: () => newsService.getNewsItemById(postId),
        enabled: !!postId,
    });

    const [linkCopied, setLinkCopied] = useState(false);

    /** Logic Refs for scroll handling coordination */
    const isClickingRef = useRef(false);

    /** Helper to sanitize IDs for anchor links */
    const getSectionId = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\p{L}\p{N}-]/gu, '')
            .replace(/-+/g, '-');
    };

    /** Generate Table of Contents items based on fetched post */
    const tocItems = useMemo(() => {
        if (!post?.toc) return [];
        return post.toc.map((textKey) => ({
            id: getSectionId(t(textKey)),
            text: t(textKey),
        }));
    }, [post, t]);

    /** Actions */
    const actions = {
        scrollToSection: (id: string) => {
            const element = document.getElementById(id);
            if (element) {
                isClickingRef.current = true;

                /** Calculate header offset (approx navbar height + padding) */
                const headerOffset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

                /** Re-enable scroll spy after animation */
                setTimeout(() => {
                    isClickingRef.current = false;
                }, 800);
            }
        },
        copyLink: async () => {
            const ok = await copyToClipboard(getSiteUrl());
            if (ok) {
                setLinkCopied(true);
                /** Toast removed as per request (redundant with UI feedback) */
                setTimeout(() => setLinkCopied(false), 2000);
            } else {
                showToast(t('common.toasts.copyFailed'), ToastType.Error);
            }
        },
        getSectionId,
    };

    return {
        state: {
            post,
            isLoading,
            error,
            linkCopied,
            tocItems,
            isClickingRef /** Export ref for useScrollSpy in component */,
        },
        actions,
    };
};

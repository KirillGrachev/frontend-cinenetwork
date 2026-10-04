import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getDocsContent } from '../constants';
import { useLocale } from '../context/LocaleContext';

export const useDocumentationLogic = (initialDocId?: string) => {
    const { t } = useLocale();
    const navigate = useNavigate();
    const docsContent = useMemo(() => getDocsContent(t), [t]);

    const isLoading = false;
    const isTransitioning = false;

    /** Redirect root /docs to the first document's URL automatically on mount */
    useEffect(() => {
        if (!initialDocId && docsContent.length > 0) {
            navigate(`/docs/${docsContent[0].id}`, { replace: true });
        }
    }, [initialDocId, docsContent, navigate]);

    /**
     * The URL param is the single source of truth for the active document, so
     * browser Back/Forward work for free. The previous version mirrored it
     * into state via an effect (a classic sync-state bug farm).
     */
    const activeDocId =
        initialDocId && docsContent.some((d) => d.id === initialDocId)
            ? initialDocId
            : docsContent[0]?.id;

    const activeDoc = useMemo(
        () => docsContent.find((doc) => doc.id === activeDocId) ?? docsContent[0],
        [activeDocId, docsContent],
    );

    const changeDocWithTransition = (newId: string) => {
        if (newId === activeDocId) return;
        navigate(`/docs/${newId}`);
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    const actions = {
        setActiveDocId: changeDocWithTransition,
    };

    return {
        state: {
            docsContent,
            activeDocId,
            activeDoc,
            isTransitioning,
            isLoading,
        },
        actions,
    };
};

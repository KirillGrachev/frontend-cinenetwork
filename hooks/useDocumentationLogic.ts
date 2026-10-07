import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getDocsContent } from '../constants';
import { useLocale } from '../context/LocaleContext';

export const useDocumentationLogic = (initialDocId?: string) => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const docsContent = useMemo(() => getDocsContent(t), [t]);
  
  const isLoading = false;
  const isTransitioning = false;

  /** Initialize state from URL param or default to first doc */
  const [activeDocId, setActiveDocIdInternal] = useState(() => {
      if (initialDocId && docsContent.some(d => d.id === initialDocId)) {
          return initialDocId;
      }
      return docsContent[0]?.id;
  });

  /** Redirect root /docs to the first document's URL automatically on mount */
  useEffect(() => {
    if (!initialDocId && docsContent.length > 0) {
        navigate(`/docs/${docsContent[0].id}`, { replace: true });
    }
  }, [initialDocId, docsContent, navigate]);

  /** Sync internal state if URL parameter changes (e.g. browser Back button) */
  useEffect(() => {
      if (initialDocId && docsContent.some(d => d.id === initialDocId)) {
          setActiveDocIdInternal(initialDocId);
      }
  }, [initialDocId, docsContent]);

  const activeDoc = useMemo(() => 
    docsContent.find(doc => doc.id === activeDocId) || docsContent[0], 
  [activeDocId, docsContent]);

  const changeDocWithTransition = (newId: string) => {
      if (newId === activeDocId) return;
      setActiveDocIdInternal(newId);
      navigate(`/docs/${newId}`);
      window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const actions = {
      setActiveDocId: changeDocWithTransition
  };

  return {
      state: {
          docsContent,
          activeDocId,
          activeDoc,
          isTransitioning,
          isLoading
      },
      actions
  };
};

import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useLocale } from '../context/LocaleContext';
import { useDocumentationLogic } from '../hooks/useDocumentationLogic';
import { AppRoute } from '../types';
import SEO from './SEO';
import DOMPurify from 'dompurify';

const Documentation: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const { t } = useLocale();
    const { state, actions } = useDocumentationLogic(id);
    const { docsContent, activeDocId, activeDoc, isTransitioning, isLoading } = state;

    const [searchQuery, setSearchQuery] = useState('');

    const filteredDocs = useMemo(() => {
        if (!searchQuery) return docsContent;
        const lowerQuery = searchQuery.toLowerCase();
        return docsContent.filter((doc) => doc.title.toLowerCase().includes(lowerQuery));
    }, [docsContent, searchQuery]);

    // Safe HTML content rendering with sanitization
    const activeDocContent = activeDoc?.content;
    const safeContent = useMemo(() => {
        if (typeof activeDocContent !== 'string') return activeDocContent;
        return DOMPurify.sanitize(activeDocContent, {
            // NOTE: `iframe` (and its sandbox/allow attrs) intentionally NOT allowed:
            // no doc content embeds frames, and allowing them would open a
            // clickjacking/third-party-injection surface if content ever becomes dynamic.
            ALLOWED_TAGS: [
                'p',
                'br',
                'strong',
                'em',
                'u',
                'h1',
                'h2',
                'h3',
                'h4',
                'ul',
                'ol',
                'li',
                'a',
                'img',
                'blockquote',
                'code',
                'pre',
                'div',
                'span',
            ],
            ALLOWED_ATTR: [
                'href',
                'src',
                'alt',
                'title',
                'class',
                'id',
                'target',
                'rel',
                'width',
                'height',
            ],
        });
    }, [activeDocContent]);

    return (
        <div className="min-h-screen bg-[#0a0a0b] flex flex-col pt-24 sm:pt-28 pb-20 md:pb-28 text-gray-200">
            <SEO
                title={
                    !isLoading && activeDoc
                        ? `${activeDoc.title} - ${t('docs.title')}`
                        : t('docs.title')
                }
                description={t('docs.description')}
            />

            {/* Main grid container */}
            <div className="flex flex-1 container mx-auto px-4 md:px-8">
                {/* Desktop Sidebar Navigation */}
                <aside className="hidden md:flex flex-col w-72 lg:w-80 xl:w-84 flex-shrink-0 border-r border-white/10 sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar bg-[#0a0a0b] z-20">
                    {/* Unified padding for all sidebar content */}
                    <div className="py-6 pr-4 lg:pr-5 flex flex-col gap-6 h-full">
                        {/* Back Link */}
                        <button
                            onClick={() => navigate(AppRoute.Home)}
                            className="group flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors self-start"
                        >
                            <i className="fa-solid fa-arrow-left text-xs transition-transform group-hover:-translate-x-1"></i>
                            {t('docs.backToHome')}
                        </button>

                        {/* Search Box */}
                        <div className="relative">
                            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
                            <input
                                type="text"
                                placeholder={t('search.placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-10 bg-white/5 rounded-lg pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-colors"
                            />
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex flex-col gap-1.5 flex-1">
                            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                                {t('docs.title')}
                            </h4>
                            {isLoading ? (
                                <div className="flex flex-col gap-2">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            className="h-6 w-full bg-white/5 rounded-md animate-pulse"
                                        ></div>
                                    ))}
                                </div>
                            ) : filteredDocs.length > 0 ? (
                                filteredDocs.map((doc, idx) => {
                                    const isActive = activeDocId === doc.id;
                                    const originalIdx = docsContent.findIndex(
                                        (d) => d.id === doc.id,
                                    );
                                    const docNum = originalIdx >= 0 ? originalIdx + 1 : idx + 1;
                                    const formattedNum = docNum < 10 ? `0${docNum}` : `${docNum}`;

                                    return (
                                        <button
                                            key={doc.id}
                                            onClick={() => actions.setActiveDocId(doc.id)}
                                            className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all duration-200 flex items-center justify-between gap-2 group font-medium ${
                                                isActive
                                                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                                                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                                            }`}
                                        >
                                            <span className="truncate pr-1">{doc.title}</span>
                                            <span
                                                className={`text-[11px] px-1.5 py-0.5 rounded font-mono flex-shrink-0 ${isActive ? 'bg-blue-500/20 text-blue-300' : 'text-gray-600 group-hover:text-gray-400'}`}
                                            >
                                                {formattedNum}
                                            </span>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="text-left py-4 text-gray-500 text-sm">
                                    {t('search.noResults')}
                                </div>
                            )}
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0 w-full md:pl-8 lg:pl-10">
                    {/* Top Navigation & Mobile Document Picker */}
                    <div className="md:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                        <button
                            onClick={() => navigate(AppRoute.Home)}
                            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors self-start"
                        >
                            <i className="fa-solid fa-arrow-left text-xs"></i>
                            {t('docs.backToHome')}
                        </button>

                        <div className="relative w-full sm:w-auto min-w-[240px]">
                            <select
                                value={activeDocId}
                                onChange={(e) => actions.setActiveDocId(e.target.value)}
                                className="w-full bg-[#121215] text-white text-base font-medium border border-white/15 rounded-xl px-4 py-2.5 pr-10 appearance-none focus:outline-none transition-all cursor-pointer shadow-md"
                            >
                                {docsContent.map((doc, idx) => (
                                    <option
                                        key={doc.id}
                                        value={doc.id}
                                        className="bg-[#121215] text-white py-2"
                                    >
                                        0{idx + 1}. {doc.title}
                                    </option>
                                ))}
                            </select>
                            <i className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none"></i>
                        </div>
                    </div>

                    {isLoading || isTransitioning ? (
                        <div className="animate-fade-in space-y-10 py-4">
                            <div className="space-y-4">
                                <div className="h-4 w-24 bg-white/5 rounded-full"></div>
                                <div className="h-10 w-2/3 bg-white/5 rounded-xl"></div>
                            </div>
                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="h-4 w-full bg-white/5 rounded-full"></div>
                                <div className="h-4 w-11/12 bg-white/5 rounded-full"></div>
                                <div className="h-4 w-full bg-white/5 rounded-full"></div>
                                <div className="h-4 w-4/5 bg-white/5 rounded-full"></div>
                            </div>
                            <div className="h-32 w-full bg-white/5 rounded-2xl"></div>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <header className="mb-6 pb-4 border-b border-white/10">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                                    <span className="text-blue-400">{t('docs.title')}</span>
                                    <i className="fa-solid fa-chevron-right text-xs text-gray-600"></i>
                                    <span className="text-gray-300 truncate text-base">
                                        {activeDoc?.title}
                                    </span>
                                </div>
                            </header>

                            <article className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:scroll-mt-28 prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-strong:text-white prose-ul:text-gray-300 break-words">
                                {safeContent ? (
                                    <div
                                        dangerouslySetInnerHTML={{ __html: safeContent as string }}
                                    />
                                ) : (
                                    activeDoc?.content
                                )}
                            </article>

                            <footer className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-6">
                                <div className="flex items-center justify-between text-base font-medium text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <i className="fa-regular fa-clock text-gray-500"></i>
                                        <span>{t('docs.lastUpdated')}</span>
                                    </div>
                                </div>

                                {(() => {
                                    const currentIndex = docsContent.findIndex(
                                        (d) => d.id === activeDocId,
                                    );
                                    const prevDoc =
                                        currentIndex > 0 ? docsContent[currentIndex - 1] : null;
                                    const nextDoc =
                                        currentIndex < docsContent.length - 1
                                            ? docsContent[currentIndex + 1]
                                            : null;

                                    return (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-2">
                                            {prevDoc ? (
                                                <button
                                                    onClick={() =>
                                                        actions.setActiveDocId(prevDoc.id)
                                                    }
                                                    className="group flex flex-col items-start p-4 rounded-2xl bg-[#121215] border border-white/10 hover:border-white/25 hover:bg-white/[0.04] transition-all text-left shadow-lg"
                                                >
                                                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5 group-hover:text-blue-400 transition-colors">
                                                        <i className="fa-solid fa-arrow-left text-[10px]"></i>
                                                        {t('docs.prevDoc')}
                                                    </span>
                                                    <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                                                        {prevDoc.title}
                                                    </span>
                                                </button>
                                            ) : (
                                                <div />
                                            )}

                                            {nextDoc ? (
                                                <button
                                                    onClick={() =>
                                                        actions.setActiveDocId(nextDoc.id)
                                                    }
                                                    className={`group flex flex-col items-end p-4 rounded-2xl bg-[#121215] border border-white/10 hover:border-white/25 hover:bg-white/[0.04] transition-all text-right shadow-lg ${!prevDoc ? 'sm:col-start-2' : ''}`}
                                                >
                                                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5 group-hover:text-blue-400 transition-colors">
                                                        {t('docs.nextDoc')}
                                                        <i className="fa-solid fa-arrow-right text-[10px]"></i>
                                                    </span>
                                                    <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                                                        {nextDoc.title}
                                                    </span>
                                                </button>
                                            ) : (
                                                <div />
                                            )}
                                        </div>
                                    );
                                })()}
                            </footer>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Documentation;

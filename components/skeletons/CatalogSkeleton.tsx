import React from 'react';
import PageHeader from '../ui/PageHeader';
import { useLocale } from '../../context/LocaleContext';

const CatalogSkeleton: React.FC = () => {
    const { t } = useLocale();

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-8">
                <PageHeader title={t('catalog.title')} description={t('catalog.description')} />

                <div className="flex flex-col relative">
                    <div className="mb-8 w-full skeleton-shimmer">
                        <div className="bg-panel-primary/95 backdrop-blur-xl border border-border-medium rounded-2xl p-2 flex flex-col md:flex-row items-center gap-2 shadow-2xl relative z-20">
                            <div className="flex-1 w-full overflow-hidden flex items-center gap-2 px-3">
                                <div className="h-10 w-28 bg-white/5 border border-white/5 rounded-full shrink-0"></div>
                                <div className="h-10 w-24 bg-white/5 border border-white/5 rounded-full shrink-0"></div>
                                <div className="h-10 w-20 bg-white/5 border border-white/5 rounded-full shrink-0"></div>
                                <div className="h-10 w-20 bg-white/5 border border-white/5 rounded-full shrink-0 hidden sm:block"></div>
                                <div className="h-10 w-20 bg-white/5 border border-white/5 rounded-full shrink-0 hidden md:block"></div>
                                <div className="h-10 w-20 bg-white/5 border border-white/5 rounded-full shrink-0 hidden lg:block"></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-20">
                        {Array.from({ length: 15 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="aspect-[2/3] w-full bg-panel-secondary border border-border-medium rounded-2xl relative overflow-hidden"
                            >
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CatalogSkeleton;

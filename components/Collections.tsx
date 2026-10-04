import React from 'react';
import { useOutletContext } from 'react-router';
import { useLocale } from '../context/LocaleContext';
import { useCollectionsLogic } from '../hooks/useCollectionsLogic';
import PageHeader from './ui/PageHeader';
import Button from './ui/Button';
import FeaturedCollection from './collections/FeaturedCollection';
import CollectionsGrid from './collections/CollectionsGrid';
import SEO from './SEO';

import FeaturedCollectionSkeleton from './skeletons/FeaturedCollectionSkeleton';

interface CollectionsContext {
    openCuratorModal: () => void;
}

const Collections: React.FC = () => {
    const { openCuratorModal } = useOutletContext<CollectionsContext>();
    const { t } = useLocale();
    const { state, actions } = useCollectionsLogic();

    return (
        <div className="min-h-screen pt-32 pb-20">
            <SEO title={t('collections.title')} description={t('collections.description')} />
            <div className="container mx-auto px-4 md:px-8">
                <PageHeader
                    title={t('collections.title')}
                    description={t('collections.description')}
                    actions={
                        <div className="flex flex-col sm:flex-row gap-4 items-center z-30">
                            <Button
                                variant="black"
                                size="md"
                                onClick={actions.cycleFilter}
                                className="rounded-xl font-medium min-w-[220px] group transition-all !px-4"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                        <i
                                            className={`${state.activeFilter.icon} text-gray-400 group-hover:text-black transition-colors`}
                                        ></i>
                                        <span>{state.activeFilter.label}</span>
                                    </div>
                                    <div className="bg-white/10 rounded-full w-6 h-6 flex items-center justify-center ml-3 group-hover:bg-black/10 transition-colors">
                                        <i className="fa-solid fa-rotate text-[10px] text-gray-400 group-hover:text-black transition-colors"></i>
                                    </div>
                                </div>
                            </Button>

                            <Button
                                variant="secondary"
                                size="md"
                                icon="fa-solid fa-plus"
                                className="rounded-xl font-bold"
                                onClick={openCuratorModal}
                            >
                                {t('collections.createOwn')}
                            </Button>
                        </div>
                    }
                />

                {/* Featured Collection Loading Skeleton */}
                {state.isLoading && <FeaturedCollectionSkeleton />}

                {/* Featured Content */}
                {!state.isLoading && !state.error && state.featuredItem && (
                    <FeaturedCollection collection={state.featuredItem} />
                )}

                <CollectionsGrid
                    isLoading={state.isLoading}
                    error={state.error}
                    items={state.visibleGridItems}
                    hasResults={state.hasResults}
                    onReset={actions.cycleFilter}
                />
            </div>
        </div>
    );
};

export default Collections;

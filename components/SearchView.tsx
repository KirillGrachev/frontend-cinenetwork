import React from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import type { Anime, Collection, NewsItem } from '../types';
import { SearchCategory, AppRoute } from '../types';
import LoadingSpinner from './LoadingSpinner';
import PageHeader from './ui/PageHeader';
import { useLocale } from '../context/LocaleContext';
import AnimeCard from './AnimeCard';
import NewsCard from './NewsCard';
import SearchCollectionCard from './search/SearchCollectionCard';
import { useSearchPageLogic } from '../hooks/useSearchPageLogic';
import SEO from './SEO';

const SearchView: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    const category = (searchParams.get('cat') as SearchCategory) || SearchCategory.Anime;

    const { t } = useLocale();
    const { state } = useSearchPageLogic(query, category);
    const { results, isLoading, error, hasResults } = state;

    const onOpenPost = (id: number) => {
        navigate(`${AppRoute.News}/${id}`);
    };

    const getGridColumnsClass = () => {
        switch (category) {
            case SearchCategory.Anime:
                return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-20';
            case SearchCategory.News:
            case SearchCategory.Collections:
                return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20';
            default:
                return '';
        }
    };

    const renderItem = (index: number) => {
        const item = results[index];

        switch (category) {
            case SearchCategory.Anime:
                return <AnimeCard anime={item as Anime} index={index} />;
            case SearchCategory.News:
                return (
                    <div className="h-full">
                        <NewsCard item={item as NewsItem} onClick={onOpenPost} className="h-full" />
                    </div>
                );
            case SearchCategory.Collections:
                return (
                    <div className="h-full">
                        <SearchCollectionCard collection={item as Collection} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20">
            <SEO
                title={`${t('search.resultsFor')} "${query}"`}
                description={`${t('search.resultsFor')} "${query}" - ${t(`navbar.searchCategoryLabels.${category}`)}`}
            />

            <div className="container mx-auto px-4 md:px-8">
                <PageHeader
                    title={`${t('search.resultsFor')} "${query}"`}
                    description={t(`navbar.searchCategoryLabels.${category}`)}
                />

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500 border border-red-500/20 bg-red-500/5 rounded-2xl">
                        {t('search.searchError')}
                    </div>
                ) : !hasResults ? (
                    <div className="text-center py-32 bg-background-secondary border border-dashed border-border-light rounded-3xl">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fa-solid fa-magnifying-glass text-gray-500 text-xl"></i>
                        </div>
                        <p className="text-xl font-bold text-white mb-2">{t('search.noResults')}</p>
                        <p className="text-gray-500">{t('search.tryDifferentQuery')}</p>
                    </div>
                ) : (
                    <div className="animate-fade-in min-h-[500px]">
                        <div className={getGridColumnsClass()}>
                            {results.map((item, index) => (
                                <div key={item.id} className="w-full">
                                    {renderItem(index)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchView;

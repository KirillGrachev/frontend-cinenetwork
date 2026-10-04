import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useLocale } from '../../context/LocaleContext';
import { useCollectionCuratorsLogic } from '../../hooks/useCollectionCuratorsLogic';
import LoadingSpinner from '../LoadingSpinner';
import Button from '../ui/Button';
import PageHeader from '../ui/PageHeader';
import { AppRoute, CuratorRole } from '../../types';
import SEO from '../SEO';
const CollectionCurators: React.FC = () => {
    const { id } = useParams<{
        id: string;
    }>();
    const navigate = useNavigate();
    const { t } = useLocale();
    const collectionId = Number(id);
    const { state } = useCollectionCuratorsLogic(collectionId);
    const { collection, curators, isLoading, error } = state;
    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }
    if (error || !collection) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-32 text-center px-4">
                <h2 className="text-2xl font-bold text-white mb-2">{t('collections.notFound')}</h2>
                <Button
                    onClick={() => navigate(AppRoute.Collections)}
                    variant="secondary"
                    className="mt-4"
                >
                    {t('collections.backToAll')}
                </Button>
            </div>
        );
    }
    return (
        <div className="min-h-screen pt-32 pb-20">
            <SEO
                title={`${t('collections.curators')} - ${t(collection.title)}`}
                description={`${t('collections.curatorsList.description')} - ${t(collection.title)}`}
                image={collection.image}
            />

            <div className="container mx-auto px-4 md:px-8">
                <div className="mb-8 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="md"
                        icon="fa-solid fa-arrow-left"
                        onClick={() => navigate(AppRoute.Collections)}
                        className="pl-0 hover:!bg-transparent hover:text-white"
                    >
                        {t('collections.backToAll')}
                    </Button>

                    <Button
                        variant="secondary"
                        size="md"
                        icon="fa-solid fa-layer-group"
                        onClick={() => navigate(`${AppRoute.Collections}/${collectionId}`)}
                    >
                        {t('collections.viewCollection')}
                    </Button>
                </div>

                <PageHeader
                    title={t('collections.curatorsList.title')}
                    description={`${t('collections.curatorsList.description')} "${t(collection.title)}"`}
                    className="!mb-12"
                />

                <div className="min-h-[500px] animate-fade-in stagger-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
                        {curators.map((curator) => (
                            <div key={curator.id} className="w-full">
                                <div
                                    onClick={() => navigate(`/profile/${curator.id}`)}
                                    className="bg-panel-primary border border-border-medium rounded-xl p-4 flex items-center gap-4 hover:bg-panel-secondary hover:border-border-medium transition-all group cursor-pointer"
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-item-primary flex items-center justify-center text-base font-bold text-gray-500 overflow-hidden group-hover:border-white/20 transition-colors">
                                            {curator.username.charAt(0).toUpperCase()}
                                        </div>
                                        {curator.role === CuratorRole.Admin && (
                                            <div
                                                className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-panel-primary text-white text-[9px]"
                                                title={t('collections.curatorsList.roles.admin')}
                                            >
                                                <i className="fa-solid fa-shield-halved"></i>
                                            </div>
                                        )}
                                        {curator.role === CuratorRole.Moderator && (
                                            <div
                                                className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-panel-primary text-white text-[9px]"
                                                title={t(
                                                    'collections.curatorsList.roles.moderator',
                                                )}
                                            >
                                                <i className="fa-solid fa-gavel"></i>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h3 className="font-bold text-white text-sm truncate pr-1 group-hover:text-blue-400 transition-colors">
                                                {curator.username}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase tracking-wide">
                                                {t(
                                                    `collections.curatorsList.roles.${curator.role}`,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CollectionCurators;

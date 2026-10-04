import React from 'react';
import type { AnimeDetails } from '../../types';
import ImageViewer from '../ui/ImageViewer';
import { useAnimeContentLogic } from '../../hooks/useAnimeContentLogic';

// Sub-components
import AnimeOverview from './tabs/AnimeOverview';
import AnimeEpisodes from './tabs/AnimeEpisodes';
import AnimePhotos from './tabs/AnimePhotos';
import AnimeCharacters from './tabs/AnimeCharacters';
import AnimeRelated from './tabs/AnimeRelated';

interface AnimeContentProps {
    anime: AnimeDetails;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const AnimeContent: React.FC<AnimeContentProps> = ({ anime, activeTab, setActiveTab }) => {
    const {
        tabs,

        // Full Data Lists
        episodesList,
        screenshots,
        characters,

        // Counts
        totalEpisodes,
        totalPhotos,
        totalCharacters,

        // Viewer
        isViewerOpen,
        viewerIndex,
        openViewer,
        closeViewer,

        // Helpers
        formatSource,
        formatDuration,
    } = useAnimeContentLogic(anime);

    return (
        <div className="container mx-auto px-4 md:px-8 relative z-10">
            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto no-scrollbar gap-8 border-b border-white/10 mb-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors duration-300 relative border-b-2 ${
                            activeTab === tab.id
                                ? 'text-white border-white'
                                : 'text-gray-500 border-transparent hover:text-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content Switching */}
            {activeTab === 'overview' && (
                <AnimeOverview
                    anime={anime}
                    screenshots={screenshots}
                    setActiveTab={setActiveTab}
                    openViewer={openViewer}
                    formatDuration={formatDuration}
                    formatSource={formatSource}
                />
            )}

            {activeTab === 'episodes' && (
                <AnimeEpisodes
                    episodes={episodesList}
                    animeId={anime.id}
                    totalEpisodes={totalEpisodes}
                    formatDuration={formatDuration}
                />
            )}

            {activeTab === 'photos' && (
                <AnimePhotos
                    photos={screenshots}
                    totalPhotos={totalPhotos}
                    openViewer={openViewer}
                />
            )}

            {activeTab === 'characters' && (
                <AnimeCharacters characters={characters} totalCharacters={totalCharacters} />
            )}

            {activeTab === 'related' && (
                <AnimeRelated franchise={anime.franchise} similar={anime.similar} />
            )}

            {/* Full Screen Image Viewer */}
            <ImageViewer
                isOpen={isViewerOpen}
                onClose={closeViewer}
                images={screenshots}
                initialIndex={viewerIndex}
            />
        </div>
    );
};

export default AnimeContent;

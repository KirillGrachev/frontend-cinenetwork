import React from 'react';

interface AnimePageLayoutProps {
    heroBackground: React.ReactNode;
    heroContent: React.ReactNode;
    tabs: React.ReactNode;
    mainContent: React.ReactNode;
    sideContent: React.ReactNode;
    isSkeleton?: boolean;
}

export const AnimePageLayout: React.FC<AnimePageLayoutProps> = ({ 
    heroBackground,
    heroContent,
    tabs,
    mainContent,
    sideContent,
    isSkeleton = false
}) => {
    return (
        <div className={`min-h-screen bg-background-primary pb-20 ${isSkeleton ? 'animate-fade-in' : ''}`}>
            {/* Hero */}
            <div className="relative w-full bg-background-primary z-20">
                <div className="absolute inset-0 h-[50vh] md:h-[70vh] max-h-[900px] overflow-hidden">
                    {heroBackground}
                    <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-background-primary/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-background-primary/90 via-background-primary/40 to-transparent"></div>
                </div>
                
                <div className="relative container mx-auto px-4 md:px-8 pt-24 md:pt-48 pb-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-end z-20">
                    {heroContent}
                </div>
            </div>

            {/* Tabs */}
            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="flex overflow-x-auto no-scrollbar gap-8 border-b border-white/10 mb-8 pb-4">
                    {tabs}
                </div>
            </div>

            {/* Content Grid */}
            <div className="container mx-auto px-4 md:px-8 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                <div className="lg:col-span-8 space-y-8">
                    {mainContent}
                </div>
                <div className="lg:col-span-4 space-y-6">
                    {sideContent}
                </div>
            </div>
        </div>
    );
};
export default AnimePageLayout;

import React from 'react';

interface WatchPageLayoutProps {
    backButton: React.ReactNode;
    leftColumn: React.ReactNode;
    rightColumn: React.ReactNode;
    isSkeleton?: boolean;
}

const WatchPageLayout: React.FC<WatchPageLayoutProps> = ({
    backButton,
    leftColumn,
    rightColumn,
    isSkeleton = false,
}) => {
    return (
        <div
            className={`min-h-screen bg-background-primary pt-24 pb-20 ${isSkeleton ? 'page-reveal' : ''}`}
        >
            <div className="container mx-auto px-4 md:px-8">
                <div className="mb-6">{backButton}</div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Player & Info */}
                    <div className="flex-1 w-full min-w-0">{leftColumn}</div>

                    {/* Right Column: Sidebar */}
                    <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 flex flex-col gap-6">
                        {rightColumn}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchPageLayout;

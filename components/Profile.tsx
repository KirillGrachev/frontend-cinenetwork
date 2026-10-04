import React from 'react';
import { useOutletContext } from 'react-router';
import { useProfilePageLogic } from '../hooks/useProfilePageLogic';
import FindFriendModal from './profile/FindFriendModal';
import ReportModal from './ui/ReportModal';
import { AppRoute } from '../types';
import SEO from './SEO';
import Button from './ui/Button';
import ProfileSkeleton from './skeletons/ProfileSkeleton';

// Sub-components
import ProfileHeader from './profile/ProfileHeader';
import ProfileOverview from './profile/tabs/ProfileOverview';
import ProfileDynamics from './profile/tabs/ProfileDynamics';
import ProfileActivity from './profile/tabs/ProfileActivity';
import ProfileFriends from './profile/tabs/ProfileFriends';
import ProfileCollections from './profile/tabs/ProfileCollections';
import ProfileReviews from './profile/tabs/ProfileReviews';

interface CollectionsContext {
    openCuratorModal: () => void;
}

const Profile: React.FC = () => {
    const { openCuratorModal } = useOutletContext<CollectionsContext>();

    // Use the logic hook (Controller)
    const {
        profile,
        isLoading,
        error,
        isOwnProfile,
        activeTab,
        isFollowing,
        isFindFriendOpen,
        setIsFindFriendOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        isMenuOpen,
        setIsMenuOpen,
        dynamicsPeriod,
        setDynamicsPeriod,

        // Data & Pagination
        collections,
        totalCollectionsCount,
        activityFeed,
        totalReviewsCount,
        reviewsFilter,
        handleReviewsFilterChange,
        friends,
        extendedActivity,
        loadMoreActivity,
        hasMoreActivity,
        dynamicsData,

        // Handlers
        handleTabChange,
        handleFollow,
        handleReport,
        handleReportSubmit,
        handleCopyLink,
        handleMessageClick,
        handleActivityClick,

        t,
        navigate,
    } = useProfilePageLogic();

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-32 text-center px-4">
                <h2 className="text-2xl font-bold text-white mb-2">{t('errors.general.title')}</h2>
                <Button
                    onClick={() => navigate(AppRoute.Home)}
                    variant="secondary"
                    className="mt-4"
                >
                    {t('navbar.backToHome')}
                </Button>
            </div>
        );
    }

    // SEO Data
    const seoTitle = isOwnProfile ? t('profile.publicTitle') : profile.username;
    const seoDesc = profile.bio || t('profile.joined', { date: profile.joinDate });

    return (
        <div className="page-reveal min-h-screen bg-background-primary pb-20">
            <SEO
                title={seoTitle}
                description={seoDesc}
                image={profile.avatarUrl || undefined}
                type="profile"
            />

            <ProfileHeader
                profile={profile}
                isOwnProfile={isOwnProfile}
                isFollowing={isFollowing}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                onEdit={() => navigate(AppRoute.Settings)}
                onFollow={handleFollow}
                onCopyLink={handleCopyLink}
                onReport={handleReport}
            />

            {/* Tabs Navigation */}
            <div className="container mx-auto px-4 md:px-8 mt-12 mb-8">
                <div className="flex overflow-x-auto no-scrollbar gap-8 border-b border-white/10">
                    {['overview', 'activity', 'dynamics', 'friends', 'collections', 'reviews'].map(
                        (tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors duration-300 relative border-b-2 whitespace-nowrap ${
                                    activeTab === tab
                                        ? 'text-white border-white'
                                        : 'text-gray-500 border-transparent hover:text-gray-300'
                                }`}
                            >
                                {t(`profile.tabs.${tab}`)}
                            </button>
                        ),
                    )}
                </div>
            </div>

            {/* Tab Content */}
            <div className="container mx-auto px-4 md:px-8">
                {activeTab === 'overview' && <ProfileOverview profile={profile} />}

                {activeTab === 'activity' && (
                    <ProfileActivity
                        activityList={extendedActivity}
                        onActivityClick={handleActivityClick}
                        hasMore={hasMoreActivity}
                        onLoadMore={loadMoreActivity}
                    />
                )}

                {activeTab === 'dynamics' && (
                    <ProfileDynamics
                        dynamicsData={dynamicsData}
                        period={dynamicsPeriod}
                        setPeriod={setDynamicsPeriod}
                    />
                )}

                {activeTab === 'friends' && (
                    <ProfileFriends
                        friends={friends}
                        isOwnProfile={isOwnProfile}
                        onFindFriends={() => setIsFindFriendOpen(true)}
                        onMessageClick={handleMessageClick}
                    />
                )}

                {activeTab === 'collections' && (
                    <ProfileCollections
                        collections={collections}
                        totalCollectionsCount={totalCollectionsCount}
                        isOwnProfile={isOwnProfile}
                        onOpenCuratorModal={openCuratorModal}
                    />
                )}

                {activeTab === 'reviews' && (
                    <ProfileReviews
                        activityFeed={activityFeed}
                        totalReviewsCount={totalReviewsCount}
                        currentFilter={reviewsFilter}
                        onFilterChange={handleReviewsFilterChange}
                    />
                )}
            </div>

            {/* Modals */}
            {isFindFriendOpen && (
                <FindFriendModal
                    isOpen={isFindFriendOpen}
                    onClose={() => setIsFindFriendOpen(false)}
                />
            )}

            {isReportModalOpen && (
                <ReportModal
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    onSubmit={handleReportSubmit}
                    title={t('profile.actions.reportProfile')}
                />
            )}
        </div>
    );
};

export default Profile;

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useProfileLogic } from './useProfileLogic';
import { useProfileUiState } from './useProfileUiState';
import { useLocale } from '../context/LocaleContext';
import {
    buildFullReviewsList,
    filterReviewsList,
    buildFullCollectionsList,
    buildFullFriendsList,
    buildFullActivityList,
    generateDynamicsData,
} from '../utils/profileDataUtils';

const ACTIVITY_INCREMENT = 10;

export const useProfilePageLogic = () => {
    const { t, locale } = useLocale();
    const navigate = useNavigate();

    // Core Data Fetching Logic
    const { state: profileState } = useProfileLogic();
    const { isLoading, error, isOwnProfile } = profileState;
    // React Query yields `undefined` before first load; the pure helpers
    // below are typed against `null` — normalise once, at the boundary.
    const profile = profileState.profile ?? null;

    // UI & Modal States
    const uiState = useProfileUiState(profile);

    // Activity Infinite Scroll State
    const [activityVisibleCount, setActivityVisibleCount] = useState(10);

    // Computed Lists via pure utils & memoization
    const fullReviewsList = useMemo(() => buildFullReviewsList(profile, t), [profile, t]);
    const filteredReviewsList = useMemo(
        () => filterReviewsList(fullReviewsList, uiState.reviewsFilter),
        [fullReviewsList, uiState.reviewsFilter],
    );

    const fullCollectionsList = useMemo(() => buildFullCollectionsList(profile), [profile]);
    const fullFriendsList = useMemo(() => buildFullFriendsList(profile), [profile]);
    const fullActivityList = useMemo(() => buildFullActivityList(profile), [profile]);

    const visibleActivity = useMemo(
        () => fullActivityList.slice(0, activityVisibleCount),
        [fullActivityList, activityVisibleCount],
    );

    const hasMoreActivity = visibleActivity.length < fullActivityList.length;

    const loadMoreActivity = () => {
        setActivityVisibleCount((prev) => prev + ACTIVITY_INCREMENT);
    };

    const dynamicsData = useMemo(
        () =>
            generateDynamicsData(
                uiState.dynamicsPeriod,
                profile?.id ?? 'me',
                profile?.viewingDynamics ?? [],
            ),
        [uiState.dynamicsPeriod, profile?.id, profile?.viewingDynamics],
    );

    const handleActivityClick = (activity: { link?: string }) => {
        if (activity.link) {
            navigate(activity.link);
        }
    };

    return {
        // Data
        profile,
        isLoading,
        error,
        isOwnProfile,
        activeTab: uiState.activeTab,

        // Computed Collections
        collections: fullCollectionsList,
        totalCollectionsCount: fullCollectionsList.length,

        // Computed Reviews
        activityFeed: filteredReviewsList,
        totalReviewsCount: filteredReviewsList.length,
        reviewsFilter: uiState.reviewsFilter,
        handleReviewsFilterChange: uiState.setReviewsFilter,

        // Computed Friends
        friends: fullFriendsList,

        // Computed Activity
        extendedActivity: visibleActivity,
        loadMoreActivity,
        hasMoreActivity,

        // Dynamics
        dynamicsData,

        // UI State Handlers
        isFollowing: uiState.isFollowing,
        isFindFriendOpen: uiState.isFindFriendOpen,
        setIsFindFriendOpen: uiState.setIsFindFriendOpen,
        isReportModalOpen: uiState.isReportModalOpen,
        setIsReportModalOpen: uiState.setIsReportModalOpen,
        isMenuOpen: uiState.isMenuOpen,
        setIsMenuOpen: uiState.setIsMenuOpen,
        dynamicsPeriod: uiState.dynamicsPeriod,
        setDynamicsPeriod: uiState.setDynamicsPeriod,

        // Actions
        handleTabChange: uiState.handleTabChange,
        handleFollow: uiState.handleFollow,
        handleReport: uiState.handleReport,
        handleReportSubmit: uiState.handleReportSubmit,
        handleCopyLink: uiState.handleCopyLink,
        handleMessageClick: uiState.handleMessageClick,
        handleActivityClick,

        // Utils
        t,
        locale,
        navigate,
    };
};

import React from 'react';
import type { UserProfileData } from '../../../types';
import { useLocale } from '../../../context/LocaleContext';

interface ProfileOverviewProps {
    profile: UserProfileData;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ profile }) => {
    const { t } = useLocale();

    return (
        <div className="page-reveal max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    {
                        label: 'info.profile.stats.episodes',
                        value: profile.stats.totalWatchedEpisodes,
                        icon: 'fa-play',
                        color: 'text-blue-400',
                        iconBg: 'bg-blue-500/10',
                    },
                    {
                        label: 'info.profile.stats.titles',
                        value: profile.stats.totalTitles,
                        icon: 'fa-layer-group',
                        color: 'text-purple-400',
                        iconBg: 'bg-purple-500/10',
                    },
                    {
                        label: 'info.profile.stats.days',
                        value: profile.stats.daysWatched,
                        icon: 'fa-clock',
                        color: 'text-green-400',
                        iconBg: 'bg-green-500/10',
                    },
                    {
                        label: 'info.profile.stats.reviews',
                        value: profile.stats.reviewsCount,
                        icon: 'fa-pen-nib',
                        color: 'text-pink-400',
                        iconBg: 'bg-pink-500/10',
                    },
                    {
                        label: 'info.profile.stats.comments',
                        value: profile.stats.commentsCount,
                        icon: 'fa-comment',
                        color: 'text-yellow-400',
                        iconBg: 'bg-yellow-500/10',
                    },
                    {
                        label: 'info.profile.stats.avgScore',
                        value: profile.stats.averageScore,
                        icon: 'fa-star',
                        color: 'text-orange-400',
                        iconBg: 'bg-orange-500/10',
                    },
                ].map((stat, idx) => (
                    <div
                        key={idx}
                        className="bg-panel-primary border border-border-medium rounded-3xl p-6 md:p-8 flex items-center gap-6 hover:bg-panel-secondary hover:border-border-medium transition-all group justify-center md:justify-start"
                    >
                        <div
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${stat.iconBg} ${stat.color} border border-white/5`}
                        >
                            <i className={`fa-solid ${stat.icon}`}></i>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                {stat.value}
                            </div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1 group-hover:text-gray-400 transition-colors">
                                {t(stat.label)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileOverview;

import React from 'react';
import { useLocale } from '../../../context/LocaleContext';
import type { ProfileActivityItem } from '../../../types';
interface ProfileActivityProps {
    activityList: ProfileActivityItem[];
    onActivityClick: (activity: ProfileActivityItem) => void;
    // Removed hasMore/onLoadMore as virtual scroll handles all data
    hasMore?: boolean;
    onLoadMore?: () => void;
}
const ProfileActivity: React.FC<ProfileActivityProps> = ({ activityList, onActivityClick }) => {
    const { t } = useLocale();
    return (
        <div className="animate-fade-in">
            <div className="max-w-4xl mx-auto min-h-[500px]">
                {activityList.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl bg-white/5">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                            <i className="fa-solid fa-clock-rotate-left text-2xl"></i>
                        </div>
                        <p className="text-gray-400 font-medium">
                            {t('info.profile.activity.empty')}
                        </p>
                    </div>
                ) : (
                    <div className="relative border-l border-white/10 ml-6 md:ml-10 space-y-10 py-2">
                        {activityList.map((activity) => {
                            let icon = 'fa-circle';
                            let color = 'text-gray-500';
                            let bgColor = 'bg-gray-800';
                            let borderColor = 'border-gray-700';
                            switch (activity.type) {
                                case 'watched':
                                    icon = 'fa-play';
                                    color = 'text-blue-400';
                                    bgColor = 'bg-blue-500/10';
                                    borderColor = 'border-blue-500/30';
                                    break;
                                case 'rated':
                                    icon = 'fa-star';
                                    color = 'text-yellow-400';
                                    bgColor = 'bg-yellow-500/10';
                                    borderColor = 'border-yellow-500/30';
                                    break;
                                case 'commented':
                                    icon = 'fa-comment';
                                    color = 'text-green-400';
                                    bgColor = 'bg-green-500/10';
                                    borderColor = 'border-green-500/30';
                                    break;
                                case 'added_list':
                                    icon = 'fa-bookmark';
                                    color = 'text-purple-400';
                                    bgColor = 'bg-purple-500/10';
                                    borderColor = 'border-purple-500/30';
                                    break;
                            }
                            return (
                                <div key={activity.id} className="pl-8 md:pl-12 group">
                                    {/* Timeline Dot */}
                                    <div
                                        className={`absolute -left-[9px] top-5 w-[18px] h-[18px] rounded-full bg-background-primary border-2 ${borderColor.replace('/30', '')} z-10 flex items-center justify-center`}
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')}`}
                                        ></div>
                                    </div>

                                    {/* Card */}
                                    <div
                                        onClick={() => onActivityClick(activity)}
                                        className="bg-panel-primary border border-border-medium rounded-2xl p-5 hover:bg-panel-secondary hover:border-border-medium transition-all cursor-pointer shadow-sm relative overflow-hidden"
                                    >
                                        <div className="flex items-start gap-5">
                                            {/* Poster / Icon */}
                                            <div className="flex-shrink-0">
                                                {activity.image ? (
                                                    <div className="w-12 h-16 rounded-lg overflow-hidden border border-white/10 shadow-lg">
                                                        <img
                                                            src={activity.image}
                                                            alt=""
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div
                                                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor} border ${borderColor}`}
                                                    >
                                                        <i
                                                            className={`fa-solid ${icon} ${color} text-lg`}
                                                        ></i>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0 py-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                    <span
                                                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${bgColor} ${color} ${borderColor}`}
                                                    >
                                                        {t(
                                                            `info.profile.activity.types.${activity.type}`,
                                                        )}
                                                    </span>
                                                    <span className="text-xs text-gray-500 font-medium">
                                                        •
                                                    </span>
                                                    <span className="text-xs text-gray-500 font-medium">
                                                        {activity.timestamp}
                                                    </span>
                                                </div>

                                                <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                                                    {t(activity.title)}
                                                </h4>

                                                {activity.meta && (
                                                    <p className="text-sm text-gray-400 mt-1 font-medium group-hover:text-gray-300 transition-colors">
                                                        {activity.meta}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                                                    <i className="fa-solid fa-chevron-right text-xs"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
export default ProfileActivity;

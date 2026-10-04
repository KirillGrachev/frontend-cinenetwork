import React from 'react';
import { useLocale } from '../../../context/LocaleContext';
import CollectionCard from '../../collections/CollectionCard';
import type { CollectionViewModel } from '../../../types';
interface ProfileCollectionsProps {
    collections: CollectionViewModel[];
    totalCollectionsCount: number;
    isOwnProfile: boolean;
    onOpenCuratorModal: () => void;
    placeholdersCount?: number;
}
const ProfileCollections: React.FC<ProfileCollectionsProps> = ({
    collections,
    totalCollectionsCount,
    isOwnProfile,
    onOpenCuratorModal,
}) => {
    const { t } = useLocale();
    return (
        <div className="animate-fade-in flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                    {t('info.profile.collections.title')}
                </h3>
                <span className="text-sm font-bold text-gray-500 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                    {totalCollectionsCount}
                </span>
            </div>

            {/* If user has no collections, show Create Card at top or empty state */}
            {collections.length === 0 && isOwnProfile ? (
                <button
                    onClick={onOpenCuratorModal}
                    className="group relative h-[280px] w-full max-w-sm rounded-[32px] border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/30 transition-all flex flex-col items-center justify-center text-gray-500 hover:text-white overflow-hidden mx-auto"
                >
                    <div className="w-14 h-14 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                        <i className="fa-solid fa-plus text-xl"></i>
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wide">
                        {t('media.collections.createOwn')}
                    </span>
                </button>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-40">
                    {collections.map((item, index) => {
                        const content = (
                            <CollectionCard collection={collections[index]} index={index} />
                        );
                        return (
                            <div key={item.id} className="w-full">
                                {content}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
export default ProfileCollections;

import React from 'react';
import { useNavigate } from 'react-router';
import { useLocale } from '../../../context/LocaleContext';
import Button from '../../ui/Button';
interface ProfileFriendsProps {
  friends: any[];
  isOwnProfile: boolean;
  onFindFriends: () => void;
  onMessageClick: (e: React.MouseEvent) => void;
  placeholdersCount?: number;
}
const ProfileFriends: React.FC<ProfileFriendsProps> = ({
  friends,
  isOwnProfile,
  onFindFriends,
  onMessageClick
}) => {
  const {
    t
  } = useLocale();
  const navigate = useNavigate();
  return <div className="animate-fade-in flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">{t('info.profile.friends.title')}</h3>
                <span className="text-sm font-bold text-gray-500 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">{friends.length}</span>
            </div>

            {/* Virtualized Friends Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 pb-40">
              {friends.map((friend) => (
                <div key={friend.id} className="w-full">
                  <div className="bg-panel-primary border border-border-medium hover:border-border-medium rounded-2xl p-4 flex items-center gap-4 transition-all hover:bg-panel-secondary hover:shadow-lg cursor-pointer group" onClick={() => navigate(`/profile/${friend.id}`)}>
                    <div className="w-14 h-14 rounded-full bg-item-primary border-2 border-border-medium flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-white/30 transition-colors">
                      {friend.avatarUrl ? <img src={friend.avatarUrl} alt={friend.username} className="w-full h-full object-cover" /> : <span className="text-lg font-bold text-gray-500">{friend.username.charAt(0)}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm truncate group-hover:text-blue-400 transition-colors">{friend.username}</h4>
                    </div>
                    <button onClick={e => {
                      e.stopPropagation();
                      onMessageClick(e);
                    }} className="w-9 h-9 rounded-xl bg-white/5 text-gray-600 flex items-center justify-center transition-colors cursor-not-allowed opacity-50" title="Отправка сообщений временно недоступна" disabled>
                      <i className="fa-regular fa-envelope text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Persistent Find Friends Block - Only show if not scrolling or at top */}
            {isOwnProfile && friends.length < 10 && <div className="mt-8 pt-8 border-t border-white/5 animate-fade-in stagger-1 mb-20">
                    <div className="bg-panel-primary border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h4 className="text-lg font-bold text-white mb-2">{t('info.profile.friends.find')}</h4>
                            <p className="text-sm text-gray-400 max-w-md">
                                Находите людей с похожими вкусами, следите за их активностью и делитесь впечатлениями.
                            </p>
                        </div>
                        <div>
                            <Button variant="secondary" size="lg" icon="fa-solid fa-magnifying-glass" onClick={onFindFriends} className="border-border-light hover:border-border-medium">
                                {t('common.ui.find')}
                            </Button>
                        </div>
                    </div>
                </div>}
        </div>;
};
export default ProfileFriends;
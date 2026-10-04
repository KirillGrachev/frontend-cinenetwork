import React, { useState, useEffect } from 'react';
import SmartList from '../ui/SmartList';
import { DialogTitle } from '@headlessui/react';
import BaseModal from '../ui/BaseModal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import LoadingSpinner from '../LoadingSpinner';
import { useLocale } from '../../context/LocaleContext';
import { useDebounce } from '../../hooks/useDebounce';
import { pickNickname } from '../../data/mock/content';

interface FindFriendModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FriendSearchResult {
    id: string;
    username: string;
    avatar: string | null;
}

const FindFriendModal: React.FC<FindFriendModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLocale();
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedQuery = useDebounce(searchQuery, 500);

    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<FriendSearchResult[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

    // Reset search state when the modal closes (render-phase prop-change
    // adjustment instead of a syncing effect).
    const [wasOpen, setWasOpen] = useState(isOpen);
    if (wasOpen !== isOpen) {
        setWasOpen(isOpen);
        if (!isOpen) {
            setSearchQuery('');
            setResults([]);
            setHasSearched(false);
            setSentRequests(new Set());
        }
    }

    useEffect(() => {
        // Cancellation guard: without it a slow earlier request could
        // overwrite the results of a newer one (classic async race).
        let cancelled = false;

        const search = async () => {
            if (!debouncedQuery.trim()) {
                setResults([]);
                setHasSearched(false);
                return;
            }

            setIsLoading(true);
            setHasSearched(true);

            // TODO(api): replace with userService.searchUsers(debouncedQuery)
            // once the backend endpoint exists. Simulated latency for now.
            await new Promise((r) => setTimeout(r, 800));
            if (cancelled) return;

            const normalizedQuery = debouncedQuery.toLowerCase();
            // Сообщество аниме-сервиса: ники из общего пула с детерминированными
            // вариациями. Прежние «User_<запрос>_<i>» были техническим мусором в UI.
            const matches: FriendSearchResult[] = Array.from({ length: 40 }, (_, i) => {
                const nickname = pickNickname(`find_${debouncedQuery}_${i}`);
                return {
                    id: `gen_${i}`,
                    username: i % 3 === 0 ? `${nickname}_${10 + i}` : nickname,
                    avatar: null,
                };
            });

            setResults(matches.filter((u) => u.username.toLowerCase().includes(normalizedQuery)));
            setIsLoading(false);
        };

        void search();
        return () => {
            cancelled = true;
        };
    }, [debouncedQuery]);

    const toggleRequest = (id: string) => {
        setSentRequests((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            className="bg-panel-primary border border-border-medium rounded-3xl p-6 max-w-md h-[600px] max-h-[80vh] flex flex-col shadow-2xl relative"
        >
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <DialogTitle as="h3" className="text-xl font-bold text-white">
                    {t('info.profile.friends.find')}
                </DialogTitle>
                <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    aria-label={t('collections.cancel')}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div className="mb-6 flex-shrink-0">
                <Input
                    placeholder={t('info.profile.friends.findPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    rightIcon="fa-solid fa-magnifying-glass"
                    className="bg-item-primary border-border-light"
                    autoFocus
                />
            </div>

            <div className="flex-1 min-h-0 relative">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <LoadingSpinner size="md" />
                    </div>
                ) : hasSearched && results.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <i className="fa-regular fa-face-frown text-3xl mb-3 opacity-50"></i>
                        <span className="text-sm font-medium">
                            {t('info.profile.friends.searchEmpty')}
                        </span>
                    </div>
                ) : results.length > 0 ? (
                    <SmartList
                        style={{ height: '100%' }}
                        totalCount={results.length}
                        className="custom-scrollbar"
                        itemContent={(index) => {
                            const user = results[index];
                            const isSent = sentRequests.has(user.id);
                            return (
                                <div className="pb-3 pr-2">
                                    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                        <div className="w-12 h-12 rounded-full bg-item-primary flex items-center justify-center font-bold text-gray-500 text-lg ">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                user.username.charAt(0)
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-bold truncate">
                                                {user.username}
                                            </h4>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant={isSent ? 'soft' : 'primary'}
                                            onClick={() => toggleRequest(user.id)}
                                            className={`rounded-lg px-4 h-9 text-xs min-w-[100px] ${isSent ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30' : ''}`}
                                        >
                                            {isSent ? (
                                                <>
                                                    <span className="group-hover:hidden">
                                                        <i className="fa-solid fa-check mr-2"></i>
                                                        {t('info.profile.friends.requestSent')}
                                                    </span>
                                                    <span className="hidden group-hover:inline">
                                                        <i className="fa-solid fa-xmark mr-2"></i>
                                                        {t('collections.cancel')}
                                                    </span>
                                                </>
                                            ) : (
                                                t('info.profile.friends.add')
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            );
                        }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-600">
                        <i className="fa-solid fa-user-group text-3xl mb-3 opacity-30"></i>
                        <span className="text-xs font-medium uppercase tracking-widest opacity-60">
                            Введите имя пользователя
                        </span>
                    </div>
                )}
            </div>
        </BaseModal>
    );
};

export default FindFriendModal;

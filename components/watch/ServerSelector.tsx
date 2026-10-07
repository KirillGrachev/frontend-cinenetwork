import React, { useState, useMemo } from 'react';
import { Voiceover } from '../../types';
import { useLocale } from '../../context/LocaleContext';

interface ServerSelectorProps {
    voiceovers: Voiceover[];
    currentServer: string;
    onSelect: (serverId: string) => void;
}

const ServerSelector: React.FC<ServerSelectorProps> = ({ voiceovers, currentServer, onSelect }) => {
    const { t } = useLocale();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeLang, setActiveLang] = useState<'ru' | 'en' | 'jp' | 'all'>('ru');

    // Grouping constants
    const langs = [
        { id: 'ru', label: 'Русский' },
        { id: 'en', label: 'English' },
        { id: 'jp', label: '日本語' },
        { id: 'all', label: 'All' },
    ];

    const filteredVoiceovers = useMemo(() => {
        return voiceovers.filter(v => {
            const matchesLang = activeLang === 'all' || v.language === activeLang;
            const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesLang && matchesSearch;
        });
    }, [voiceovers, activeLang, searchQuery]);

    return (
        <div className="bg-panel-primary border border-border-medium rounded-3xl p-5 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                
                {/* Language Tabs - Chips Style */}
                <div className="flex bg-item-primary p-1 rounded-full ">
                    {langs.map(lang => (
                        <button
                            key={lang.id}
                            onClick={() => setActiveLang(lang.id as 'ru' | 'en' | 'jp' | 'all')}
                            // CHANGED: rounded-lg -> rounded-full (Chips)
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                activeLang === lang.id 
                                ? 'bg-white text-black shadow-sm' 
                                : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-64">
                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
                    <input 
                        type="text" 
                        placeholder={t('common.ui.find')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-item-primary border border-border-medium rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none"
                    />
                </div>
            </div>

            {/* List/Grid of Voiceovers */}
            <div className="max-h-[140px] overflow-y-auto custom-scrollbar">
                <div className="flex flex-wrap gap-2">
                    {filteredVoiceovers.length > 0 ? (
                        filteredVoiceovers.map(vo => (
                            <button
                                key={vo.id}
                                onClick={() => onSelect(vo.id)}
                                // CHANGED: rounded-xl (Standard small button shape)
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                    currentServer === vo.id
                                    ? 'bg-white text-black border-white'
                                    : 'bg-item-primary text-gray-400 border-border-light hover:text-white hover:border-border-medium hover:bg-panel-secondary'
                                }`}
                            >
                                {vo.name}
                            </button>
                        ))
                    ) : (
                        <div className="w-full text-center text-gray-500 text-xs py-4">
                            {t('search.noResults')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServerSelector;
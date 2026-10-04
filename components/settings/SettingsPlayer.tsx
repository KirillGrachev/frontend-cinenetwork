import React, { useState } from 'react';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import { useLocale } from '../../context/LocaleContext';

const SettingsPlayer: React.FC = () => {
    const { t } = useLocale();

    // Mock State
    const [quality, setQuality] = useState('1080p');
    const [audio, setAudio] = useState('ru');
    const [skipIntro, setSkipIntro] = useState(true);
    const [autoNext, setAutoNext] = useState(true);

    return (
        <div className="space-y-8 page-reveal">
            {/* General Playback */}
            <div className="bg-panel-primary p-6 rounded-2xl ">
                <h3 className="text-lg font-bold text-white mb-6">
                    {t('settings.player.titles.general')}
                </h3>
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-300 font-medium">
                            {t('settings.player.autoSkipIntro')}
                        </span>
                        <Checkbox label="" checked={skipIntro} onChange={setSkipIntro} />
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-300 font-medium">
                            {t('settings.player.autoNext')}
                        </span>
                        <Checkbox label="" checked={autoNext} onChange={setAutoNext} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div>
                            <Select
                                label={t('settings.player.defaultQuality')}
                                value={quality}
                                onChange={setQuality}
                                options={[
                                    { value: '4k', label: '4K (Ultra HD)' },
                                    { value: '1080p', label: '1080p (Full HD)' },
                                    { value: '720p', label: '720p (HD)' },
                                    { value: '480p', label: '480p (SD)' },
                                ]}
                                variant="solid"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Audio & Subtitles */}
            <div className="bg-panel-primary p-6 rounded-2xl ">
                <h3 className="text-lg font-bold text-white mb-6">
                    {t('settings.player.titles.audio')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Select
                            label={t('settings.player.defaultAudio')}
                            value={audio}
                            onChange={setAudio}
                            options={[
                                { value: 'ru', label: 'Русский (Дубляж)' },
                                { value: 'ru_sub', label: 'Японский + Субтитры' },
                                { value: 'en', label: 'English (Dub)' },
                                { value: 'orig', label: 'Original (Japanese)' },
                            ]}
                            variant="solid"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPlayer;

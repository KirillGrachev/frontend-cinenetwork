import React from 'react';
import Select from '../../ui/Select';
import { useLocale } from '../../../context/LocaleContext';

interface ProfileDynamicsProps {
    dynamicsData: { date: Date; value: number }[];
    period: '14' | '30' | '90';
    setPeriod: (val: '14' | '30' | '90') => void;
    // Props isPeriodSelectOpen and onToggleSelect are removed
}

const ProfileDynamics: React.FC<ProfileDynamicsProps> = ({ dynamicsData, period, setPeriod }) => {
    const { t, locale } = useLocale();

    return (
        <div className="page-reveal">
            <div className="bg-panel-primary border border-border-medium rounded-3xl p-6 md:p-10 relative">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h3 className="text-2xl font-bold text-white">
                            {t('info.profile.dynamics.title')}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {t('info.profile.dynamics.subtitle')}
                        </p>
                    </div>

                    <div className="w-28 z-20">
                        <Select
                            value={period}
                            onChange={(val) => setPeriod(val as '14' | '30' | '90')}
                            options={[
                                { value: '14', label: t('info.profile.dynamics.periods.d14') },
                                { value: '30', label: t('info.profile.dynamics.periods.d30') },
                                { value: '90', label: t('info.profile.dynamics.periods.d90') },
                            ]}
                            variant="solid"
                            size="sm"
                        />
                    </div>
                </div>

                <div className="relative h-64 w-full">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 z-0">
                        <div className="w-full h-px bg-white/10 border-t border-dashed border-white/20"></div>
                        <div className="w-full h-px bg-white/10 border-t border-dashed border-white/20"></div>
                        <div className="w-full h-px bg-white/10 border-t border-dashed border-white/20"></div>
                        <div className="w-full h-px bg-white/10 border-t border-dashed border-white/20"></div>
                    </div>

                    <div className="flex items-end justify-between gap-1 sm:gap-2 h-full w-full px-2 relative z-10">
                        {dynamicsData.map((dataPoint, idx) => {
                            const maxVal = Math.max(...dynamicsData.map((d) => d.value), 12);
                            const heightPercent = Math.min(
                                100,
                                Math.max(5, (dataPoint.value / maxVal) * 100),
                            );
                            const dayStr = dataPoint.date.toLocaleDateString(
                                locale === 'ru' ? 'ru-RU' : 'en-US',
                                { day: '2-digit', month: '2-digit' },
                            );

                            const showLabel =
                                dynamicsData.length <= 14 ||
                                idx % Math.ceil(dynamicsData.length / 10) === 0;

                            return (
                                <div
                                    key={idx}
                                    className="flex-1 flex flex-col items-center justify-end h-full group"
                                >
                                    <div
                                        className={`w-full max-w-[30px] rounded-t-sm relative transition-all duration-300 ${dataPoint.value > 0 ? 'bg-blue-600 hover:bg-blue-500' : 'bg-white/5'}`}
                                        style={{ height: `${heightPercent}%` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-black border border-white/10 px-3 py-1.5 rounded-xl text-white font-bold pointer-events-none whitespace-nowrap z-20 shadow-xl">
                                            {dataPoint.value}
                                        </div>
                                    </div>
                                    {showLabel && (
                                        <div className="mt-3 text-[9px] font-bold text-gray-600 uppercase group-hover:text-white transition-colors absolute bottom-[-25px]">
                                            {dayStr}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDynamics;

import React from 'react';
import { useNavigate } from 'react-router';
import Button from './ui/Button';
import { useLocale } from '../context/LocaleContext';
import { AppRoute } from '../types';

const NotFound: React.FC = () => {
    const { t } = useLocale();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-12 relative overflow-hidden">
            <div className="container mx-auto px-4 text-center relative z-10 max-w-2xl">
                {/* Visual */}
                <div className="mb-8 relative inline-block">
                    <div className="text-[150px] md:text-[200px] font-black text-white/20 leading-none select-none">
                        404
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight page-reveal">
                    {t('errors.notFound.subtitle')}
                </h1>

                <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-lg mx-auto page-reveal font-medium">
                    {t('errors.notFound.description')}
                </p>

                <div className="page-reveal">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate(AppRoute.Home)}
                        icon="fa-solid fa-arrow-left"
                        className="rounded-full px-10"
                    >
                        {t('errors.notFound.backToHome')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;

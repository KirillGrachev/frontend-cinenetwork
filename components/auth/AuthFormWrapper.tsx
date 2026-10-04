import React from 'react';
import AuthSocialLogins from './AuthSocialLogins';
import Skeleton from '../ui/Skeleton';

interface AuthFormWrapperProps {
    title: string;
    children: React.ReactNode;
    footerLinkText: string;
    footerLinkActionText: string;
    onFooterLinkClick: () => void;
    isLoading?: boolean;
    fieldCount?: number;
}

const AuthFormWrapper: React.FC<AuthFormWrapperProps> = ({
    title,
    children,
    footerLinkText,
    footerLinkActionText,
    onFooterLinkClick,
    isLoading = false,
    fieldCount = 2,
}) => {
    return (
        <div className="min-h-screen bg-background-primary relative overflow-hidden flex flex-col items-center justify-center py-20">
            {/** --- Main Form Content --- */}
            <div className="w-full max-w-[480px] relative z-10 px-4">
                <div className="bg-black/40 backdrop-blur-md border border-white/5 p-1 rounded-3xl shadow-2xl">
                    <div className="bg-panel-primary/80 rounded-[20px] p-6 md:p-8 border border-white/5">
                        <div className="page-reveal">
                            {/** Title inside the main frame */}
                            <h1 className="text-3xl font-bold text-white tracking-tight text-center mb-8">
                                {title}
                            </h1>

                            {isLoading ? (
                                <div className="space-y-6" aria-busy="true">
                                    {Array.from({ length: fieldCount }, (_, i) => (
                                        <div key={i} className="space-y-2">
                                            <Skeleton className="h-12 w-full rounded-xl" />
                                        </div>
                                    ))}
                                    <Skeleton className="h-12 w-full rounded-xl" />
                                </div>
                            ) : (
                                children
                            )}

                            <AuthSocialLogins />

                            <div className="text-center mt-6">
                                <p className="text-sm text-gray-400">
                                    {footerLinkText}{' '}
                                    <button
                                        onClick={onFooterLinkClick}
                                        className="text-white font-medium border-b border-transparent hover:border-white transition-all"
                                    >
                                        {footerLinkActionText}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthFormWrapper;

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useLocale, TFunction } from '../context/LocaleContext';
import { AppRoute } from '../types';

interface ErrorBoundaryProps {
  children?: ReactNode;
  t: TFunction;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Inner class component for Error Boundary as static methods and lifecycle hooks 
 * for errors are not yet available in functional components.
 */
class ErrorBoundaryInner extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
      // Assuming HashRouter based on index.tsx
      window.location.href = `/#${AppRoute.Home}`;
      window.location.reload();
  }

  render() {
    const { t, children } = this.props;
    const { hasError, error, errorInfo } = this.state;

    if (hasError) {
      return (
        <div className="min-h-screen bg-background-primary text-white flex items-center justify-center p-6 relative overflow-hidden font-mono selection:bg-red-500/30">
            {/* Explicit 500 Status meta for pre-rendering services */}
            <meta name="prerender-status-code" content="500" />

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
            />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 opacity-50" />
            
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-2xl w-full relative z-10 border border-white/10 bg-panel-primary rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
                {/* Header */}
                <div className="bg-red-500/10 border-b border-red-500/20 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-red-500/20 rounded-lg text-red-500 animate-pulse">
                        <i className="fa-solid fa-triangle-exclamation text-xl"></i>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-red-400 uppercase tracking-widest">{t('errors.general.title')}</h1>
                        <p className="text-[10px] text-red-300/70">{t('errors.general.subtitle')}</p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 space-y-6">
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {t('errors.general.description')}
                    </p>

                    {/* Terminal Output */}
                    <div className="bg-black rounded-lg border border-white/10 p-4 overflow-x-auto custom-scrollbar relative group">
                        <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
                             <i className="fa-solid fa-terminal text-xs text-gray-500"></i>
                             <span className="text-[10px] text-gray-500 uppercase tracking-wider">{t('common.ui.systemOutput')}</span>
                        </div>
                        <pre className="text-[11px] text-red-300/80 font-mono whitespace-pre-wrap leading-relaxed">
                            {error?.toString()}
                            <br />
                            {errorInfo?.componentStack}
                        </pre>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <button 
                            onClick={this.handleReload}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all active:opacity-90"
                        >
                            <i className="fa-solid fa-rotate-right"></i>
                            {t('errors.general.reload')}
                        </button>
                        <button 
                            onClick={this.handleHome}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 border border-white/10 transition-all active:opacity-90"
                        >
                            <i className="fa-solid fa-house"></i>
                            {t('errors.general.backToHome')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      );
    }

    return children;
  }
}

// Wrapper component to use hooks
const ErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useLocale();
  return <ErrorBoundaryInner t={t}>{children}</ErrorBoundaryInner>;
};

export default ErrorBoundary;
import React from 'react';
import { useNavigate } from 'react-router';
import Button from './ui/Button';
import PageHeader from './ui/PageHeader';
import { useLocale } from '../context/LocaleContext';
import { useStatusLogic } from '../hooks/useStatusLogic';
import StatusSystemHealth from './status/StatusSystemHealth';
import StatusServiceList from './status/StatusServiceList';
import { AppRoute } from '../types';
import StatusPageSkeleton from './skeletons/StatusPageSkeleton';

const StatusPage: React.FC = () => {
    const { t } = useLocale();
    const navigate = useNavigate();
    const { state, actions } = useStatusLogic();

    if (state.isLoading) {
        return <StatusPageSkeleton />;
    }

  return (
    <div className="min-h-[calc(100vh-120px)] pt-32 pb-20 select-none flex flex-col justify-between animate-fade-in">
      <div className="container mx-auto px-4 md:px-8 flex-1">
        
        <div className="mb-8">
            <Button 
                variant="ghost" 
                size="md" 
                icon="fa-solid fa-arrow-left" 
                onClick={() => navigate(AppRoute.Home)}
                className="pl-0 hover:!bg-transparent hover:text-white"
            >
                {t('status.backToHome')}
            </Button>
        </div>

        <PageHeader
            title={t('status.title')}
            description={t('status.description')}
        />

        <StatusSystemHealth 
             allOperational={state.allOperational} 
        />
        
        <StatusServiceList 
             groups={state.statusGroups}
            expandedServiceId={state.expandedServiceId}
            onToggle={actions.toggleService}
        />
      </div>
    </div>
  );
};

export default StatusPage;

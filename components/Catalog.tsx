
import React from 'react';
import { useLocale } from '../context/LocaleContext';
import { useCatalogLogic } from '../hooks/useCatalogLogic';
import PageHeader from './ui/PageHeader';
import Button from './ui/Button';
import CatalogSidebar from './catalog/CatalogSidebar'; /** This is now the Filter Bar */
import CatalogGrid from './catalog/CatalogGrid';
import SEO from './SEO';
import CatalogSkeleton from './skeletons/CatalogSkeleton';

const Catalog: React.FC = () => {
  const { t } = useLocale();
  
  const { state, actions } = useCatalogLogic({ itemsPerPage: 15 });

  if (state.isLoading) {
      return (
          <>
            <SEO 
                title={t('catalog.title')} 
                description={t('catalog.description')} 
            />
            <CatalogSkeleton />
          </>
      );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <SEO 
        title={t('catalog.title')} 
        description={t('catalog.description')} 
      />
      <div className="container mx-auto px-4 md:px-8">
        
        <PageHeader
            title={t('catalog.title')}
            description={t('catalog.description')}
            actions={
              <div className="z-30">
                <Button 
                  variant="black" 
                  size="md" 
                  onClick={actions.cycleSort}
                  className="font-medium min-w-[220px] group transition-all !px-4"
                >
                  <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                          <i className={`${state.currentSort.icon} text-gray-400 group-hover:text-black transition-colors`}></i>
                          <span>{state.currentSort.label}</span>
                      </div>
                      <div className="bg-white/10 rounded-full w-6 h-6 flex items-center justify-center ml-3 group-hover:bg-black/10 transition-colors">
                        <i className="fa-solid fa-rotate text-[10px] text-gray-400 group-hover:text-black transition-colors"></i>
                      </div>
                  </div>
                </Button>
            </div>
            }
        />

        {/** Vertical Stack Layout */}
        <div className="flex flex-col relative">
          
          <CatalogSidebar 
              config={state.config}
              filters={state.filters}
              onToggle={actions.toggleSelection}
              onYearChange={(type, val) => actions.setYearRange({ ...state.filters.yearRange, [type]: Number(val) })}
              onReset={actions.resetFilters}
              onApply={actions.applyFilters}
          />

          <div className="flex-1 min-h-[500px]">
            <CatalogGrid 
                isLoading={state.isLoading}
                error={state.error}
                items={state.visibleItems}
                placeholdersCount={state.placeholdersCount}
                currentPage={state.currentPage}
                totalPages={state.totalPages}
                hasResults={state.hasResults}
                onPageChange={actions.setPage}
                onReset={actions.resetFilters}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Catalog;

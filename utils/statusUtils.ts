import { ServiceStatus } from '../types';
import { TFunction } from '../context/LocaleContext';

export const getStatusColor = (status: ServiceStatus): string => {
  switch (status) {
    case ServiceStatus.Operational: return 'bg-green-600 shadow-[0_0_10px_rgba(22,163,74,0.4)]';
    case ServiceStatus.Degraded: return 'bg-yellow-600 shadow-[0_0_10px_rgba(202,138,4,0.4)]';
    case ServiceStatus.Outage: return 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.4)]';
    case ServiceStatus.Maintenance: return 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]';
    default: return 'bg-gray-600';
  }
};

export const getStatusText = (status: ServiceStatus, t: TFunction): string => {
  switch (status) {
    case ServiceStatus.Operational: return t('constants.status.statuses.operational');
    case ServiceStatus.Degraded: return t('constants.status.statuses.degraded');
    case ServiceStatus.Outage: return t('constants.status.statuses.outage');
    case ServiceStatus.Maintenance: return t('constants.status.statuses.maintenance');
    default: return t('constants.status.statuses.unknown');
  }
};

export const getHealthBarColor = (value: number): string => {
    if (value < 50) return 'bg-red-600/80 hover:bg-red-500';
    if (value < 90) return 'bg-amber-600/80 hover:bg-amber-500';
    return 'bg-emerald-600/80 hover:bg-emerald-500';
};
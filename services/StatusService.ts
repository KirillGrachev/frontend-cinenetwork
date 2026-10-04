import type { Incident, ServiceGroup } from '../types';
import type { IStatusDataProvider } from './providers/types';
import { getStatusDataProvider } from './providers/providerFactory';

/**
 * Status-page data. The service-status fixture moved to the mock provider
 * (services must not embed data), and its uptime history is now
 * deterministic — it used to be re-randomised on every call, so the charts
 * changed each time the query refetched.
 */
export class StatusService {
    constructor(private readonly provider: IStatusDataProvider = getStatusDataProvider()) {}

    getSystemStatus = (): Promise<ServiceGroup[]> => {
        return this.provider.getSystemStatus();
    };

    getIncidents = (): Promise<Incident[]> => {
        return this.provider.getIncidents();
    };
}


import { BaseService } from './BaseService';
import { ServiceGroup, ServiceStatus } from '../types';

export class StatusService extends BaseService {
    
    getSystemStatus = (): Promise<ServiceGroup[]> => {
        return this.cachedRequest('systemStatus', async () => {
            await this.fakeDelay(800);
            
            // Helper to generate history
            const generateHistory = (min: number, max: number) => 
                Array.from({ length: 24 }, () => Math.floor(Math.random() * (max - min + 1) + min));

            // Dynamic Mock Data
            return [
                {
                    name: 'constants.status.groups.platform',
                    services: [
                        { id: "web", name: 'constants.status.services.web', status: ServiceStatus.Operational, uptime: 99.99, history: generateHistory(92, 100) },
                        { id: "api", name: 'constants.status.services.api', status: ServiceStatus.Operational, uptime: 99.95, latency: 45, history: generateHistory(85, 98) },
                        { id: "auth", name: 'constants.status.services.auth', status: ServiceStatus.Operational, uptime: 100, history: generateHistory(98, 100) },
                    ]
                },
                {
                    name: 'constants.status.groups.media',
                    services: [
                        { id: "encoding", name: 'constants.status.services.encoding', status: ServiceStatus.Operational, uptime: 100, history: generateHistory(95, 100) },
                        { id: "storage", name: 'constants.status.services.storage', status: ServiceStatus.Degraded, uptime: 99.8, history: [...generateHistory(80, 95).slice(0, 22), 45, 60] },
                    ]
                },
                {
                    name: 'constants.status.groups.databases',
                    services: [
                        { id: "mainDb", name: 'constants.status.services.mainDb', status: ServiceStatus.Operational, uptime: 100, latency: 12, history: generateHistory(98, 100) },
                        { id: "search", name: 'constants.status.services.search', status: ServiceStatus.Operational, uptime: 99.99, latency: 25, history: generateHistory(90, 100) },
                    ]
                }
            ];
        });
    }
}

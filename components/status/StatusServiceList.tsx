import React from 'react';
import { ServiceGroup } from '../../types';
import StatusServiceItem from './StatusServiceItem';

interface StatusServiceListProps {
  groups: ServiceGroup[];
  expandedServiceId: string | null;
  onToggle: (id: string) => void;
}

const StatusServiceList: React.FC<StatusServiceListProps> = ({ groups, expandedServiceId, onToggle }) => {
  return (
    <div className="space-y-8 ">
        {groups.map((group, groupIdx) => (
            <div key={groupIdx} className="bg-background-secondary rounded-3xl border border-border-medium overflow-hidden shadow-xl">
                <div className="px-6 py-4 border-b border-border-light bg-panel-primary min-h-[57px] flex items-center">
                    <h3 className="font-bold text-white text-lg">{group.name}</h3>
                </div>
                
                <div className="divide-y divide-border-light">
                    {group.services.map((service) => (
                        <StatusServiceItem 
                            key={service.id}
                            service={service}
                            isExpanded={expandedServiceId === service.id}
                            onToggle={onToggle}
                        />
                    ))}
                </div>
            </div>
        ))}
    </div>
  );
};

export default StatusServiceList;

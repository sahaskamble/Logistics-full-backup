import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import ServiceDetails from './ServiceDetails';

export default function TabsSection({ userServiceProviders = [], onRefreshServiceProviders }) {
  const [activeTab, setActiveTab] = useState('CFS');

  const handleServiceProviderUpdate = () => {
    // Refresh service providers data
    if (onRefreshServiceProviders) {
      onRefreshServiceProviders();
    }
  };

  const serviceTypes = [
    { id: 'CFS', label: 'CFS' },
    { id: 'Transport', label: 'Transport' },
    { id: '3PL', label: '3PL' },
    { id: 'Warehouse', label: 'Warehouse' }
  ];

  return (
    <div className="mt-6">
      <Tabs defaultValue="CFS" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-center">
          {serviceTypes.map((service) => (
            <TabsTrigger key={service.id} value={service.id} className="w-full">
              {service.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {serviceTypes.map((service) => (
          <TabsContent key={service.id} value={service.id}>
            <ServiceDetails
              serviceType={service.id}
              serviceProviders={userServiceProviders.filter(sp =>
                sp.expand?.service?.some(s => s.title === service.id)
              )}
              onServiceProviderUpdate={handleServiceProviderUpdate}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

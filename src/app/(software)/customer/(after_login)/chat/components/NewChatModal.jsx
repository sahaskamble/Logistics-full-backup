import React, { useState, useEffect } from 'react';
import { X, Search, User, Package, Truck, Building, Warehouse, MessageCircle } from 'lucide-react';
import { useCollection } from '@/hooks/useCollection';

export default function NewChatModal({ onClose, onCreateChat }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [subject, setSubject] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [step, setStep] = useState(1); // 1: Select Client, 2: Chat Details

  // Fetch clients (users with role "Client")
  const { data: clients, loading } = useCollection('users', {
    filter: 'role = "Client"',
    sort: 'firstname'
  });

  const serviceTypes = [
    { value: 'CFS', label: 'Container Freight Station', icon: Package, color: 'text-blue-600 bg-blue-100' },
    { value: 'Transport', label: 'Transport Services', icon: Truck, color: 'text-green-600 bg-green-100' },
    { value: '3PL', label: 'Third Party Logistics', icon: Building, color: 'text-purple-600 bg-purple-100' },
    { value: 'Warehouse', label: 'Warehouse Services', icon: Warehouse, color: 'text-orange-600 bg-orange-100' }
  ];

  // Filter clients based on search term
  const filteredClients = clients?.filter(client => {
    const fullName = `${client.firstname || ''} ${client.lastname || ''}`.toLowerCase();
    const username = (client.username || '').toLowerCase();
    const email = (client.email || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || username.includes(search) || email.includes(search);
  }) || [];

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setStep(2);
  };

  const handleCreateChat = () => {
    if (!selectedClient || !subject.trim()) return;
    
    onCreateChat(selectedClient.id, subject.trim(), serviceType);
  };

  const getDisplayName = (client) => {
    const fullName = `${client.firstname || ''} ${client.lastname || ''}`.trim();
    return fullName || client.username || client.email || 'Unknown User';
  };

  const getServiceIcon = (serviceValue) => {
    const service = serviceTypes.find(s => s.value === serviceValue);
    return service?.icon || MessageCircle;
  };

  const getServiceColor = (serviceValue) => {
    const service = serviceTypes.find(s => s.value === serviceValue);
    return service?.color || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {step === 1 ? 'Start New Chat' : 'Chat Details'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            /* Step 1: Select Client */
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select a service provider to chat with:
                </label>
                
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search by name, username, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Clients List */}
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredClients.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredClients.map((client) => (
                      <div
                        key={client.id}
                        onClick={() => handleClientSelect(client)}
                        className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <User size={20} className="text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {getDisplayName(client)}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {client.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    <div className="text-center">
                      <User size={48} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        {searchTerm ? 'No clients found' : 'No clients available'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Step 2: Chat Details */
            <div className="space-y-4">
              {/* Selected Client */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {getDisplayName(selectedClient)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedClient.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {serviceTypes.map((service) => {
                    const ServiceIcon = service.icon;
                    const isSelected = serviceType === service.value;
                    
                    return (
                      <button
                        key={service.value}
                        onClick={() => setServiceType(isSelected ? '' : service.value)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-1">
                          <div className={`p-2 rounded-full ${service.color}`}>
                            <ServiceIcon size={16} />
                          </div>
                          <span className="text-xs font-medium text-gray-700">
                            {service.value}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  placeholder="What would you like to discuss?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateChat}
                  disabled={!subject.trim()}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    subject.trim()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Start Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

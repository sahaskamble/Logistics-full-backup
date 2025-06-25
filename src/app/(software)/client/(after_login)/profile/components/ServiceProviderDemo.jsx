import React, { useState } from 'react';
import ServiceDetails from './ServiceDetails';
import Button from '@/components/ui/Button';
import { RefreshCw, Users, FileText } from 'lucide-react';

/**
 * Demo component to showcase the Service Provider functionality
 * This demonstrates both scenarios: with and without service providers
 */
export default function ServiceProviderDemo() {
  const [hasServiceProviders, setHasServiceProviders] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState('CFS');

  // Mock service provider data for demonstration
  const mockServiceProviders = hasServiceProviders ? [
    {
      id: 'SP-123456789012',
      title: 'Global Logistics Solutions',
      description: 'Leading CFS provider with state-of-the-art facilities and 24/7 operations.',
      location: 'Mumbai Port, India',
      contact: '+91-9876543210',
      tariffRates: 2500,
      freeDays: 7,
      monthlyDues: 15000,
      rating: 4.8,
      features: ['Container Handling', 'Customs Clearance', 'Storage Facilities', 'Documentation'],
      tags: ['CFS', 'Storage', 'Customs'],
      files: ['facility1.jpg', 'certificate.pdf', 'brochure.pdf'],
      expand: {
        service: [{ id: 'cfs-service', title: selectedServiceType }]
      }
    }
  ] : [];

  const serviceTypes = ['CFS', 'Transport', '3PL', 'Warehouse'];

  const handleServiceProviderUpdate = () => {
    // Simulate data refresh
    console.log('Service provider data refreshed');
  };

  const toggleServiceProviders = () => {
    setHasServiceProviders(!hasServiceProviders);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Demo Controls */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-4">Service Provider Management Demo</h2>
        
        <div className="flex flex-wrap gap-4 items-center">
          {/* Service Provider Toggle */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-blue-700">Demo Mode:</label>
            <Button
              variant={hasServiceProviders ? "default" : "outline"}
              title={hasServiceProviders ? "With Service Providers" : "No Service Providers"}
              icon={hasServiceProviders ? <Users size={16} /> : <FileText size={16} />}
              onClick={toggleServiceProviders}
              className="text-sm"
            />
          </div>

          {/* Service Type Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-blue-700">Service Type:</label>
            <select
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value)}
              className="px-3 py-1 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {serviceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            title="Refresh Data"
            icon={<RefreshCw size={16} />}
            onClick={handleServiceProviderUpdate}
            className="text-sm"
          />
        </div>

        {/* Demo Status */}
        <div className="mt-4 p-3 bg-white rounded-md border">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Current State:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              hasServiceProviders 
                ? 'bg-green-100 text-green-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {hasServiceProviders 
                ? `${mockServiceProviders.length} Service Provider(s) Found` 
                : 'No Service Providers'
              }
            </span>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">✨ When No Service Providers:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Shows "Add Service Info" prompt</li>
              <li>• Comprehensive service provider form</li>
              <li>• File upload for images & documents</li>
              <li>• Features and tags management</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">🏢 When Service Providers Exist:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Shows service provider details</li>
              <li>• Enhanced gallery with file management</li>
              <li>• Edit mode for updating information</li>
              <li>• Individual and bulk file operations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Service Details Demo */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {selectedServiceType} Service Management
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {hasServiceProviders 
              ? "Service provider exists - showing management interface" 
              : "No service provider found - showing add service form"
            }
          </p>
        </div>

        <ServiceDetails
          serviceType={selectedServiceType}
          serviceProviders={mockServiceProviders}
          onServiceProviderUpdate={handleServiceProviderUpdate}
        />
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-2">How to Test:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h5 className="font-medium mb-1">No Service Providers Mode:</h5>
            <ul className="space-y-1">
              <li>• Click "No Service Providers" button above</li>
              <li>• See the "Add Service Info" prompt</li>
              <li>• Click "Add [ServiceType] Service Info"</li>
              <li>• Fill out the comprehensive form</li>
              <li>• Upload files and add features</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-1">With Service Providers Mode:</h5>
            <ul className="space-y-1">
              <li>• Click "With Service Providers" button above</li>
              <li>• See the service provider details</li>
              <li>• Try the enhanced gallery features</li>
              <li>• Test file upload and management</li>
              <li>• Use edit mode to modify details</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Schema Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">📋 Database Schema Integration:</h4>
        <div className="text-sm text-yellow-700">
          <p className="mb-2">
            The form creates records in the <code className="bg-yellow-100 px-1 rounded">service_provider</code> collection 
            according to the schema defined in <code className="bg-yellow-100 px-1 rounded">schema-v0.0.8.json</code>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div>
              <strong>Basic Fields:</strong>
              <ul className="mt-1">
                <li>• title (required)</li>
                <li>• description (required)</li>
                <li>• location</li>
                <li>• contact</li>
              </ul>
            </div>
            <div>
              <strong>Pricing Fields:</strong>
              <ul className="mt-1">
                <li>• tariffRates</li>
                <li>• freeDays</li>
                <li>• monthlyDues</li>
                <li>• rating</li>
              </ul>
            </div>
            <div>
              <strong>Complex Fields:</strong>
              <ul className="mt-1">
                <li>• service (relation)</li>
                <li>• features (JSON array)</li>
                <li>• tags (JSON array)</li>
                <li>• files (file array)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

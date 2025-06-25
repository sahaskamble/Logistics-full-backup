import React, { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import { CircularProgress, ProgressBar, SegmentedProgress, MiniProgressRing } from './CircularProgress';
import { calculateProfileCompletion, getCompletionColor } from '../utils/profileCompletion';
import Button from '@/components/ui/Button';
import { RefreshCw, User, Building, Settings } from 'lucide-react';

/**
 * Demo component to showcase the Profile Completion functionality
 * This demonstrates different completion scenarios and progress visualizations
 */
export default function ProfileCompletionDemo() {
  const [demoScenario, setDemoScenario] = useState('incomplete');

  // Demo scenarios with different completion levels
  const scenarios = {
    incomplete: {
      name: 'New User (25%)',
      user: {
        id: 'demo-user-1',
        firstname: 'John',
        lastname: '',
        email: 'john@example.com',
        avatar: null
      },
      userProfile: [],
      serviceProviders: []
    },
    partial: {
      name: 'Partial Profile (60%)',
      user: {
        id: 'demo-user-2',
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'jane.smith@example.com',
        avatar: '/demo-avatar.jpg'
      },
      userProfile: [{
        address: '123 Business Street, Mumbai',
        contact: '+91-9876543210',
        businessName: 'Smith Logistics',
        gstIn: '',
        panNo: '',
        documents: []
      }],
      serviceProviders: [{
        id: 'SP-123456789012',
        expand: {
          service: [{ title: 'CFS' }]
        }
      }]
    },
    complete: {
      name: 'Complete Profile (95%)',
      user: {
        id: 'demo-user-3',
        firstname: 'Rajesh',
        lastname: 'Kumar',
        email: 'rajesh.kumar@logistics.com',
        avatar: '/demo-avatar.jpg'
      },
      userProfile: [{
        address: '456 Port Road, Chennai',
        contact: '+91-9876543210',
        businessName: 'Kumar Freight Solutions',
        gstIn: '27ABCDE1234F1Z5',
        panNo: 'ABCDE1234F',
        documents: ['gst-certificate.pdf', 'pan-card.jpg', 'business-license.pdf']
      }],
      serviceProviders: [
        {
          id: 'SP-123456789012',
          expand: { service: [{ title: 'CFS' }] }
        },
        {
          id: 'SP-123456789013',
          expand: { service: [{ title: 'Transport' }] }
        },
        {
          id: 'SP-123456789014',
          expand: { service: [{ title: '3PL' }] }
        }
      ]
    }
  };

  const currentScenario = scenarios[demoScenario];
  const completion = calculateProfileCompletion(
    currentScenario.user,
    currentScenario.userProfile,
    currentScenario.serviceProviders
  );

  const completionColor = getCompletionColor(completion.percentage);

  // Prepare segmented progress data
  const segmentedData = [
    {
      label: 'Basic Info',
      completed: completion.details.basicInfo.completed,
      total: completion.details.basicInfo.total,
      weight: completion.details.basicInfo.total,
      color: '#3B82F6' // blue
    },
    {
      label: 'Profile Details',
      completed: completion.details.userProfile.completed,
      total: completion.details.userProfile.total,
      weight: completion.details.userProfile.total,
      color: '#10B981' // green
    },
    {
      label: 'Service Providers',
      completed: completion.details.serviceProviders.completed,
      total: completion.details.serviceProviders.total,
      weight: completion.details.serviceProviders.total,
      color: '#F59E0B' // amber
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Demo Controls */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-4">Profile Completion Progress Demo</h2>
        
        <div className="flex flex-wrap gap-4 items-center">
          {/* Scenario Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-blue-700">Demo Scenario:</label>
            <div className="flex gap-2">
              {Object.entries(scenarios).map(([key, scenario]) => (
                <Button
                  key={key}
                  variant={demoScenario === key ? "default" : "outline"}
                  title={scenario.name}
                  onClick={() => setDemoScenario(key)}
                  className="text-sm"
                />
              ))}
            </div>
          </div>

          {/* Current Progress */}
          <div className="flex items-center gap-2 ml-auto">
            <MiniProgressRing 
              percentage={completion.percentage} 
              color={completionColor.color}
              size={40}
            />
            <span className="text-sm font-medium text-blue-700">
              {completion.percentage}% Complete
            </span>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-800 mb-2 flex items-center">
              <User size={16} className="mr-1" />
              Basic Information
            </h4>
            <ul className="space-y-1 text-blue-700">
              <li>• First & Last Name</li>
              <li>• Email Address</li>
              <li>• Profile Picture</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2 flex items-center">
              <Building size={16} className="mr-1" />
              Profile Details
            </h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Address & Contact</li>
              <li>• Business Information</li>
              <li>• GST & PAN Details</li>
              <li>• Document Uploads</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2 flex items-center">
              <Settings size={16} className="mr-1" />
              Service Providers
            </h4>
            <ul className="space-y-1 text-blue-700">
              <li>• CFS Services</li>
              <li>• Transport Services</li>
              <li>• 3PL Services</li>
              <li>• Warehouse Services</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Profile Header Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Header with Progress Ring */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Header with Progress Ring</h3>
          <ProfileHeader
            user={currentScenario.user}
            userProfile={currentScenario.userProfile}
            serviceProviders={currentScenario.serviceProviders}
            onAvatarUpdate={() => console.log('Avatar updated')}
          />
        </div>

        {/* Progress Visualizations */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Alternative Progress Views</h3>
            
            {/* Circular Progress */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Circular Progress</h4>
              <div className="flex justify-center">
                <CircularProgress
                  percentage={completion.percentage}
                  color={completionColor.color}
                  size={120}
                  strokeWidth={8}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: completionColor.color }}>
                      {completion.percentage}%
                    </div>
                    <div className="text-xs text-gray-500">Complete</div>
                  </div>
                </CircularProgress>
              </div>
            </div>

            {/* Linear Progress Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Linear Progress Bar</h4>
              <ProgressBar
                percentage={completion.percentage}
                color={completionColor.color}
                height={12}
                showPercentage={true}
                animated={true}
              />
            </div>

            {/* Segmented Progress */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Segmented Progress</h4>
              <SegmentedProgress
                segments={segmentedData}
                showLabels={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Completion Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Completion Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Info */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Basic Information</h4>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {Math.round((completion.details.basicInfo.completed / completion.details.basicInfo.total) * 100)}%
            </div>
            <div className="text-sm text-gray-500 mb-3">
              {completion.details.basicInfo.completed}/{completion.details.basicInfo.total} points
            </div>
            <div className="space-y-1">
              {completion.details.basicInfo.fields.map((field, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    field.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className={field.completed ? 'text-gray-700' : 'text-gray-400'}>
                    {field.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Details */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Profile Details</h4>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {Math.round((completion.details.userProfile.completed / completion.details.userProfile.total) * 100)}%
            </div>
            <div className="text-sm text-gray-500 mb-3">
              {completion.details.userProfile.completed}/{completion.details.userProfile.total} points
            </div>
            <div className="space-y-1">
              {completion.details.userProfile.fields.map((field, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    field.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className={field.completed ? 'text-gray-700' : 'text-gray-400'}>
                    {field.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Providers */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Service Providers</h4>
            <div className="text-2xl font-bold text-amber-600 mb-1">
              {Math.round((completion.details.serviceProviders.completed / completion.details.serviceProviders.total) * 100)}%
            </div>
            <div className="text-sm text-gray-500 mb-3">
              {completion.details.serviceProviders.completed}/{completion.details.serviceProviders.total} points
            </div>
            <div className="space-y-1">
              {completion.details.serviceProviders.fields.map((field, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    field.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className={field.completed ? 'text-gray-700' : 'text-gray-400'}>
                    {field.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suggestions */}
        {completion.suggestions.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-700 mb-3">Suggestions to Improve Profile</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {completion.suggestions.slice(0, 6).map((suggestion, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mr-2" />
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Implementation Notes */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-2">🔧 Implementation Features:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h5 className="font-medium mb-1">Progress Calculation:</h5>
            <ul className="space-y-1">
              <li>• Weighted scoring system</li>
              <li>• Real-time updates</li>
              <li>• Multi-collection analysis</li>
              <li>• Smart suggestions</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-1">Visual Components:</h5>
            <ul className="space-y-1">
              <li>• Circular progress ring</li>
              <li>• Color-coded status</li>
              <li>• Expandable details</li>
              <li>• Multiple visualization options</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

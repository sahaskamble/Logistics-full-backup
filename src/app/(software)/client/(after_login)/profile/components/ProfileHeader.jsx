import React, { useState } from 'react';
import { Camera, Upload, Info } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import pbclient from '@/lib/db';
import { ProfileProgressRing } from './CircularProgress';
import { calculateProfileCompletion, getCompletionColor, getCompletionMessage, getPrioritySuggestions } from '../utils/profileCompletion';

export default function ProfileHeader({ user, onAvatarUpdate, userProfile = [], serviceProviders = [] }) {
  const [isUploading, setIsUploading] = useState(false);
  const [showProgressDetails, setShowProgressDetails] = useState(false);
  const { user: authUser } = useAuth();

  // Calculate profile completion
  const completion = calculateProfileCompletion(user, userProfile, serviceProviders);
  const completionColor = getCompletionColor(completion.percentage);
  const completionMessage = getCompletionMessage(completion.percentage);
  const prioritySuggestions = getPrioritySuggestions(completion.suggestions);

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const updatedUser = await pbclient.collection('users').update(user.id, formData);
      
      if (onAvatarUpdate) {
        onAvatarUpdate(updatedUser);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const getAvatarUrl = () => {
    if (user?.avatar) {
      return pbclient.files.getURL(user, user.avatar);
    }
    return null;
  };

  const getDisplayName = () => {
    if (user?.firstname && user?.lastname) {
      return `${user.firstname} ${user.lastname}`;
    }
    return user?.name || user?.username || 'User';
  };

  return (
    <div className="bg-[var(--accent)] rounded-xl p-8 border-2 border-gray-300 h-fit">
      <div className="flex flex-col items-center space-y-6">
        {/* Avatar Section with Progress Ring */}
        <div className="relative">
          <ProfileProgressRing
            percentage={completion.percentage}
            color={completionColor.color}
            size={150}
          >
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-xl">
              {getAvatarUrl() ? (
                <img
                  src={getAvatarUrl()}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl font-bold">
                  {getDisplayName().charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </ProfileProgressRing>

          {/* Camera Icon Overlay */}
          <div className="absolute bottom-6 right-6 bg-white rounded-full p-2 shadow-lg border-2 border-gray-200">
            <Camera size={18} className="text-gray-600" />
          </div>

          {/* Progress Info Button */}
          <button
            onClick={() => setShowProgressDetails(!showProgressDetails)}
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg border-2 border-gray-200 hover:bg-gray-50 transition-colors"
            title="View profile completion details"
          >
            <Info size={16} className="text-gray-600" />
          </button>
        </div>

        {/* User Name and Progress Status */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            {getDisplayName()}
          </h3>
          <p className="text-sm text-gray-600 mb-2">Merchant User</p>

          {/* Progress Status */}
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: completionColor.bgColor,
              color: completionColor.textColor
            }}
          >
            <div
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: completionColor.color }}
            />
            {completion.percentage}% Complete
          </div>

          <p className="text-xs text-gray-500 mt-2 max-w-xs">
            {completionMessage}
          </p>
        </div>

        {/* Progress Details (Collapsible) */}
        {showProgressDetails && (
          <div className="w-full bg-white rounded-lg border border-gray-200 p-4 text-left">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Profile Completion Details</h4>

            {/* Progress Breakdown */}
            <div className="space-y-3 text-xs">
              {/* Basic Info */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-700">Basic Information</span>
                  <span className="text-gray-500">
                    {completion.details.basicInfo.completed}/{completion.details.basicInfo.total}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {completion.details.basicInfo.fields.map((field, index) => (
                    <div key={index} className="flex items-center">
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

              {/* User Profile */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-700">Profile Details</span>
                  <span className="text-gray-500">
                    {completion.details.userProfile.completed}/{completion.details.userProfile.total}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {completion.details.userProfile.fields.map((field, index) => (
                    <div key={index} className="flex items-center">
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
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-700">Service Providers</span>
                  <span className="text-gray-500">
                    {completion.details.serviceProviders.completed}/{completion.details.serviceProviders.total}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {completion.details.serviceProviders.fields.map((field, index) => (
                    <div key={index} className="flex items-center">
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

            {/* Priority Suggestions */}
            {prioritySuggestions.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <h5 className="text-xs font-semibold text-gray-700 mb-2">Next Steps:</h5>
                <ul className="space-y-1">
                  {prioritySuggestions.map((suggestion, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-center">
                      <div className="w-1 h-1 bg-blue-500 rounded-full mr-2" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Upload Button */}
        <div className="w-full">
          <label htmlFor="avatar-upload" className="cursor-pointer block">
            <Button
              variant="outline"
              title={isUploading ? "Uploading..." : "Upload / Change Photo"}
              icon={<Upload size={16} />}
              disabled={isUploading}
              className="w-full text-sm justify-center"
            />
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}

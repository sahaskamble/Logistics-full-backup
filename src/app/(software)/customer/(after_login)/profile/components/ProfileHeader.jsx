'use client'
import { useState, useMemo } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import pbclient from '@/lib/db';
import { toast } from 'sonner';

export default function ProfileHeader({ user, onUserUpdate, userProfile }) {
  const [isUploading, setIsUploading] = useState(false);
  const { user: authUser } = useAuth();

  // Calculate profile completion percentage and missing fields
  const { profileCompletion, missingFields } = useMemo(() => {
    if (!user) return { profileCompletion: 0, missingFields: [] };

    const requiredFields = [
      { field: 'firstname', label: 'First Name', weight: 15, value: user.firstname },
      { field: 'lastname', label: 'Last Name', weight: 15, value: user.lastname },
      { field: 'phone', label: 'Phone Number', weight: 15, value: user.phone },
      { field: 'avatar', label: 'Profile Picture', weight: 10, value: user.avatar },
      { field: 'businessName', label: 'Company Name', weight: 15, value: userProfile?.businessName },
      { field: 'address', label: 'Address', weight: 15, value: userProfile?.address },
      { field: 'documents', label: 'Documents', weight: 15, value: userProfile?.documents?.length > 0 }
    ];

    const completedWeight = requiredFields.reduce((total, field) => {
      return total + (field.value ? field.weight : 0);
    }, 0);

    const missing = requiredFields.filter(field => !field.value).map(field => field.label);

    return {
      profileCompletion: Math.round(completedWeight),
      missingFields: missing
    };
  }, [user, userProfile]);

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const updatedUser = await pbclient.collection('users').update(user.id, formData);

      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload profile picture');
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

  const getInitials = () => {
    if (user?.firstname && user?.lastname) {
      return `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase();
    }
    if (user?.name) {
      const names = user.name.split(' ');
      return names.length > 1
        ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
        : names[0].charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  // Get progress color based on completion percentage
  const getProgressColor = () => {
    if (profileCompletion >= 80) return '#10B981'; // Green
    if (profileCompletion >= 60) return '#F59E0B'; // Yellow
    if (profileCompletion >= 40) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  // Calculate stroke dash array for circular progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (profileCompletion / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          {/* Circular Progress Bar */}
          <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 144 144">
            {/* Background circle */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="#E5E7EB"
              strokeWidth="4"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke={getProgressColor()}
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-in-out"
              style={{
                filter: profileCompletion > 0 ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))' : 'none'
              }}
            />
          </svg>

          {/* Avatar Circle */}
          <div className="absolute inset-2 w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg overflow-hidden">
            {getAvatarUrl() ? (
              <img
                src={getAvatarUrl()}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-3xl font-bold">
                {getInitials()}
              </span>
            )}
          </div>

          {/* Camera Icon for Upload */}
          <label
            htmlFor="avatar-upload"
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200 cursor-pointer flex items-center justify-center"
          >
            {isUploading ? (
              <RefreshCw className="w-5 h-5 text-red-500 animate-spin" />
            ) : (
              <Camera className="w-5 h-5 text-red-500" />
            )}
          </label>
          <div className="absolute bottom-1 right-1">
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={isUploading}
            />
          </div>

          {/* Progress Percentage Display */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="bg-white rounded-full px-3 py-1 shadow-lg border">
              <span className="text-xs font-semibold" style={{ color: getProgressColor() }}>
                {profileCompletion}%
              </span>
            </div>
          </div>
        </div>

        {/* Profile Completion Status */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Profile Completion</h3>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 ease-in-out rounded-full"
                style={{
                  width: `${profileCompletion}%`,
                  backgroundColor: getProgressColor()
                }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600">
              {profileCompletion}% Complete
            </span>
          </div>

          {/* Completion Message */}
          <p className="text-sm text-gray-500">
            {profileCompletion === 100
              ? "🎉 Your profile is complete!"
              : profileCompletion >= 80
                ? "Almost there! Just a few more details needed."
                : profileCompletion >= 60
                  ? "Good progress! Keep adding your information."
                  : profileCompletion >= 40
                    ? "Getting started! Please complete your profile."
                    : "Let's get your profile set up!"
            }
          </p>

          {/* Missing Fields Indicator */}
          {profileCompletion < 100 && missingFields.length > 0 && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-medium text-blue-800 mb-1">Missing Information:</p>
              <div className="flex flex-wrap gap-1">
                {missingFields.slice(0, 3).map((field, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {field}
                  </span>
                ))}
                {missingFields.length > 3 && (
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    +{missingFields.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

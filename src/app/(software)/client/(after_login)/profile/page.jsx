'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCollection } from '@/hooks/useCollection';
import { useSidebar } from '@/contexts/SidebarProvider';
import ProfileHeader from './components/ProfileHeader';
import ProfileForm from './components/ProfileForm';
import TabsSection from './components/TabsSection';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { setTitle } = useSidebar();
  const [currentUser, setCurrentUser] = useState(user);

  // Fetch service providers associated with this user
  const { data: serviceProviders, refetch: refetchServiceProviders } = useCollection('service_provider', {
    expand: 'service,author',
    filter: `author.id = "${user?.id}"`
  });

  // Fetch user profile data
  const { data: userProfile, refetch: refetchUserProfile } = useCollection('user_profile', {
    filter: `user.id = "${user?.id}"`
  });

  useEffect(() => {
    setTitle("Client Profile");
  }, [setTitle]);

  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
    // Update auth context if needed
    if (setUser) {
      setUser(updatedUser);
    }
  };

  const handleAvatarUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
    // Update auth context if needed
    if (setUser) {
      setUser(updatedUser);
    }
  };

  const handleRefreshServiceProviders = () => {
    refetchServiceProviders();
  };

  const handleRefreshUserProfile = () => {
    refetchUserProfile();
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col gap-6">
        {/* Left Column - Profile Header */}
        <div className="lg:col-span-1">
          <ProfileHeader
            user={currentUser}
            onAvatarUpdate={handleAvatarUpdate}
            userProfile={userProfile || []}
            serviceProviders={serviceProviders || []}
          />
        </div>

        {/* Right Column - Profile Form */}
        <div className="lg:col-span-2">
          <ProfileForm
            user={currentUser}
            onUserUpdate={handleUserUpdate}
          />
        </div>
      </div>

      {/* Service Tabs Section */}
      <TabsSection
        userServiceProviders={serviceProviders || []}
        onRefreshServiceProviders={handleRefreshServiceProviders}
      />
    </div>
  );
}

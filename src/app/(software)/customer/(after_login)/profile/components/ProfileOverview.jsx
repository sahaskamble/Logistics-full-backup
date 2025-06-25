'use client'
import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Building, Calendar, CreditCard } from 'lucide-react';
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import pbclient from '@/lib/db';
import { toast } from 'sonner';

export default function ProfileOverview({ user, userProfile, onUserUpdate, refreshProfile, loading }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // User fields
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    // Profile fields
    address: '',
    businessName: '',
    gstIn: '',
    panNo: '',
    contact: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        address: userProfile.address || '',
        businessName: userProfile.businessName || '',
        gstIn: userProfile.gstIn || '',
        panNo: userProfile.panNo || '',
        contact: userProfile.contact || ''
      }));
    }
  }, [userProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Update user data
      const userData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone: formData.phone
      };

      const updatedUser = await pbclient.collection('users').update(user.id, userData);

      // Update or create profile data
      const profileData = {
        user: user.id,
        address: formData.address,
        businessName: formData.businessName,
        gstIn: formData.gstIn,
        panNo: formData.panNo,
        contact: formData.contact
      };

      if (userProfile) {
        await pbclient.collection('user_profile').update(userProfile.id, profileData);
      } else {
        await pbclient.collection('user_profile').create(profileData);
      }

      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      
      refreshProfile();
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getFullName = () => {
    if (formData.firstname && formData.lastname) {
      return `${formData.firstname} ${formData.lastname}`;
    }
    return user?.name || 'N/A';
  };

  const getCustomerId = () => {
    return user?.id || 'N/A';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-800">Profile Overview</h2>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                title="Cancel"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                disabled={isLoading}
              />
              <Button
                title={isLoading ? "Saving..." : "Save Changes"}
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                disabled={isLoading}
              />
            </>
          ) : (
            <Button
              title="Edit Info"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            />
          )}
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label title="Full Name" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Full Name:
          </Label>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleInputChange}
                className="h-12"
              />
              <Input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleInputChange}
                className="h-12"
              />
            </div>
          ) : (
            <div className="h-12 px-3 py-2 border rounded-lg bg-gray-50 flex items-center">
              {getFullName()}
            </div>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label title="Email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email:
          </Label>
          <div className="h-12 px-3 py-2 border rounded-lg bg-gray-50 flex items-center">
            {formData.email}
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label title="Phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone:
          </Label>
          {isEditing ? (
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="h-12"
            />
          ) : (
            <div className="h-12 px-3 py-2 border rounded-lg bg-gray-50 flex items-center">
              {formData.phone || 'N/A'}
            </div>
          )}
        </div>

        {/* Company/Business Name */}
        <div className="space-y-2">
          <Label title="Company" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Company:
          </Label>
          {isEditing ? (
            <Input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              className="h-12"
            />
          ) : (
            <div className="h-12 px-3 py-2 border rounded-lg bg-gray-50 flex items-center">
              {formData.businessName || 'N/A'}
            </div>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label title="Address" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Address:
          </Label>
          {isEditing ? (
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="h-12"
            />
          ) : (
            <div className="h-12 px-3 py-2 border rounded-lg bg-gray-50 flex items-center">
              {formData.address || 'N/A'}
            </div>
          )}
        </div>

        {/* Joined On */}
        <div className="space-y-2">
          <Label title="Joined On" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Joined On:
          </Label>
          <div className="h-12 px-3 py-2 border rounded-lg bg-gray-50 flex items-center">
            {formatDate(user?.created)}
          </div>
        </div>

        {/* Customer ID */}
        <div className="space-y-2 md:col-span-2">
          <Label title="Customer ID" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Customer ID:
          </Label>
          <div className="h-12 px-3 py-2 border rounded-lg bg-gray-50 flex items-center font-mono">
            {getCustomerId()}
          </div>
        </div>
      </div>
    </div>
  );
}

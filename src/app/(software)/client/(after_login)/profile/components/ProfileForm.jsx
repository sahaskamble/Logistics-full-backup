import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Button from '@/components/ui/Button';
import { BuildingIcon, Calendar, Edit, Globe, IdCardIcon, Lock, Mail, Phone, UserRound } from 'lucide-react';
import pbclient from '@/lib/db';
import { toast } from 'sonner';

export default function ProfileForm({ user, onUserUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    // Additional fields that might be in a company profile
    companyName: '',
    address: '',
    phone: '',
    customerId: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || 'Unnati',
        lastname: user.lastname || '',
        email: user.email || '',
        username: user.username || '',
        companyName: user.companyName || 'Acme Logistics Pvt Ltd',
        address: user.address || '123 Street Name, City',
        phone: user.phone || '+91-9876543210',
        customerId: user.id || 'GOL-CUST-00321'
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        username: formData.username,
        // Note: email updates might require verification in PocketBase
      };

      const updatedUser = await pbclient.collection('users').update(user.id, updateData);

      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const formatJoinedDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="bg-[var(--accent)] rounded-xl p-6 border-2 border-gray-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <Label title="Full Name:" className=" flex items-center gap-2 font-medium" icon={<UserRound />} />
            <Input
              name="firstname"
              value={`${formData.firstname} ${formData.lastname}`.trim()}
              onChange={(e) => {
                const names = e.target.value.split(' ');
                setFormData(prev => ({
                  ...prev,
                  firstname: names[0] || '',
                  lastname: names.slice(1).join(' ') || ''
                }));
              }}
              disabled={!isEditing}
              placeholder="Enter full name"
              className={!isEditing ? 'bg-gray-100' : ''}
            />
          </div>

          {/* Company */}
          <div className="flex flex-col gap-2">
            <Label title="Company:" className="flex items-center gap-2 font-medium" icon={<BuildingIcon />} />
            <Input
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Company name"
              className={!isEditing ? 'bg-gray-100' : ''}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label title="Email:" className="flex items-center gap-2 font-medium" icon={<Mail />} />
            <Input
              name="email"
              type="email"
              value={formData.email}
              disabled={true} // Email usually shouldn't be editable
              className="bg-gray-100"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-2">
            <Label title="Address:" className="flex items-center gap-2 font-medium" icon={<Globe />} />
            <Input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter address"
              className={!isEditing ? 'bg-gray-100' : ''}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <Label title="Phone:" className="flex items-center gap-2 font-medium" icon={<Phone />} />
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter phone number"
              className={!isEditing ? 'bg-gray-100' : ''}
            />
          </div>

          {/* Joined On */}
          <div className="flex flex-col gap-2">
            <Label title="Joined On:" className="flex items-center gap-2 font-medium" icon={<Calendar />} />
            <Input
              value={formatJoinedDate(user?.created)}
              disabled={true}
              className="bg-gray-100"
            />
          </div>

          {/* Customer ID */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label title="Customer ID:" className="flex items-center gap-2 font-medium" icon={<IdCardIcon />} />
            <Input
              value={formData.customerId}
              disabled={true}
              className="bg-gray-100"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {!isEditing ? (
            <Button
              type="button"
              variant="default"
              title="Edit Info"
              icon={<Edit size={16} />}
              onClick={() => setIsEditing(true)}
            />
          ) : (
            <>
              <Button
                type="submit"
                variant="default"
                title={isLoading ? "Saving..." : "Save Changes"}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="outline"
                title="Cancel"
                onClick={() => {
                  setIsEditing(false);
                  // Reset form data
                  if (user) {
                    setFormData({
                      firstname: user.firstname || '',
                      lastname: user.lastname || '',
                      email: user.email || '',
                      username: user.username || '',
                      companyName: user.companyName || '',
                      address: user.address || '',
                      phone: user.phone || '',
                      customerId: user.id || ''
                    });
                  }
                }}
              />
            </>
          )}

          <Button
            type="button"
            variant="secondary"
            title="Change Password"
            icon={<Lock size={16} />}
            onClick={() => {
              toast.info('Password change functionality coming soon Contact Administrator');
            }}
          />
        </div>
      </form>
    </div>
  );
}

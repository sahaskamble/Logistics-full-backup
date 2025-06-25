import React, { useState } from 'react';
import { Edit, Plus, Trash2, Check, X, UserPlus, Tag } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Label from '@/components/ui/Label';
import Gallery from './Gallery';
import AddServiceProviderForm from './AddServiceProviderForm';
import { toast } from 'sonner';
import { useCollection } from '@/hooks/useCollection';
import { parseTagsFromResponse, getTagColor } from '../utils/tagUtils';

export default function ServiceDetails({ serviceType, serviceProviders = [], onServiceProviderUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState([]);
  const [newfeatures, setNewFeatures] = useState('');
  const { updateItem } = useCollection('service_provider');

  // Get the first service provider for this service type (assuming one per type for now)
  const serviceProvider = serviceProviders[0];
  const hasServiceProvider = serviceProviders.length > 0;

  React.useEffect(() => {
    if (serviceProvider) {
      setDescription(serviceProvider.description || '');
      // Parse facilities from features JSON or create default
      const features = serviceProvider.features || [];
      setFeatures(Array.isArray(features) ? features : []);
    } else {
      // Default description and facilities based on service type
      const defaultData = {
        CFS: {
          description: "Handles cargo movement and value-added services.",
          facilities: ["Forklift", "Reefer Plug"]
        },
        Transport: {
          description: "Provides transportation and logistics solutions.",
          facilities: ["GPS Tracking", "24/7 Support", "Multi-modal Transport"]
        },
        "3PL": {
          description: "Third-party logistics and supply chain management.",
          facilities: ["Inventory Management", "Order Fulfillment", "Distribution"]
        },
        Warehouse: {
          description: "Storage and distribution services.",
          facilities: ["Climate Control", "Security Systems", "Loading Docks"]
        }
      };

      const serviceData = defaultData[serviceType] || {
        description: "Service description not available.",
        facilities: []
      };

      setDescription(serviceData.description);
      setFeatures(serviceData.facilities);
    }
  }, [serviceProvider?.id, serviceType]); // Only depend on serviceProvider.id to prevent infinite re-renders

  const handleAddFacility = async () => {
    if (!newfeatures.trim()) {
      toast.error('Please enter a valid feature name');
      return;
    }

    try {
      setFeatures(prev => [...prev, newfeatures.trim()]);
      setNewFeatures('');
    } catch (err) {
      toast.error('Error Adding Features')
      console.error(err);
    }
  };

  const handleRemoveFacility = async (index) => {
    try {
      setFeatures(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      toast.error('Error Deleting Feature From List');
      console.error(err);
    }
  };

  const handleEditDescription = async () => {
    if (!serviceProvider?.id) {
      toast.error('No service provider to update');
      return;
    }

    try {
      const res = await updateItem(serviceProvider.id, { description });
      if (!res) {
        toast.error('Error Updating Description');
        return;
      }
      toast.success('Successfully Updated the Description');
      // Refresh parent data
      if (onServiceProviderUpdate) {
        onServiceProviderUpdate();
      }
    } catch (err) {
      toast.error('Error Updating The Edited Description');
      console.error(err);
    }
  };

  const handleSaveChanges = async () => {
    if (!serviceProvider?.id) {
      toast.error('No service provider to update');
      return;
    }

    try {
      const updateData = {
        description,
        features: JSON.stringify(features)
      };

      const res = await updateItem(serviceProvider.id, updateData);
      if (!res) {
        toast.error('Error saving changes');
        return;
      }

      setIsEditing(false);
      toast.success('Changes saved successfully');

      // Refresh parent data
      if (onServiceProviderUpdate) {
        onServiceProviderUpdate();
      }
    } catch (err) {
      toast.error('Error saving changes');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    if (serviceProvider) {
      setDescription(serviceProvider.description || '');
      const features = serviceProvider.features || [];
      setFeatures(Array.isArray(features) ? features : []);
    }
  };

  const handleServiceProviderCreated = () => {
    setShowAddForm(false);
    toast.success('Service provider created successfully!');

    // Notify parent component to refresh data
    if (onServiceProviderUpdate) {
      onServiceProviderUpdate();
    }
  };

  const handleShowAddForm = () => {
    setShowAddForm(true);
  };

  const handleCancelAddForm = () => {
    setShowAddForm(false);
  };

  // Show AddServiceProviderForm if no service provider exists and form is requested
  if (showAddForm || (!hasServiceProvider && !showAddForm)) {
    return (
      <div className="mt-4">
        {!hasServiceProvider && !showAddForm ? (
          // Show "Add Service Info" prompt
          <div className="bg-[var(--accent)] rounded-xl p-8 border-2 border-gray-300 text-center">
            <div className="max-w-md mx-auto">
              <UserPlus size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No {serviceType} Service Provider</h3>
              <p className="text-gray-600 mb-6">
                You haven't set up your {serviceType} service provider profile yet.
                Create one to start offering your services and showcase your capabilities.
              </p>
              <Button
                variant="default"
                title={`Add ${serviceType} Service Info`}
                icon={<UserPlus size={16} />}
                onClick={handleShowAddForm}
                className="w-full"
              />
            </div>
          </div>
        ) : (
          // Show AddServiceProviderForm
          <AddServiceProviderForm
            serviceType={serviceType}
            onServiceProviderCreated={handleServiceProviderCreated}
            onCancel={handleCancelAddForm}
          />
        )}
      </div>
    );
  }

  return (
    <div className="bg-[var(--accent)] rounded-xl p-6 border-2 border-gray-300 mt-4">
      {/* Service Details Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{serviceType} Service Details</h3>
        {!isEditing ? (
          <Button
            variant="outline"
            title="Edit Details"
            icon={<Edit size={16} />}
            onClick={() => setIsEditing(true)}
            className="text-sm"
          />
        ) : (
          <div className="flex gap-2">
            <Button
              variant="default"
              title="Save"
              icon={<Check size={16} />}
              onClick={handleSaveChanges}
              className="text-sm"
            />
            <Button
              variant="outline"
              title="Cancel"
              icon={<X size={16} />}
              onClick={handleCancel}
              className="text-sm"
            />
          </div>
        )}
      </div>

      {/* Description Section */}
      <div className="mb-6">
        <Label title="Description:" className="mb-2 block" />
        {isEditing ? (
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter service description..."
            className="w-full"
            rows={3}
          />
        ) : (
          <p className="text-gray-700 bg-white p-3 rounded-md border">
            "{description}"
          </p>
        )}
        {isEditing && (
          <Button
            variant="link"
            title="Edit Description"
            onClick={handleEditDescription}
            className="text-sm mt-2"
          />
        )}
      </div>

      {/* Facilities Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <Label title="Facility & Services Offered:" className="text-gray-800" />
          {isEditing && (
            <Button
              variant="outline"
              title="Add New Service"
              icon={<Plus size={16} />}
              onClick={() => {
                // Focus on the input field
                document.getElementById('new-facility-input')?.focus();
              }}
              className="text-sm"
            />
          )}
        </div>

        {/* Facilities List */}
        <div className="space-y-2">
          {features.map((facility, index) => (
            <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-md border">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">{facility}</span>
              </div>
              <div className="ml-auto flex gap-2">
                {isEditing && (
                  <>
                    <Button
                      variant="none"
                      icon={<Edit size={14} />}
                      onClick={() => {
                        // TODO: Implement inline editing
                        toast.info('Inline editing coming soon');
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50"
                    />
                    <Button
                      variant="none"
                      icon={<Trash2 size={14} />}
                      onClick={() => handleRemoveFacility(index)}
                      className="p-1 text-red-600 hover:bg-red-50"
                    />
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Add New Facility Input */}
          {isEditing && (
            <div className="flex gap-2 bg-white p-3 rounded-md border border-dashed border-gray-300">
              <Input
                id="new-facility-input"
                value={newfeatures}
                onChange={(e) => setNewFeatures(e.target.value)}
                placeholder="Enter new facility or service..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFacility();
                  }
                }}
              />
              <Button
                variant="default"
                title="Add"
                icon={<Plus size={16} />}
                onClick={handleAddFacility}
                disabled={!newfeatures.trim()}
                className="text-sm"
              />
            </div>
          )}
        </div>

        {features.length === 0 && !isEditing && (
          <div className="text-center py-8 text-gray-500">
            <p>No facilities listed yet.</p>
            <Button
              variant="outline"
              title="Add Services"
              icon={<Plus size={16} />}
              onClick={() => setIsEditing(true)}
              className="mt-2"
            />
          </div>
        )}
      </div>

      {/* Tags Section */}
      {serviceProvider?.tags && (
        <div className="mb-6">
          <Label title="Tags:" className="mb-3 block text-gray-800" />
          <div className="flex flex-wrap gap-2">
            {parseTagsFromResponse(serviceProvider.tags).map((tag, index) => {
              const tagColor = getTagColor(tag);
              return (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: tagColor.bg,
                    color: tagColor.text,
                    border: `1px solid ${tagColor.border}`
                  }}
                >
                  <Tag size={12} />
                  {tag}
                </span>
              );
            })}
          </div>
          {parseTagsFromResponse(serviceProvider.tags).length === 0 && (
            <p className="text-gray-500 italic">No tags available</p>
          )}
        </div>
      )}

      {/* Gallery Section */}
      <Gallery
        serviceProvider={serviceProvider}
        serviceType={serviceType}
        isEditing={isEditing}
      />
    </div>
  );
}

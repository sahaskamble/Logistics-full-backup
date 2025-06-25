import React, { useState, useEffect } from 'react';
import { Plus, X, Save, Upload, MapPin, Phone, Star, Tag, Lightbulb } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Label from '@/components/ui/Label';
import { useCollection } from '@/hooks/useCollection';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import pbclient from '@/lib/db';
import { formatTagsForSubmission, isValidTag, sanitizeTag, getSuggestedTags, getTagColor } from '../utils/tagUtils';

export default function AddServiceProviderForm({ serviceType, onServiceProviderCreated, onCancel }) {
  const { user } = useAuth();
  const { data: services } = useCollection('services');
  const { createItem: createServiceProvider } = useCollection('service_provider');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    contact: '',
    tariffRates: '',
    freeDays: '',
    monthlyDues: '',
    rating: 5,
    service: [], // Array of service IDs
    features: [],
    tags: [],
    files: []
  });

  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showSuggestedTags, setShowSuggestedTags] = useState(false);

  // Get suggested tags for the service type
  const suggestedTags = getSuggestedTags(serviceType);

  // Get available services for the service type
  const availableServices = services?.filter(service => 
    service.title?.toLowerCase() === serviceType.toLowerCase()
  ) || [];

  useEffect(() => {
    // Auto-select the service based on serviceType
    if (availableServices.length > 0 && formData.service.length === 0) {
      setFormData(prev => ({
        ...prev,
        service: [availableServices[0].id]
      }));
    }
  }, [availableServices.length, formData.service.length]); // Only depend on length to prevent infinite re-renders

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) {
      toast.error('Please enter a feature name');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, newFeature.trim()]
    }));
    setNewFeature('');
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = () => {
    const sanitizedTag = sanitizeTag(newTag);

    if (!sanitizedTag) {
      toast.error('Please enter a valid tag');
      return;
    }

    if (!isValidTag(sanitizedTag)) {
      toast.error('Tag must be 2-50 characters and contain only letters, numbers, spaces, hyphens, or underscores');
      return;
    }

    if (formData.tags.includes(sanitizedTag)) {
      toast.error('Tag already exists');
      return;
    }

    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, sanitizedTag]
    }));
    setNewTag('');
  };

  const handleAddSuggestedTag = (suggestedTag) => {
    if (formData.tags.includes(suggestedTag)) {
      toast.error('Tag already added');
      return;
    }

    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, suggestedTag]
    }));
  };

  const handleRemoveTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a service provider title');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare form data for PocketBase
      const submitData = new FormData();
      
      // Add text fields
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('location', formData.location);
      submitData.append('contact', formData.contact);
      submitData.append('author', user.id);
      
      // Add numeric fields
      if (formData.tariffRates) {
        submitData.append('tariffRates', formData.tariffRates);
      }
      if (formData.freeDays) {
        submitData.append('freeDays', formData.freeDays);
      }
      if (formData.monthlyDues) {
        submitData.append('monthlyDues', formData.monthlyDues);
      }
      if (formData.rating) {
        submitData.append('rating', formData.rating);
      }

      // Add service relations
      formData.service.forEach(serviceId => {
        submitData.append('service', serviceId);
      });

      // Add JSON fields
      if (formData.features.length > 0) {
        submitData.append('features', JSON.stringify(formData.features));
      }
      if (formData.tags.length > 0) {
        // Format tags as JSON array: ["Cfs", "Transport"]
        submitData.append('tags', formatTagsForSubmission(formData.tags));
      }

      // Add files
      selectedFiles.forEach(file => {
        submitData.append('files', file);
      });

      const newServiceProvider = await pbclient.collection('service_provider').create(submitData);
      
      toast.success('Service provider created successfully!');
      
      if (onServiceProviderCreated) {
        onServiceProviderCreated(newServiceProvider);
      }
    } catch (error) {
      console.error('Error creating service provider:', error);
      toast.error('Failed to create service provider: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Add {serviceType} Service Provider</h3>
          <p className="text-sm text-gray-600 mt-1">Create your service provider profile to start offering services</p>
        </div>
        {onCancel && (
          <Button
            variant="outline"
            title="Cancel"
            icon={<X size={16} />}
            onClick={onCancel}
            className="text-sm"
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label title="Service Provider Name *" className="mb-2 block" />
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter your company/service name"
              required
            />
          </div>
          
          <div>
            <Label title="Location" className="mb-2 block" />
            <Input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, State, Country"
              icon={<MapPin size={16} />}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <Label title="Description *" className="mb-2 block" />
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your services, capabilities, and what makes you unique..."
            rows={4}
            required
          />
        </div>

        {/* Contact and Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label title="Contact Information" className="mb-2 block" />
            <Input
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="Phone, Email, or Website"
              icon={<Phone size={16} />}
            />
          </div>
          
          <div>
            <Label title="Rating (1-5)" className="mb-2 block" />
            <Input
              name="rating"
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleInputChange}
              icon={<Star size={16} />}
            />
          </div>
        </div>

        {/* Pricing Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label title="Tariff Rates (₹)" className="mb-2 block" />
            <Input
              name="tariffRates"
              type="number"
              step="0.01"
              value={formData.tariffRates}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>
          
          <div>
            <Label title="Free Days" className="mb-2 block" />
            <Input
              name="freeDays"
              type="number"
              value={formData.freeDays}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>
          
          <div>
            <Label title="Monthly Dues (₹)" className="mb-2 block" />
            <Input
              name="monthlyDues"
              type="number"
              step="0.01"
              value={formData.monthlyDues}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Features Section */}
        <div>
          <Label title="Features & Services Offered" className="mb-3 block" />
          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-md border">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 flex-1">{feature}</span>
                <Button
                  type="button"
                  variant="none"
                  icon={<X size={14} />}
                  onClick={() => handleRemoveFeature(index)}
                  className="p-1 text-red-600 hover:bg-red-50"
                />
              </div>
            ))}
            
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Enter a feature or service..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                title="Add Feature"
                icon={<Plus size={16} />}
                onClick={handleAddFeature}
                disabled={!newFeature.trim()}
              />
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label title="Tags" />
            <Button
              type="button"
              variant="outline"
              title={showSuggestedTags ? "Hide Suggestions" : "Show Suggestions"}
              icon={<Lightbulb size={14} />}
              onClick={() => setShowSuggestedTags(!showSuggestedTags)}
              className="text-xs"
            />
          </div>

          <div className="space-y-3">
            {/* Current Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => {
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
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index)}
                        className="ml-1 hover:opacity-70 transition-opacity"
                        style={{ color: tagColor.text }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Suggested Tags */}
            {showSuggestedTags && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Suggested Tags for {serviceType}:</h5>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags
                    .filter(suggestedTag => !formData.tags.includes(suggestedTag))
                    .map((suggestedTag, index) => {
                      const tagColor = getTagColor(suggestedTag);
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleAddSuggestedTag(suggestedTag)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border-2 border-dashed hover:border-solid transition-all"
                          style={{
                            backgroundColor: tagColor.bg,
                            color: tagColor.text,
                            borderColor: tagColor.border
                          }}
                        >
                          <Plus size={10} />
                          {suggestedTag}
                        </button>
                      );
                    })}
                </div>
                {suggestedTags.filter(tag => !formData.tags.includes(tag)).length === 0 && (
                  <p className="text-xs text-gray-500 italic">All suggested tags have been added!</p>
                )}
              </div>
            )}

            {/* Add Custom Tag */}
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter custom tags (e.g., Packing, Storage, Customs)..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                title="Add Tag"
                icon={<Plus size={16} />}
                onClick={handleAddTag}
                disabled={!newTag.trim()}
              />
            </div>

            {/* Tag Guidelines */}
            <div className="text-xs text-gray-500">
              <p>• Tags help categorize your services and make them easier to find</p>
              <p>• Use 2-50 characters, letters, numbers, spaces, hyphens, or underscores only</p>
              <p>• Examples: "Container Handling", "Express Delivery", "Cold Storage"</p>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div>
          <Label title="Upload Files (Images & Documents)" className="mb-3 block" />
          <div className="space-y-2">
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-md border">
                    <Upload size={16} className="text-gray-500" />
                    <span className="text-gray-700 flex-1">{file.name}</span>
                    <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <Button
                      type="button"
                      variant="none"
                      icon={<X size={14} />}
                      onClick={() => handleRemoveFile(index)}
                      className="p-1 text-red-600 hover:bg-red-50"
                    />
                  </div>
                ))}
              </div>
            )}
            
            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload files or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">Images, PDFs, and documents supported</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt,.rtf,.odt,.xls,.xlsx,.ppt,.pptx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              title="Cancel"
              onClick={onCancel}
              disabled={isSubmitting}
            />
          )}
          <Button
            type="submit"
            variant="default"
            title={isSubmitting ? "Creating..." : "Create Service Provider"}
            icon={<Save size={16} />}
            disabled={isSubmitting}
            className="min-w-[200px]"
          />
        </div>
      </form>
    </div>
  );
}

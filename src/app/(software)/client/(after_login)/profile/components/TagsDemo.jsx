import React, { useState } from 'react';
import { Tag, Plus, X, Code, Database } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatTagsForSubmission, parseTagsFromResponse, getSuggestedTags, getTagColor, isValidTag, sanitizeTag } from '../utils/tagUtils';

/**
 * Demo component to showcase the Tags functionality
 * This demonstrates tag formatting, validation, and storage
 */
export default function TagsDemo() {
  const [selectedServiceType, setSelectedServiceType] = useState('CFS');
  const [currentTags, setCurrentTags] = useState(['CFS', 'Container Handling']);
  const [newTag, setNewTag] = useState('');
  const [showJsonOutput, setShowJsonOutput] = useState(true);

  const serviceTypes = ['CFS', 'Transport', '3PL', 'Warehouse'];
  const suggestedTags = getSuggestedTags(selectedServiceType);

  const handleAddTag = () => {
    const sanitizedTag = sanitizeTag(newTag);
    
    if (!sanitizedTag) {
      alert('Please enter a valid tag');
      return;
    }
    
    if (!isValidTag(sanitizedTag)) {
      alert('Tag must be 2-50 characters and contain only letters, numbers, spaces, hyphens, or underscores');
      return;
    }
    
    if (currentTags.includes(sanitizedTag)) {
      alert('Tag already exists');
      return;
    }
    
    setCurrentTags(prev => [...prev, sanitizedTag]);
    setNewTag('');
  };

  const handleRemoveTag = (index) => {
    setCurrentTags(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSuggestedTag = (suggestedTag) => {
    if (currentTags.includes(suggestedTag)) {
      alert('Tag already added');
      return;
    }
    
    setCurrentTags(prev => [...prev, suggestedTag]);
  };

  const handleServiceTypeChange = (serviceType) => {
    setSelectedServiceType(serviceType);
    // Reset tags to suggested ones for the new service type
    const suggested = getSuggestedTags(serviceType);
    setCurrentTags(suggested.slice(0, 2)); // Take first 2 as examples
  };

  // Format for PocketBase submission
  const formattedForSubmission = formatTagsForSubmission(currentTags);
  
  // Parse back from response (to demonstrate round-trip)
  const parsedFromResponse = parseTagsFromResponse(formattedForSubmission);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Demo Controls */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-4">Tags System Demo</h2>
        
        <div className="flex flex-wrap gap-4 items-center">
          {/* Service Type Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-blue-700">Service Type:</label>
            <div className="flex gap-2">
              {serviceTypes.map(type => (
                <Button
                  key={type}
                  variant={selectedServiceType === type ? "default" : "outline"}
                  title={type}
                  onClick={() => handleServiceTypeChange(type)}
                  className="text-sm"
                />
              ))}
            </div>
          </div>

          {/* JSON Output Toggle */}
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant={showJsonOutput ? "default" : "outline"}
              title={showJsonOutput ? "Hide JSON" : "Show JSON"}
              icon={<Code size={16} />}
              onClick={() => setShowJsonOutput(!showJsonOutput)}
              className="text-sm"
            />
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">✨ Tag Features:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Smart validation & sanitization</li>
              <li>• Service-specific suggestions</li>
              <li>• Color-coded categories</li>
              <li>• Duplicate prevention</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">📋 Storage Format:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• JSON array format</li>
              <li>• PocketBase compatible</li>
              <li>• Consistent formatting</li>
              <li>• Easy parsing</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">🎨 Visual Design:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Color-coded by category</li>
              <li>• Interactive suggestions</li>
              <li>• Hover effects</li>
              <li>• Responsive layout</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tags Interface */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {selectedServiceType} Service Tags
        </h3>

        {/* Current Tags */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Tags:</h4>
            {currentTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currentTags.map((tag, index) => {
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
            ) : (
              <p className="text-gray-500 italic">No tags added yet</p>
            )}
          </div>

          {/* Suggested Tags */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Suggested Tags for {selectedServiceType}:</h4>
            <div className="flex flex-wrap gap-2">
              {suggestedTags
                .filter(suggestedTag => !currentTags.includes(suggestedTag))
                .map((suggestedTag, index) => {
                  const tagColor = getTagColor(suggestedTag);
                  return (
                    <button
                      key={index}
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
            {suggestedTags.filter(tag => !currentTags.includes(tag)).length === 0 && (
              <p className="text-xs text-gray-500 italic">All suggested tags have been added!</p>
            )}
          </div>

          {/* Add Custom Tag */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Add Custom Tag:</h4>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter custom tag..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                variant="outline"
                title="Add Tag"
                icon={<Plus size={16} />}
                onClick={handleAddTag}
                disabled={!newTag.trim()}
              />
            </div>
          </div>
        </div>
      </div>

      {/* JSON Output */}
      {showJsonOutput && (
        <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
          <div className="flex items-center gap-2 mb-3">
            <Database size={16} />
            <h4 className="font-semibold">Database Storage Format</h4>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-gray-400 mb-1">// Tags field in service_provider collection:</p>
              <div className="bg-gray-800 p-3 rounded border">
                <pre>{formattedForSubmission}</pre>
              </div>
            </div>

            <div>
              <p className="text-gray-400 mb-1">// Parsed back to JavaScript array:</p>
              <div className="bg-gray-800 p-3 rounded border">
                <pre>{JSON.stringify(parsedFromResponse, null, 2)}</pre>
              </div>
            </div>

            <div>
              <p className="text-gray-400 mb-1">// Example PocketBase record:</p>
              <div className="bg-gray-800 p-3 rounded border">
                <pre>{JSON.stringify({
                  id: "SP-123456789012",
                  title: `${selectedServiceType} Service Provider`,
                  tags: JSON.parse(formattedForSubmission),
                  created: "2024-01-15 10:30:00",
                  updated: "2024-01-15 10:30:00"
                }, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Implementation Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">🔧 Implementation Details:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
          <div>
            <h5 className="font-medium mb-1">Tag Validation:</h5>
            <ul className="space-y-1">
              <li>• 2-50 character length</li>
              <li>• Alphanumeric + spaces, hyphens, underscores</li>
              <li>• Automatic sanitization</li>
              <li>• Duplicate prevention</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-1">Storage Format:</h5>
            <ul className="space-y-1">
              <li>• JSON array: ["Tag1", "Tag2"]</li>
              <li>• PocketBase compatible</li>
              <li>• Consistent formatting</li>
              <li>• Easy querying and filtering</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

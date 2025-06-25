import React, { useState } from 'react';
import Gallery from './Gallery';
import Button from '@/components/ui/Button';
import { Edit, Eye } from 'lucide-react';

/**
 * Demo component to showcase the enhanced Gallery functionality
 * This demonstrates both editing and viewing modes
 */
export default function GalleryDemo() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState('CFS');

  // Mock service provider data for demonstration
  const mockServiceProvider = {
    id: 'demo-123',
    files: [
      'sample-image.jpg',
      'document.pdf',
      'spreadsheet.xlsx',
      'presentation.pptx'
    ]
  };

  const serviceTypes = ['CFS', 'Transport', '3PL', 'Warehouse'];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Demo Controls */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-4">Gallery Component Demo</h2>
        
        <div className="flex flex-wrap gap-4 items-center">
          {/* Edit Mode Toggle */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-blue-700">Mode:</label>
            <Button
              variant={isEditing ? "default" : "outline"}
              title={isEditing ? "Editing Mode" : "View Mode"}
              icon={isEditing ? <Edit size={16} /> : <Eye size={16} />}
              onClick={() => setIsEditing(!isEditing)}
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
        </div>

        {/* Feature Highlights */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">✨ New Features:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Support for images AND documents</li>
              <li>• Individual file deletion</li>
              <li>• Delete all files at once</li>
              <li>• View and download files</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">📁 Supported Files:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Images: JPG, PNG, GIF, WEBP, SVG</li>
              <li>• Documents: PDF, DOC, DOCX, TXT</li>
              <li>• Spreadsheets: XLS, XLSX</li>
              <li>• Presentations: PPT, PPTX</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gallery Component Demo */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {selectedServiceType} Service Gallery
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {isEditing 
              ? "🔧 Editing mode: You can upload, delete, and manage files" 
              : "👁️ View mode: You can view and download files"
            }
          </p>
        </div>

        <Gallery
          serviceProvider={mockServiceProvider}
          serviceType={selectedServiceType}
          isEditing={isEditing}
        />
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-2">How to Use:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h5 className="font-medium mb-1">View Mode:</h5>
            <ul className="space-y-1">
              <li>• Hover over files to see action buttons</li>
              <li>• Click 👁️ to view files in new tab</li>
              <li>• Click ⬇️ to download files</li>
              <li>• View file statistics at bottom</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-1">Edit Mode:</h5>
            <ul className="space-y-1">
              <li>• Click "Add Files" to upload new files</li>
              <li>• Click ❌ on individual files to delete</li>
              <li>• Click "Delete All Files" to remove all</li>
              <li>• Upload multiple files at once</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

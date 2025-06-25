import React, { useEffect, useState } from 'react';
import { Plus, X, Upload, FileText, Image, File, Download, Eye, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import pbclient from '@/lib/db';
import { toast } from 'sonner';

export default function Gallery({ serviceProvider, serviceType, isEditing = false }) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Helper function to determine file type
  const getFileType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx'];

    if (imageExtensions.includes(extension)) return 'image';
    if (documentExtensions.includes(extension)) return 'document';
    return 'other';
  };

  // Helper function to get file icon
  const getFileIcon = (filename) => {
    const fileType = getFileType(filename);
    switch (fileType) {
      case 'image': return Image;
      case 'document': return FileText;
      default: return File;
    }
  };

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    if (serviceProvider?.files) {
      // Convert PocketBase files to file objects with metadata
      const fileObjects = serviceProvider.files.map(filename => ({
        filename,
        url: pbclient.files.getURL(serviceProvider, filename),
        type: getFileType(filename),
        size: null // Size not available from PocketBase file list
      }));
      setFiles(fileObjects);
    } else {
      // Default placeholder images based on service type
      const defaultImages = {
        CFS: [
          '/CFS/global-freight-logistics/1.jpg',
          '/CFS/global-freight-logistics/2.jpg',
          '/CFS/global-freight-logistics/3.jpg',
          '/CFS/global-freight-logistics/4.jpg'
        ],
        Transport: [
          '/transport/truck1.jpg',
          '/transport/truck2.jpg'
        ],
        '3PL': [
          '/3pl/warehouse1.jpeg',
          '/3pl/warehouse2.jpg'
        ],
        Warehouse: [
          '/warehouse/storage1.jpg',
          '/warehouse/storage2.jpg'
        ]
      };

      const defaultFiles = (defaultImages[serviceType] || []).map(url => ({
        filename: url.split('/').pop(),
        url,
        type: 'image',
        size: null
      }));

      setFiles(defaultFiles);
    }
  }, [serviceProvider, serviceType]);

  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);
    try {
      if (serviceProvider?.id) {
        // Actual upload to PocketBase
        const formData = new FormData();

        // Add existing files if any
        if (serviceProvider.files) {
          serviceProvider.files.forEach(filename => {
            formData.append('files', filename);
          });
        }

        // Add new files
        uploadedFiles.forEach(file => {
          formData.append('files', file);
        });

        const updatedRecord = await pbclient.collection('service_provider').update(serviceProvider.id, formData);

        // Update local state with new files
        const newFileObjects = updatedRecord.files.map(filename => ({
          filename,
          url: pbclient.files.getURL(updatedRecord, filename),
          type: getFileType(filename),
          size: null
        }));
        setFiles(newFileObjects);

        toast.success(`${uploadedFiles.length} file(s) uploaded successfully`);
      } else {
        // Simulate upload for preview (when no serviceProvider exists)
        const newFileObjects = uploadedFiles.map(file => ({
          filename: file.name,
          url: URL.createObjectURL(file),
          type: getFileType(file.name),
          size: file.size
        }));
        setFiles(prev => [...prev, ...newFileObjects]);
        toast.success(`${uploadedFiles.length} file(s) added for preview`);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = async (index) => {
    const fileToRemove = files[index];

    try {
      if (serviceProvider?.id && serviceProvider.files) {
        // Remove from PocketBase
        const updatedFiles = serviceProvider.files.filter(filename => filename !== fileToRemove.filename);

        const formData = new FormData();
        updatedFiles.forEach(filename => {
          formData.append('files', filename);
        });

        const updatedRecord = await pbclient.collection('service_provider').update(serviceProvider.id, formData);

        // Update local state
        const newFileObjects = updatedRecord.files.map(filename => ({
          filename,
          url: pbclient.files.getURL(updatedRecord, filename),
          type: getFileType(filename),
          size: null
        }));
        setFiles(newFileObjects);

        toast.success('File removed successfully');
      } else {
        // Remove from local state only
        setFiles(prev => prev.filter((_, i) => i !== index));
        toast.success('File removed');
      }
    } catch (error) {
      console.error('Error removing file:', error);
      toast.error('Failed to remove file');
    }
  };

  const handleDeleteAll = async () => {
    if (files.length === 0) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete all ${files.length} files? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      if (serviceProvider?.id) {
        // Clear all files in PocketBase
        const formData = new FormData();
        // Don't append any files to clear them all

        await pbclient.collection('service_provider').update(serviceProvider.id, formData);
        setFiles([]);
        toast.success('All files deleted successfully');
      } else {
        // Clear local state
        setFiles([]);
        toast.success('All files removed');
      }
    } catch (error) {
      console.error('Error deleting all files:', error);
      toast.error('Failed to delete all files');
    }
  };

  // Helper functions for file actions
  const downloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.filename;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewFile = (file) => {
    window.open(file.url, '_blank');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-semibold text-gray-800">Files & Gallery</h4>
        <div className="flex gap-2">
          {isEditing && files.length > 0 && (
            <Button
              variant="outline"
              title="Delete All Files"
              icon={<Trash2 size={16} />}
              onClick={handleDeleteAll}
              className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
            />
          )}
          {isEditing && (
            <label htmlFor="gallery-upload" className="cursor-pointer">
              <Button
                variant="outline"
                title={isUploading ? "Uploading..." : "Add Files"}
                icon={<Upload size={16} />}
                disabled={isUploading}
                className="text-sm"
              />
              <input
                id="gallery-upload"
                type="file"
                accept="image/*,.pdf,.doc,.docx,.txt,.rtf,.odt,.xls,.xlsx,.ppt,.pptx"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file, index) => {
          const FileIcon = getFileIcon(file.filename);
          const isImage = file.type === 'image';

          return (
            <div key={index} className="relative group bg-white rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all">
              {isImage ? (
                // Image preview
                <div className="aspect-square rounded-t-lg overflow-hidden bg-gray-100">
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center bg-gray-100">
                    <FileIcon size={48} className="text-gray-400" />
                  </div>
                </div>
              ) : (
                // Document preview
                <div className="aspect-square rounded-t-lg bg-gray-50 flex flex-col items-center justify-center p-4">
                  <FileIcon size={48} className="text-blue-600 mb-2" />
                  <span className="text-xs text-gray-600 text-center font-medium">
                    {file.filename.split('.').pop().toUpperCase()}
                  </span>
                </div>
              )}

              {/* File info */}
              <div className="p-3">
                <p className="text-sm font-medium text-gray-800 truncate" title={file.filename}>
                  {file.filename}
                </p>
                {file.size && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(file.size)}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => viewFile(file)}
                  className="bg-blue-500 text-white rounded-full p-1.5 shadow-lg hover:bg-blue-600 transition-colors"
                  title="View file"
                >
                  <Eye size={20} />
                </button>
                <button
                  onClick={() => downloadFile(file)}
                  className="bg-green-500 text-white rounded-full p-1.5 shadow-lg hover:bg-green-600 transition-colors"
                  title="Download file"
                >
                  <Download size={20} />
                </button>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
                    title="Delete file"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add File Placeholder - only show when editing */}
        {isEditing && (
          <label htmlFor="gallery-upload-placeholder" className="cursor-pointer">
            <div className="aspect-square rounded-lg border-2 border-dashed border-gray-400 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
              <Plus size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 text-center">Add Files</span>
              <span className="text-xs text-gray-400 text-center mt-1">Images & Documents</span>
            </div>
            <input
              id="gallery-upload-placeholder"
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt,.rtf,.odt,.xls,.xlsx,.ppt,.pptx"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Empty State */}
      {files.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-gray-400 mb-4">
            <Upload size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500 mb-4">No files uploaded yet</p>
          <p className="text-gray-400 text-sm mb-4">Upload images, documents, and other files</p>
          {isEditing && (
            <label htmlFor="gallery-upload-empty" className="cursor-pointer">
              <Button
                variant="outline"
                title="Upload Files"
                icon={<Upload size={16} />}
                disabled={isUploading}
              />
              <input
                id="gallery-upload-empty"
                type="file"
                accept="image/*,.pdf,.doc,.docx,.txt,.rtf,.odt,.xls,.xlsx,.ppt,.pptx"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-700">Uploading files...</span>
          </div>
        </div>
      )}

      {/* File Statistics */}
      {files.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Total files: {files.length}</span>
            <div className="flex gap-4">
              <span>Images: {files.filter(f => f.type === 'image').length}</span>
              <span>Documents: {files.filter(f => f.type === 'document').length}</span>
              <span>Other: {files.filter(f => f.type === 'other').length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

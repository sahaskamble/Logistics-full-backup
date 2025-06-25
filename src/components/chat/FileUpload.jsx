'use client';

import { useState, useRef } from 'react';
import { Paperclip, X, FileText, Image, File, Download } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Enhanced File Upload Component for Chat
 * Supports documents, images, and other file types
 */
export default function FileUpload({ onFileSelect, attachment, onRemoveAttachment, className = '' }) {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  // File type configurations
  const fileTypes = {
    image: {
      accept: 'image/*',
      maxSize: 5 * 1024 * 1024, // 5MB
      icon: Image,
      color: 'text-green-600'
    },
    document: {
      accept: '.pdf,.doc,.docx,.txt,.rtf,.odt',
      maxSize: 10 * 1024 * 1024, // 10MB
      icon: FileText,
      color: 'text-blue-600'
    },
    general: {
      accept: '*',
      maxSize: 10 * 1024 * 1024, // 10MB
      icon: File,
      color: 'text-gray-600'
    }
  };

  // Get file type and icon
  const getFileInfo = (file) => {
    if (file.type.startsWith('image/')) {
      return { type: 'image', ...fileTypes.image };
    } else if (
      file.type === 'application/pdf' ||
      file.type.includes('document') ||
      file.type.includes('text')
    ) {
      return { type: 'document', ...fileTypes.document };
    } else {
      return { type: 'general', ...fileTypes.general };
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!file) return;

    console.log('FileUpload: File selected:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });

    const fileInfo = getFileInfo(file);

    // Check file size
    if (file.size > fileInfo.maxSize) {
      console.error('FileUpload: File too large:', file.size, 'Max:', fileInfo.maxSize);
      toast.error(`File size must be less than ${formatFileSize(fileInfo.maxSize)}`);
      return;
    }

    // Check file type for security
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'text/rtf', 'application/rtf',
      'application/vnd.oasis.opendocument.text'
    ];

    if (!allowedTypes.includes(file.type) && !file.type.startsWith('image/')) {
      console.error('FileUpload: Invalid file type:', file.type);
      toast.error('File type not supported. Please upload images, PDFs, or documents.');
      return;
    }

    // Create a file object with additional metadata for FormData usage
    const fileWithMetadata = {
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    };

    console.log('FileUpload: Calling onFileSelect with:', fileWithMetadata);
    onFileSelect(fileWithMetadata);
    toast.success(`File "${file.name}" selected`);
  };

  // Handle file input change
  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Render attachment preview
  const renderAttachmentPreview = () => {
    if (!attachment) return null;

    // Handle both old format (direct File) and new format (object with file property)
    const file = attachment.file || attachment;
    const fileName = attachment.name || file.name;
    const fileSize = attachment.size || file.size;

    const fileInfo = getFileInfo(file);
    const IconComponent = fileInfo.icon;

    return (
      <div className="mb-2 p-3 bg-background rounded-lg border border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <IconComponent className={`w-5 h-5 ${fileInfo.color} flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {fileName}
              </p>
              <p className="text-xs text-foreground/60">
                {formatFileSize(fileSize)}
              </p>
            </div>
          </div>
          <button
            onClick={onRemoveAttachment}
            className="p-1 text-secondary hover:text-secondary/80 hover:bg-secondary/10 rounded transition-colors"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image preview */}
        {fileInfo.type === 'image' && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="max-w-full h-20 object-cover rounded border"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      {/* Attachment Preview */}
      {renderAttachmentPreview()}

      {/* File Upload Area */}
      <div
        className={`relative ${dragOver ? 'bg-primary/10 border-primary' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleInputChange}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt,.rtf,.odt"
        />

        {/* Upload Button - WhatsApp Style */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-foreground/60 hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-200 hover:scale-110"
          title="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Drag overlay */}
        {dragOver && (
          <div className="absolute inset-0 bg-primary/20 border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Download className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-primary font-medium">Drop file here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

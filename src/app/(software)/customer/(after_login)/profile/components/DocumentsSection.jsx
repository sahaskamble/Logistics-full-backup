'use client'
import { useState } from 'react';
import { FileText, Download, Eye, Trash2, Upload } from 'lucide-react';
import Button from "@/components/ui/Button";
import { DataTable } from "@/components/ui/Table";
import { useIsMobile } from "@/hooks/use-mobile";
import pbclient from '@/lib/db';
import { toast } from 'sonner';

export default function DocumentsSection({ user, userProfile, refreshProfile }) {
  const [isUploading, setIsUploading] = useState(false);
  const isMobile = useIsMobile();

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      
      // Add existing documents if any
      if (userProfile?.documents) {
        userProfile.documents.forEach(doc => {
          formData.append('documents', doc);
        });
      }
      
      // Add new files
      files.forEach(file => {
        formData.append('documents', file);
      });

      if (userProfile) {
        await pbclient.collection('user_profile').update(userProfile.id, formData);
      } else {
        // Create new profile with documents
        formData.append('user', user.id);
        await pbclient.collection('user_profile').create(formData);
      }

      refreshProfile();
      toast.success(`${files.length} document(s) uploaded successfully`);
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast.error('Failed to upload documents');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (filename) => {
    if (!userProfile?.documents) return;

    try {
      const updatedDocuments = userProfile.documents.filter(doc => doc !== filename);
      
      const formData = new FormData();
      updatedDocuments.forEach(doc => {
        formData.append('documents', doc);
      });

      await pbclient.collection('user_profile').update(userProfile.id, formData);
      refreshProfile();
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const downloadFile = (filename) => {
    if (!userProfile) return;
    
    const url = pbclient.files.getURL(userProfile, filename);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewFile = (filename) => {
    if (!userProfile) return;
    
    const url = pbclient.files.getURL(userProfile, filename);
    window.open(url, '_blank');
  };

  const getFileType = (filename) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    const types = {
      pdf: 'PDF',
      doc: 'DOC',
      docx: 'DOC',
      xls: 'Excel',
      xlsx: 'Excel',
      jpg: 'Image',
      jpeg: 'Image',
      png: 'Image',
      gif: 'Image'
    };
    return types[extension] || 'File';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Prepare documents data for table
  const documentsData = userProfile?.documents?.map((filename, index) => ({
    id: index,
    documentName: filename,
    type: getFileType(filename),
    uploadedOn: formatDate(userProfile.updated || userProfile.created),
    filename: filename
  })) || [];

  const columns = [
    {
      id: 'serial',
      header: '#',
      cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
    },
    {
      id: 'documentName',
      accessorKey: 'documentName',
      header: 'Document Name',
      filterable: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" />
          <span className="truncate max-w-[200px]">{row.original.documentName}</span>
        </div>
      ),
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: 'Type',
      filterable: true,
      cell: ({ row }) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {row.original.type}
        </span>
      ),
    },
    {
      id: 'uploadedOn',
      accessorKey: 'uploadedOn',
      header: 'Upload On',
      filterable: true,
      cell: ({ row }) => <div>{row.original.uploadedOn}</div>,
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => viewFile(row.original.filename)}
            className="p-1 hover:bg-gray-100 rounded"
            title="View"
          >
            <Eye className="w-4 h-4 text-green-600" />
          </button>
          <button
            onClick={() => downloadFile(row.original.filename)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Download"
          >
            <Download className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => handleDeleteDocument(row.original.filename)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-800">View & Manage Document</h2>
        </div>
        <div>
          <label htmlFor="document-upload">
            <Button
              title={isUploading ? "Uploading..." : "Upload Documents"}
              icon={<Upload className="w-4 h-4" />}
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
              disabled={isUploading}
              onClick={() => document.getElementById('document-upload').click()}
            />
          </label>
          <input
            id="document-upload"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      </div>

      {/* Documents Table/List */}
      {documentsData.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No documents uploaded</h3>
          <p className="text-gray-400 mb-4">Upload your first document to get started</p>
        </div>
      ) : (
        <>
          {isMobile ? (
            <div className="grid gap-4">
              {documentsData.map((document, index) => (
                <div key={index} className="border rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm truncate">{document.documentName}</h3>
                        <p className="text-xs text-gray-500">
                          {document.type} • Uploaded on: {document.uploadedOn}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => viewFile(document.filename)}
                        className="p-2 hover:bg-gray-200 rounded"
                      >
                        <Eye className="w-4 h-4 text-green-600" />
                      </button>
                      <button
                        onClick={() => downloadFile(document.filename)}
                        className="p-2 hover:bg-gray-200 rounded"
                      >
                        <Download className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(document.filename)}
                        className="p-2 hover:bg-gray-200 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <DataTable columns={columns} data={documentsData} />
          )}
        </>
      )}
    </div>
  );
}

# Enhanced Gallery Component

## Overview
The Gallery component has been enhanced to support both images and documents with comprehensive file management capabilities.

## New Features

### 1. Multi-File Type Support
- **Images**: JPG, JPEG, PNG, GIF, WEBP, SVG
- **Documents**: PDF, DOC, DOCX, TXT, RTF, ODT, XLS, XLSX, PPT, PPTX
- **Other files**: Generic file support with appropriate icons

### 2. File Management Actions

#### Individual File Actions
- **View**: Click the eye icon to open file in new tab
- **Download**: Click the download icon to save file locally
- **Delete**: Click the X icon to remove individual files (editing mode only)

#### Bulk Actions
- **Delete All**: Remove all files at once with confirmation dialog
- **Upload Multiple**: Select and upload multiple files simultaneously

### 3. Enhanced UI/UX

#### File Display
- **Images**: Show thumbnail previews with hover effects
- **Documents**: Display file type icon with extension badge
- **File Info**: Show filename and file size (when available)
- **Hover Actions**: Action buttons appear on hover for clean interface

#### Visual Feedback
- **Upload Progress**: Loading indicator during file uploads
- **File Statistics**: Summary showing total files by type
- **Empty State**: Clear instructions when no files are present
- **Error Handling**: Graceful fallbacks for broken images

### 4. Technical Improvements

#### PocketBase Integration
- **Real Upload**: Actual file upload to PocketBase when serviceProvider exists
- **Preview Mode**: Local preview when no serviceProvider (for testing)
- **File Management**: Proper handling of existing files during updates

#### File Validation
- **Type Checking**: Validates file types before upload
- **Size Limits**: Configurable file size restrictions
- **Duplicate Prevention**: Prevents uploading duplicate files

## Usage

### Basic Usage
```jsx
<Gallery 
  serviceProvider={serviceProvider} 
  serviceType="CFS" 
  isEditing={true} 
/>
```

### Props
- `serviceProvider`: PocketBase record containing file data
- `serviceType`: Service type for default images (CFS, Transport, 3PL, Warehouse)
- `isEditing`: Boolean to enable/disable editing features

## File Structure
```
files: [
  {
    filename: "document.pdf",
    url: "https://...",
    type: "document", // 'image', 'document', 'other'
    size: 1024000 // bytes (when available)
  }
]
```

## Supported File Types

### Images
- JPEG/JPG - Joint Photographic Experts Group
- PNG - Portable Network Graphics
- GIF - Graphics Interchange Format
- WEBP - Web Picture format
- SVG - Scalable Vector Graphics

### Documents
- PDF - Portable Document Format
- DOC/DOCX - Microsoft Word
- TXT - Plain Text
- RTF - Rich Text Format
- ODT - OpenDocument Text
- XLS/XLSX - Microsoft Excel
- PPT/PPTX - Microsoft PowerPoint

## Security Features
- File type validation on client and server
- Secure file URLs through PocketBase
- Proper error handling for malicious files
- Size limit enforcement

## Accessibility
- Keyboard navigation support
- Screen reader friendly labels
- High contrast action buttons
- Clear visual feedback

## Browser Compatibility
- Modern browsers with ES6+ support
- File API support required
- Drag & drop functionality (future enhancement)

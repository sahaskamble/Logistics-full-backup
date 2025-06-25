# Customer Profile Page

This is a comprehensive customer profile page that integrates with PocketBase and matches the design shown in the provided image.

## Features

### 1. Profile Header (`ProfileHeader.jsx`)
- **Avatar Management**: Upload and display profile pictures
- **File Validation**: Supports image files up to 5MB
- **Fallback Display**: Shows user initials when no avatar is uploaded
- **Real-time Updates**: Immediately reflects avatar changes

### 2. Profile Overview (`ProfileOverview.jsx`)
- **Dynamic Data**: Integrates with both `users` and `user_profile` collections
- **Editable Fields**: 
  - Full Name (First Name + Last Name)
  - Phone Number
  - Company/Business Name
  - Address
- **Read-only Fields**:
  - Email (system managed)
  - Customer ID (auto-generated)
  - Joined Date (system timestamp)
- **Form Validation**: Ensures data integrity before saving
- **Loading States**: Shows skeleton loading during data fetch

### 3. Documents Section (`DocumentsSection.jsx`)
- **File Upload**: Multiple file upload with drag-and-drop support
- **File Types**: Supports PDF, DOC, DOCX, XLS, XLSX, and image files
- **File Management**: View, download, and delete uploaded documents
- **Responsive Design**: Table view on desktop, card view on mobile
- **File Preview**: Open documents in new tab for viewing

### 4. Password Management (`Password.jsx`)
- **Current Password Verification**: Validates existing password before change
- **Password Strength**: Enforces strong password requirements
- **Show/Hide Toggle**: Password visibility controls for all fields
- **Real-time Validation**: Immediate feedback on password requirements
- **Security Features**: 
  - Minimum 8 characters
  - Uppercase and lowercase letters
  - Numbers and special characters

## Database Schema Integration

### Users Collection (`users`)
- `firstname`: User's first name
- `lastname`: User's last name
- `email`: User's email address (read-only)
- `phone`: Contact phone number
- `avatar`: Profile picture file
- `created`: Account creation timestamp

### User Profile Collection (`user_profile`)
- `user`: Relation to users collection
- `address`: User's address
- `businessName`: Company/business name
- `gstIn`: GST identification number
- `panNo`: PAN card number
- `contact`: Additional contact information
- `documents`: File attachments for documents

## Design Features

- **Green Theme**: Matches the Green Ocean Logistics branding
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with proper spacing
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: Toast notifications for success/error states
- **Accessibility**: Proper labels and keyboard navigation

## Usage

The profile page automatically loads the current user's data and allows them to:

1. **Update Profile Information**: Edit personal and business details
2. **Manage Profile Picture**: Upload and change avatar
3. **Handle Documents**: Upload, view, and manage important documents
4. **Change Password**: Securely update account password

## Technical Implementation

- **React Hooks**: Uses useState, useEffect for state management
- **PocketBase Integration**: Real-time data synchronization
- **Toast Notifications**: User feedback via Sonner
- **File Handling**: Secure file upload and management
- **Form Validation**: Client-side validation with server-side verification
- **Responsive Design**: Tailwind CSS for mobile-first approach

## Security Considerations

- **Password Validation**: Strong password requirements enforced
- **File Type Restrictions**: Only allowed file types can be uploaded
- **File Size Limits**: Maximum 5MB for avatars, 100MB for documents
- **Authentication**: All operations require valid user session
- **Data Validation**: Server-side validation for all form submissions

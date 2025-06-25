# Service Provider Management System

## Overview
The Service Provider Management System allows users to create and manage their service provider profiles across different service types (CFS, Transport, 3PL, Warehouse). When a user has no service provider information, the system automatically shows an "Add Service Info" form.

## New Components

### 1. AddServiceProviderForm.jsx
A comprehensive form component for creating new service provider profiles.

#### Features:
- **Basic Information**: Company name, location, description
- **Contact & Pricing**: Contact info, tariff rates, free days, monthly dues
- **Features Management**: Add/remove service features dynamically
- **Tags System**: Categorize services with tags
- **File Upload**: Support for images and documents
- **Rating System**: 1-5 star rating system
- **Auto-Service Selection**: Automatically selects service based on service type

#### Props:
```jsx
<AddServiceProviderForm
  serviceType="CFS"                           // Service type (CFS, Transport, 3PL, Warehouse)
  onServiceProviderCreated={handleCreated}    // Callback when provider is created
  onCancel={handleCancel}                     // Optional cancel callback
/>
```

### 2. Enhanced ServiceDetails.jsx
Updated to conditionally show the AddServiceProviderForm when no service provider exists.

#### New Features:
- **Conditional Rendering**: Shows add form when no service provider exists
- **Service Provider Detection**: Automatically detects if user has service providers
- **Seamless Integration**: Smooth transition between add form and service details
- **Data Refresh**: Automatically refreshes data after creating new provider

## Database Schema Integration

### service_provider Collection Fields:
Based on `schema-v0.0.8.json`:

```javascript
{
  id: "SP-[0-9]{12}",           // Auto-generated ID
  service: [],                  // Array of service IDs (relation to services collection)
  title: "",                    // Service provider name
  description: "",              // Service description
  files: [],                    // Array of uploaded files
  location: "",                 // Location information
  features: [],                 // JSON array of features/services offered
  contact: "",                  // Contact information
  tariffRates: 0,              // Pricing information
  freeDays: 0,                 // Free days offered
  monthlyDues: 0,              // Monthly charges
  tags: [],                    // JSON array of tags
  rating: 5,                   // Rating (1-5)
  author: "",                  // User ID (relation to users)
  created: "auto",             // Auto-generated creation date
  updated: "auto"              // Auto-generated update date
}
```

## User Flow

### 1. No Service Provider Exists
```
User visits profile → Service tab → "No [ServiceType] Service Provider" message → 
Click "Add [ServiceType] Service Info" → AddServiceProviderForm opens
```

### 2. Creating Service Provider
```
Fill form → Upload files → Add features/tags → Submit → 
Success message → Form closes → Service details view loads
```

### 3. Existing Service Provider
```
User visits profile → Service tab → Service details with Gallery → 
Edit mode available → File management → Feature management
```

## Form Validation

### Required Fields:
- **Service Provider Name** (title)
- **Description**

### Optional Fields:
- Location
- Contact information
- Pricing details (tariffRates, freeDays, monthlyDues)
- Rating (defaults to 5)
- Features array
- Tags array
- Files array

### File Upload Support:
- **Images**: JPG, JPEG, PNG, GIF, WEBP, SVG
- **Documents**: PDF, DOC, DOCX, TXT, RTF, ODT, XLS, XLSX, PPT, PPTX
- **Multiple files**: Supported
- **File size**: Configurable (default: 100MB max per file)

## Integration Points

### 1. Profile Page (page.jsx)
- Fetches service providers with expand for service and author relations
- Provides refresh functionality for real-time updates
- Passes data down to TabsSection

### 2. TabsSection Component
- Manages service type tabs (CFS, Transport, 3PL, Warehouse)
- Filters service providers by service type
- Handles refresh callbacks

### 3. ServiceDetails Component
- Conditionally renders AddServiceProviderForm or service details
- Manages editing states
- Integrates with Gallery component for file management

## API Operations

### Create Service Provider:
```javascript
const formData = new FormData();
formData.append('title', 'Company Name');
formData.append('description', 'Service description');
formData.append('author', userId);
// ... other fields
files.forEach(file => formData.append('files', file));

const newProvider = await pbclient.collection('service_provider').create(formData);
```

### Update Service Provider:
```javascript
const formData = new FormData();
// Add updated fields
const updatedProvider = await pbclient.collection('service_provider').update(providerId, formData);
```

### Fetch Service Providers:
```javascript
const providers = await pbclient.collection('service_provider').getList(1, 50, {
  expand: 'service,author',
  filter: `author.id = "${userId}"`
});
```

## Error Handling

### Form Submission:
- Validates required fields before submission
- Shows toast notifications for success/error states
- Handles PocketBase API errors gracefully
- Provides user-friendly error messages

### File Upload:
- Validates file types and sizes
- Handles upload failures
- Shows progress indicators
- Supports file removal before submission

## Styling & UI

### Design System:
- Uses existing UI components (Button, Input, TextArea, Label)
- Consistent with application theme variables
- Responsive design for mobile and desktop
- Accessible form controls and labels

### Visual Feedback:
- Loading states during form submission
- Success/error toast notifications
- Progress indicators for file uploads
- Hover effects and transitions

## Future Enhancements

### Potential Improvements:
1. **Drag & Drop**: File upload with drag and drop support
2. **Image Cropping**: Built-in image editing capabilities
3. **Bulk Operations**: Import/export service provider data
4. **Templates**: Pre-defined service provider templates
5. **Analytics**: Service provider performance metrics
6. **Reviews**: Customer review and rating system

### Integration Opportunities:
1. **Geolocation**: Auto-detect location for service providers
2. **Payment Integration**: Connect with payment processing
3. **Notification System**: Real-time updates for service requests
4. **Search & Filter**: Advanced search capabilities
5. **API Integration**: Connect with external logistics APIs

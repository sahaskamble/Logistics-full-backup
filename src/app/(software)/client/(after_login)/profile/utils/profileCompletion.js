/**
 * Profile Completion Calculator
 * Calculates profile completion percentage based on user data, user_profile, and service_provider collections
 */

/**
 * Calculate profile completion percentage
 * @param {Object} user - User object from auth
 * @param {Array} userProfile - User profile data array
 * @param {Array} serviceProviders - Service providers array
 * @returns {Object} - { percentage, details, suggestions }
 */
export function calculateProfileCompletion(user, userProfile, serviceProviders) {
  const completion = {
    percentage: 0,
    details: {
      basicInfo: { completed: 0, total: 0, fields: [] },
      userProfile: { completed: 0, total: 0, fields: [] },
      serviceProviders: { completed: 0, total: 0, fields: [] }
    },
    suggestions: []
  };

  // Basic User Information (from users collection)
  const basicInfoFields = [
    { key: 'firstname', label: 'First Name', weight: 10 },
    { key: 'lastname', label: 'Last Name', weight: 10 },
    { key: 'email', label: 'Email', weight: 10 },
    { key: 'avatar', label: 'Profile Picture', weight: 15 }
  ];

  basicInfoFields.forEach(field => {
    const isCompleted = user && user[field.key] && user[field.key].trim() !== '';
    completion.details.basicInfo.fields.push({
      ...field,
      completed: isCompleted,
      value: user?.[field.key] || null
    });
    completion.details.basicInfo.total += field.weight;
    if (isCompleted) {
      completion.details.basicInfo.completed += field.weight;
    } else {
      completion.suggestions.push(`Add your ${field.label.toLowerCase()}`);
    }
  });

  // User Profile Information (from user_profile collection)
  const userProfileData = userProfile && userProfile.length > 0 ? userProfile[0] : null;
  const userProfileFields = [
    { key: 'address', label: 'Address', weight: 8 },
    { key: 'contact', label: 'Contact Number', weight: 8 },
    { key: 'businessName', label: 'Business Name', weight: 7 },
    { key: 'gstIn', label: 'GST Number', weight: 7 },
    { key: 'panNo', label: 'PAN Number', weight: 7 },
    { key: 'documents', label: 'Documents', weight: 8 }
  ];

  userProfileFields.forEach(field => {
    let isCompleted = false;
    let value = null;

    if (userProfileData) {
      if (field.key === 'documents') {
        isCompleted = userProfileData.documents && userProfileData.documents.length > 0;
        value = userProfileData.documents?.length || 0;
      } else {
        isCompleted = userProfileData[field.key] && userProfileData[field.key].trim() !== '';
        value = userProfileData[field.key] || null;
      }
    }

    completion.details.userProfile.fields.push({
      ...field,
      completed: isCompleted,
      value: value
    });
    completion.details.userProfile.total += field.weight;
    if (isCompleted) {
      completion.details.userProfile.completed += field.weight;
    } else {
      completion.suggestions.push(`Add your ${field.label.toLowerCase()}`);
    }
  });

  // Service Provider Information (from service_provider collection)
  const serviceTypes = ['CFS', 'Transport', '3PL', 'Warehouse'];
  const serviceProviderWeight = 5; // Weight per service type

  serviceTypes.forEach(serviceType => {
    const hasServiceProvider = serviceProviders && serviceProviders.some(sp => 
      sp.expand?.service?.some(s => s.title === serviceType)
    );

    completion.details.serviceProviders.fields.push({
      key: serviceType.toLowerCase(),
      label: `${serviceType} Service Provider`,
      weight: serviceProviderWeight,
      completed: hasServiceProvider,
      value: hasServiceProvider ? 'Configured' : null
    });

    completion.details.serviceProviders.total += serviceProviderWeight;
    if (hasServiceProvider) {
      completion.details.serviceProviders.completed += serviceProviderWeight;
    } else {
      completion.suggestions.push(`Set up ${serviceType} service provider profile`);
    }
  });

  // Calculate overall percentage
  const totalPossible = completion.details.basicInfo.total + 
                       completion.details.userProfile.total + 
                       completion.details.serviceProviders.total;
  
  const totalCompleted = completion.details.basicInfo.completed + 
                        completion.details.userProfile.completed + 
                        completion.details.serviceProviders.completed;

  completion.percentage = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  return completion;
}

/**
 * Get completion status color based on percentage
 * @param {number} percentage - Completion percentage
 * @returns {Object} - { color, bgColor, textColor }
 */
export function getCompletionColor(percentage) {
  if (percentage >= 90) {
    return {
      color: '#10B981', // green-500
      bgColor: '#D1FAE5', // green-100
      textColor: '#065F46' // green-800
    };
  } else if (percentage >= 70) {
    return {
      color: '#3B82F6', // blue-500
      bgColor: '#DBEAFE', // blue-100
      textColor: '#1E3A8A' // blue-800
    };
  } else if (percentage >= 50) {
    return {
      color: '#F59E0B', // amber-500
      bgColor: '#FEF3C7', // amber-100
      textColor: '#92400E' // amber-800
    };
  } else {
    return {
      color: '#EF4444', // red-500
      bgColor: '#FEE2E2', // red-100
      textColor: '#991B1B' // red-800
    };
  }
}

/**
 * Get completion status message
 * @param {number} percentage - Completion percentage
 * @returns {string} - Status message
 */
export function getCompletionMessage(percentage) {
  if (percentage >= 90) {
    return 'Excellent! Your profile is almost complete.';
  } else if (percentage >= 70) {
    return 'Good progress! A few more details needed.';
  } else if (percentage >= 50) {
    return 'Getting there! Please complete more sections.';
  } else if (percentage >= 25) {
    return 'Profile needs attention. Please add more information.';
  } else {
    return 'Let\'s get started! Please complete your profile.';
  }
}

/**
 * Get next priority suggestions (top 3)
 * @param {Array} suggestions - All suggestions
 * @returns {Array} - Top 3 priority suggestions
 */
export function getPrioritySuggestions(suggestions) {
  // Priority order: basic info > user profile > service providers
  const priorityOrder = [
    'first name', 'last name', 'email', 'profile picture',
    'address', 'contact number', 'business name',
    'gst number', 'pan number', 'documents',
    'cfs service provider', 'transport service provider', 
    '3pl service provider', 'warehouse service provider'
  ];

  const sortedSuggestions = suggestions.sort((a, b) => {
    const aIndex = priorityOrder.findIndex(item => a.toLowerCase().includes(item));
    const bIndex = priorityOrder.findIndex(item => b.toLowerCase().includes(item));
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  return sortedSuggestions.slice(0, 3);
}

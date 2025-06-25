/**
 * Tag Utilities
 * Helper functions for consistent tag formatting and handling
 */

/**
 * Format tags for PocketBase submission
 * Ensures tags are stored as JSON object: {"tags": ["Cfs", "Transport"]}
 * @param {Array} tags - Array of tag strings
 * @returns {string} - JSON stringified object with tags array
 */
export function formatTagsForSubmission(tags) {
  if (!Array.isArray(tags) || tags.length === 0) {
    return JSON.stringify({ tags: [] });
  }

  // Clean and format tags
  const cleanTags = tags
    .filter(tag => tag && typeof tag === 'string' && tag.trim() !== '')
    .map(tag => tag.trim())
    .filter((tag, index, arr) => arr.indexOf(tag) === index); // Remove duplicates

  return JSON.stringify({ tags: cleanTags });
}

/**
 * Parse tags from PocketBase response
 * Handles both object format {"tags": ["Cfs", "Transport"]} and legacy array formats
 * @param {string|Array|Object} tags - Tags from database
 * @returns {Array} - Array of tag strings
 */
export function parseTagsFromResponse(tags) {
  if (!tags) return [];

  // If already an array, return as is (legacy format)
  if (Array.isArray(tags)) {
    return tags.filter(tag => tag && typeof tag === 'string' && tag.trim() !== '');
  }

  // If object with tags property, extract the tags array
  if (typeof tags === 'object' && tags.tags && Array.isArray(tags.tags)) {
    return tags.tags.filter(tag => tag && typeof tag === 'string' && tag.trim() !== '');
  }

  // If string, try to parse as JSON
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);

      // Check if it's the new format: {"tags": ["Cfs", "Transport"]}
      if (parsed && typeof parsed === 'object' && parsed.tags && Array.isArray(parsed.tags)) {
        return parsed.tags.filter(tag => tag && typeof tag === 'string' && tag.trim() !== '');
      }

      // Check if it's legacy array format: ["Cfs", "Transport"]
      if (Array.isArray(parsed)) {
        return parsed.filter(tag => tag && typeof tag === 'string' && tag.trim() !== '');
      }
    } catch (error) {
      console.warn('Failed to parse tags as JSON:', error);
      // If not valid JSON, treat as single tag
      return tags.trim() !== '' ? [tags.trim()] : [];
    }
  }

  return [];
}

/**
 * Validate tag format
 * @param {string} tag - Tag to validate
 * @returns {boolean} - Whether tag is valid
 */
export function isValidTag(tag) {
  return typeof tag === 'string' && 
         tag.trim() !== '' && 
         tag.length >= 2 && 
         tag.length <= 50 &&
         /^[a-zA-Z0-9\s\-_]+$/.test(tag); // Allow alphanumeric, spaces, hyphens, underscores
}

/**
 * Sanitize tag input
 * @param {string} tag - Raw tag input
 * @returns {string} - Sanitized tag
 */
export function sanitizeTag(tag) {
  if (typeof tag !== 'string') return '';
  
  return tag
    .trim()
    .replace(/[^a-zA-Z0-9\s\-_]/g, '') // Remove invalid characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .substring(0, 50); // Limit length
}

/**
 * Get suggested tags based on service type
 * @param {string} serviceType - Service type (CFS, Transport, 3PL, Warehouse)
 * @returns {Array} - Array of suggested tags
 */
export function getSuggestedTags(serviceType) {
  const suggestions = {
    CFS: [
      'CFS',
      'Container Handling',
      'Customs Clearance',
      'Storage',
      'Documentation',
      'Port Services',
      'Import Export',
      'Cargo Handling'
    ],
    Transport: [
      'Transport',
      'Logistics',
      'Trucking',
      'Delivery',
      'Fleet Management',
      'Last Mile',
      'Express Delivery',
      'Heavy Cargo'
    ],
    '3PL': [
      '3PL',
      'Third Party Logistics',
      'Warehousing',
      'Distribution',
      'Supply Chain',
      'Inventory Management',
      'Order Fulfillment',
      'Cross Docking'
    ],
    Warehouse: [
      'Warehouse',
      'Storage',
      'Inventory',
      'Distribution Center',
      'Cold Storage',
      'Bulk Storage',
      'Automated Storage',
      'Pick Pack'
    ]
  };
  
  return suggestions[serviceType] || [];
}

/**
 * Format tags for display
 * @param {Array} tags - Array of tags
 * @returns {string} - Formatted string for display
 */
export function formatTagsForDisplay(tags) {
  const parsedTags = parseTagsFromResponse(tags);
  if (parsedTags.length === 0) return 'No tags';
  
  return parsedTags.join(', ');
}

/**
 * Get tag color based on tag content
 * @param {string} tag - Tag string
 * @returns {Object} - Color scheme object
 */
export function getTagColor(tag) {
  const colors = {
    // Service types
    'CFS': { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' },
    'Transport': { bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
    '3PL': { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
    'Warehouse': { bg: '#E0E7FF', text: '#3730A3', border: '#6366F1' },
    
    // Common logistics terms
    'Storage': { bg: '#F3E8FF', text: '#6B21A8', border: '#8B5CF6' },
    'Delivery': { bg: '#ECFDF5', text: '#047857', border: '#059669' },
    'Customs': { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' },
    'Documentation': { bg: '#F0F9FF', text: '#0C4A6E', border: '#0284C7' }
  };
  
  // Check for exact match first
  if (colors[tag]) {
    return colors[tag];
  }
  
  // Check for partial matches
  for (const [key, color] of Object.entries(colors)) {
    if (tag.toLowerCase().includes(key.toLowerCase())) {
      return color;
    }
  }
  
  // Default color
  return { bg: '#F3F4F6', text: '#374151', border: '#9CA3AF' };
}

/**
 * Export all utilities as default object
 */
export default {
  formatTagsForSubmission,
  parseTagsFromResponse,
  isValidTag,
  sanitizeTag,
  getSuggestedTags,
  formatTagsForDisplay,
  getTagColor
};

import React from 'react';

/**
 * Circular Progress Component
 * Displays a circular progress ring around content
 */
export default function CircularProgress({ 
  percentage = 0, 
  size = 140, 
  strokeWidth = 6, 
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  children,
  showPercentage = true,
  className = ''
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* SVG Progress Ring */}
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))' }}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.3s ease',
          }}
        />
      </svg>

      {/* Content in the center */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>

      {/* Percentage Badge */}
      {showPercentage && (
        <div 
          className="absolute -bottom-1 -right-1 px-2 py-1 rounded-full text-xs font-bold text-white shadow-lg"
          style={{ backgroundColor: color }}
        >
          {percentage}%
        </div>
      )}
    </div>
  );
}

/**
 * Profile Progress Ring Component
 * Specialized circular progress for profile pictures
 */
export function ProfileProgressRing({ 
  percentage = 0, 
  color = '#3B82F6',
  children,
  size = 140,
  className = ''
}) {
  return (
    <CircularProgress
      percentage={percentage}
      size={size}
      strokeWidth={4}
      color={color}
      backgroundColor="rgba(229, 231, 235, 0.3)"
      showPercentage={true}
      className={className}
    >
      {children}
    </CircularProgress>
  );
}

/**
 * Mini Progress Ring Component
 * Smaller version for compact displays
 */
export function MiniProgressRing({ 
  percentage = 0, 
  color = '#3B82F6',
  size = 60,
  strokeWidth = 3,
  className = ''
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(229, 231, 235, 0.3)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.6s ease-in-out',
          }}
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="text-xs font-bold"
          style={{ color }}
        >
          {percentage}%
        </span>
      </div>
    </div>
  );
}

/**
 * Progress Bar Component
 * Linear progress bar alternative
 */
export function ProgressBar({ 
  percentage = 0, 
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  height = 8,
  className = '',
  showPercentage = true,
  animated = true
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        {showPercentage && (
          <span className="text-sm font-medium" style={{ color }}>
            {percentage}% Complete
          </span>
        )}
      </div>
      
      <div 
        className="w-full rounded-full overflow-hidden"
        style={{ backgroundColor, height }}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: color,
            transition: 'width 0.8s ease-in-out'
          }}
        />
      </div>
    </div>
  );
}

/**
 * Segmented Progress Component
 * Shows progress in segments for different categories
 */
export function SegmentedProgress({ 
  segments = [], 
  className = '',
  showLabels = true 
}) {
  const totalWeight = segments.reduce((sum, segment) => sum + segment.weight, 0);
  
  return (
    <div className={`w-full ${className}`}>
      {showLabels && (
        <div className="flex justify-between text-xs text-gray-600 mb-2">
          {segments.map((segment, index) => (
            <span key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: segment.color }}
              />
              {segment.label}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        {segments.map((segment, index) => {
          const widthPercentage = (segment.weight / totalWeight) * 100;
          const completionPercentage = (segment.completed / segment.total) * 100;
          
          return (
            <div
              key={index}
              className="relative"
              style={{ width: `${widthPercentage}%` }}
            >
              <div className="h-full bg-gray-300">
                <div
                  className="h-full transition-all duration-700 ease-out"
                  style={{ 
                    width: `${completionPercentage}%`,
                    backgroundColor: segment.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

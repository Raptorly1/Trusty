import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  rows?: number;
  showAvatar?: boolean;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className = '', 
  rows = 3, 
  showAvatar = false 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {showAvatar && (
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/6"></div>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: rows }, (_, index) => `row-${Date.now()}-${index}`).map((key, index) => (
          <div key={key} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            {index === rows - 1 && (
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface CardSkeletonProps {
  className?: string;
  hasHeader?: boolean;
  hasStats?: boolean;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ 
  className = '', 
  hasHeader = true,
  hasStats = false 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="animate-pulse">
        {hasHeader && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          </div>
        )}
        
        {hasStats && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
            </div>
            <div className="text-center">
              <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
};

interface AnnotationSkeletonProps {
  count?: number;
  className?: string;
}

export const AnnotationSkeleton: React.FC<AnnotationSkeletonProps> = ({ 
  count = 3, 
  className = '' 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }, (_, index) => `annotation-${Date.now()}-${index}`).map((key) => (
        <div key={key} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="animate-pulse">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;

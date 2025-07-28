import React from 'react';
import { CredibilityRating } from '../types/factCheckTypes';

interface CredibilityBadgeProps {
  rating: CredibilityRating;
}

export const CredibilityBadge: React.FC<CredibilityBadgeProps> = ({ rating }) => {
  const getBadgeClasses = (r: CredibilityRating): string => {
    switch (r) {
      case CredibilityRating.VERY_HIGH:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border-emerald-300';
      case CredibilityRating.HIGH:
        return 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200 border-green-300';
      case CredibilityRating.MEDIUM:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-200 border-yellow-300';
      case CredibilityRating.LOW:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200 border-orange-300';
      case CredibilityRating.VERY_LOW:
        return 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200 border-gray-300';
    }
  };

  return (
    <span
      className={`px-3 py-1 text-sm font-semibold rounded-full border ${getBadgeClasses(rating)}`}
    >
      {rating} Credibility
    </span>
  );
};

import React from 'react';
import { Source } from '../types/factCheckTypes';
import { CredibilityBadge } from './CredibilityBadge';

interface SourceCardProps {
  source: Source;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 transition-shadow hover:shadow-md">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
        <div className="flex-grow">
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {source.title}
          </a>
          <p className="text-sm text-gray-500 dark:text-gray-400 break-all">{source.url}</p>
        </div>
        <div className="flex-shrink-0 mt-2 sm:mt-0">
          <CredibilityBadge rating={source.credibility.rating} />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><span className="font-semibold">Summary:</span> {source.summary}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">Credibility Rationale:</span> {source.credibility.explanation}</p>
      </div>
    </div>
  );
};

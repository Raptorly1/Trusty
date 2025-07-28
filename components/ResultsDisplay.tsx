import React from 'react';
import { FactCheckResult } from '../types/factCheckTypes';
import { SourceCard } from './SourceCard';

interface ResultsDisplayProps {
  result: FactCheckResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  
  const getFactualityColorClasses = (factuality: string) => {
    switch (factuality) {
      case 'True':
      case 'Likely True':
        return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200';
      case 'Misleading':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200';
      case 'False':
      case 'Likely False':
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200';
      case 'Unverifiable':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Analyzed Statement</p>
        <blockquote className="mt-2 text-lg italic text-gray-800 dark:text-gray-100 border-l-4 border-blue-500 pl-4">
          "{result.statement}"
        </blockquote>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-1">
          <h3 className="text-md font-semibold text-gray-600 dark:text-gray-300 mb-2">Conclusion</h3>
          <p className={`px-3 py-1 text-lg font-bold rounded-full inline-block ${getFactualityColorClasses(result.factuality)}`}>
            {result.factuality}
          </p>
        </div>
        <div className="md:col-span-2">
            <h3 className="text-md font-semibold text-gray-600 dark:text-gray-300 mb-2">Summary</h3>
            <p className="text-gray-700 dark:text-gray-300">{result.summary}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Sources for Further Reading</h3>
        <div className="space-y-4">
          {result.sources.length > 0 ? (
            result.sources.map((source, index) => <SourceCard key={source.url || index} source={source} />)
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No sources were found for this statement.</p>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ShieldCheck } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800/50 shadow-sm">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Fact-Check Highlighter
          </h1>
        </div>
        <p className="hidden md:block text-gray-500 dark:text-gray-400">AI-Powered Truth Verification</p>
      </div>
    </header>
  );
};

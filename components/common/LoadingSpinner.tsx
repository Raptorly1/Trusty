
import React from 'react';

const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "Analyzing..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <span className="loading loading-lg loading-spinner text-primary"></span>
      <p className="mt-4 text-xl text-base-content/80">{message}</p>
    </div>
  );
};

export default LoadingSpinner;

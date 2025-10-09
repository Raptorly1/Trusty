import React from 'react';

interface NextGenOnboardingProps {
  onStart: () => void;
}

const NextGenOnboarding: React.FC<NextGenOnboardingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24">
      <img src="/favicon.ico" alt="Trusty logo" className="w-20 h-20 mb-6" />
      <h2 className="text-2xl font-bold text-blue-900 mb-2">Welcome to NextGen Feedback</h2>
      <p className="text-slate-700 mb-6 text-center max-w-md">
        Paste or upload your text to get started. We'll help you annotate, check sources, and understand your content with Trusty-powered insights.
      </p>
      <button
        className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-full shadow hover:bg-blue-700 transition"
        onClick={onStart}
      >
        Get Started
      </button>
    </div>
  );
};

export default NextGenOnboarding;

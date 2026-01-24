import React from 'react';

interface NextGenFactCheckModalProps {
  selectedText: string;
  onClose: () => void;
}

const NextGenFactCheckModal: React.FC<NextGenFactCheckModalProps> = ({ selectedText, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative animate-fade-in-fast">
        <button
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
          onClick={onClose}
        >
          Close
        </button>
        <h2 className="text-xl font-bold text-blue-900 mb-4">Fact-Check</h2>
        <p className="mb-4 text-slate-700">Selected text:</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-blue-900 font-mono">
          {selectedText}
        </div>
        {/* Fact-check results and sources would go here */}
        <div className="text-slate-500 text-sm">(Fact-check results coming soon...)</div>
      </div>
    </div>
  );
};

export default NextGenFactCheckModal;

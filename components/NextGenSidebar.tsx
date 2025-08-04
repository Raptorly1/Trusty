import React from 'react';

interface NextGenSidebarProps {
  annotations: any[];
  onAnnotationClick: (id: string) => void;
  onClearAll: () => void;
}

const NextGenSidebar: React.FC<NextGenSidebarProps> = ({ annotations, onAnnotationClick, onClearAll }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-blue-900">Annotations</h2>
        <button
          className="text-xs text-red-600 hover:underline"
          onClick={onClearAll}
          disabled={annotations.length === 0}
        >
          Clear All
        </button>
      </div>
      <div className="space-y-3">
        {annotations.length === 0 ? (
          <p className="text-slate-500 text-sm">No annotations yet.</p>
        ) : (
          annotations.map((ann, idx) => (
            <button
              key={ann.id || idx}
              className="block w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
              onClick={() => onAnnotationClick(ann.id)}
            >
              <span className="font-semibold text-blue-800">{ann.type || 'Note'}</span>
              <div className="text-xs text-slate-700 truncate">{ann.comment || ann.text}</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default NextGenSidebar;

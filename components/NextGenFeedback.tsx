import React, { useState } from 'react';
import NextGenTextEditor from './NextGenTextEditor';
import NextGenSidebar from './NextGenSidebar';
import NextGenFactCheckModal from './NextGenFactCheckModal';
import NextGenOnboarding from './NextGenOnboarding';

const NextGenFeedback: React.FC = () => {
  const [text, setText] = useState('');
  const [annotations, setAnnotations] = useState([]);
  const [showFactCheck, setShowFactCheck] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Placeholder for onboarding state
  const showOnboarding = !text;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      <header className="w-full px-6 py-4 flex items-center justify-between bg-white/80 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-blue-900 tracking-tight">NextGen Feedback</h1>
        <button
          className="rounded-full px-4 py-2 bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          onClick={() => setSidebarOpen((v) => !v)}
        >
          {sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
        </button>
      </header>
      <main className="flex-1 flex flex-col md:flex-row gap-0 md:gap-8 max-w-7xl mx-auto w-full p-4 md:p-8">
        <section className="flex-1 flex flex-col">
          {showOnboarding ? (
            <NextGenOnboarding onStart={() => setText('Paste or upload your text here...')} />
          ) : (
            <NextGenTextEditor
              text={text}
              setText={setText}
              annotations={annotations}
              setAnnotations={setAnnotations}
              onFactCheck={(sel: string) => {
                setSelectedText(sel);
                setShowFactCheck(true);
              }}
            />
          )}
        </section>
        {sidebarOpen && (
          <aside className="w-full md:w-96 mt-8 md:mt-0">
            <NextGenSidebar
              annotations={annotations}
              onAnnotationClick={(id: string) => {
                // TODO: scroll to annotation in editor
              }}
              onClearAll={() => setAnnotations([])}
            />
          </aside>
        )}
      </main>
      {showFactCheck && (
        <NextGenFactCheckModal
          selectedText={selectedText}
          onClose={() => setShowFactCheck(false)}
        />
      )}
    </div>
  );
};

export default NextGenFeedback;

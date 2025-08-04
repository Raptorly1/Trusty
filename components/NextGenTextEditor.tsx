import React from 'react';

interface NextGenTextEditorProps {
  text: string;
  setText: (t: string) => void;
  annotations: any[];
  setAnnotations: (a: any[]) => void;
  onFactCheck: (selectedText: string) => void;
}

const NextGenTextEditor: React.FC<NextGenTextEditorProps> = ({ text, setText, annotations, setAnnotations, onFactCheck }) => {
  // Placeholder UI for the text editor
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 flex flex-col gap-6 min-h-[30rem]">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste or upload your text here..."
        className="w-full h-48 p-4 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
      />
      {/* Annotation highlights and toolbar would go here */}
      <div className="flex gap-4">
        <button
          className="bg-emerald-600 text-white font-semibold px-6 py-2 rounded-full shadow hover:bg-emerald-700 transition"
          onClick={() => onFactCheck(text)}
          disabled={!text.trim()}
        >
          Fact-Check Selection
        </button>
        <button
          className="bg-slate-200 text-slate-700 font-semibold px-6 py-2 rounded-full shadow hover:bg-slate-300 transition"
          onClick={() => setText('')}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default NextGenTextEditor;

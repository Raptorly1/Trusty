import React, { useRef } from 'react';

interface TextInputAreaProps {
  paragraph: string;
  setParagraph: (p: string) => void;
  onSelect: (text: string) => void;
  disabled: boolean;
}

export const TextInputArea: React.FC<TextInputAreaProps> = ({ paragraph, setParagraph, onSelect, disabled }) => {
  const displayRef = useRef<HTMLDivElement>(null);

  const handleSelection = () => {
    if(disabled) return;
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    if (selectedText && selectedText.length > 0) {
      onSelect(selectedText);
    }
  };

  const handleMouseUp = () => {
    handleSelection();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <label htmlFor="paragraph-input" className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
        Enter Text to Analyze
      </label>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Paste your text below. Then, highlight any statement with your mouse to begin the fact-check.
      </p>
      <textarea
        id="paragraph-input"
        value={paragraph}
        onChange={(e) => setParagraph(e.target.value)}
        placeholder="For example, paste an article here..."
        className="w-full h-48 p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        disabled={disabled}
      />
      {paragraph && (
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Your Text (Highlight a portion to analyze)
          </h3>
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <section
            ref={displayRef}
            onMouseUp={handleMouseUp}
            className={`p-4 border border-gray-200 dark:border-gray-700 rounded-md whitespace-pre-wrap text-gray-800 dark:text-gray-200 select-text cursor-text ${disabled ? 'opacity-50' : ''}`}
            style={{ lineHeight: '1.7' }}
            aria-label="Text content for selection and analysis"
          >
            {paragraph}
          </section>
        </div>
      )}
    </div>
  );
};

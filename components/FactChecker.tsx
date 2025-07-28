import React, { useState, useCallback } from 'react';
import { Header } from './Header';
import { TextInputArea } from './TextInputArea';
import { ResultsDisplay } from './ResultsDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { getFactCheck } from '../services/factCheckService';
import { FactCheckResult } from '../types/factCheckTypes';
import { InfoIcon, LightbulbIcon, ZapIcon, ArrowLeft } from './Icons';

interface FactCheckerProps {
  onBack: () => void;
}

const FactChecker: React.FC<FactCheckerProps> = ({ onBack }) => {
  const [paragraph, setParagraph] = useState<string>('');
  const [selectedText, setSelectedText] = useState<string>('');
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelection = useCallback(async (text: string) => {
    if (!text || text.trim().length < 15) {
      // Ignore very short selections
      return;
    }
    setSelectedText(text);
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const factCheckResult = await getFactCheck(paragraph, text);
      setResult(factCheckResult);
    } catch (e) {
      console.error(e);
      setError('An error occurred while analyzing the text. The AI may have been unable to process the request. Please try a different selection.');
    } finally {
      setIsLoading(false);
    }
  }, [paragraph]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <div className="mb-6 p-4">
        <button onClick={onBack} className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold transition-colors">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
      </div>
      
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <TextInputArea 
            paragraph={paragraph} 
            setParagraph={setParagraph} 
            onSelect={handleSelection} 
            disabled={isLoading}
          />
          
          {isLoading && (
            <div className="mt-8">
              <LoadingSpinner selectedText={selectedText} />
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 rounded-lg">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !result && !error && (
             <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg">
                    <InfoIcon className="mx-auto h-8 w-8 text-blue-500 mb-2" />
                    <h3 className="text-lg font-semibold mb-1">How It Works</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Paste your text, highlight a statement, and let our AI provide a fact-check with credible sources.</p>
                </div>
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg">
                    <ZapIcon className="mx-auto h-8 w-8 text-blue-500 mb-2" />
                    <h3 className="text-lg font-semibold mb-1">Powered by AI</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Utilizes Google's Gemini model to analyze text and assess the credibility of various web sources.</p>
                </div>
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg">
                    <LightbulbIcon className="mx-auto h-8 w-8 text-blue-500 mb-2" />
                    <h3 className="text-lg font-semibold mb-1">Get Started</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Enter some text in the box above to begin your first fact-check.</p>
                </div>
            </div>
          )}
          
          {result && (
            <div className="mt-8 animate-fade-in">
              <ResultsDisplay result={result} />
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default FactChecker;
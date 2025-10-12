import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Users, Bot, FileText, BarChart2, AlertCircle } from 'lucide-react';
import { analyzeTextForAI } from '../services/geminiService';
import { AITextAnalysisResult, AIHighlight } from '../types';
import FileUpload from '../components/common/FileUpload';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AudioPlayer from '../components/common/AudioPlayer';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

const HighlightedText: React.FC<{ text: string, highlights: AIHighlight[], color: string }> = ({ text, highlights, color }) => {
    if (highlights.length === 0) {
        return <span>{text}</span>;
    }

    const sortedHighlights = [...highlights].sort((a, b) => text.indexOf(a.snippet) - text.indexOf(b.snippet));
    
    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    sortedHighlights.forEach((highlight, i) => {
        const startIndex = text.indexOf(highlight.snippet);
        if (startIndex === -1) return;

        // Add text before the highlight
        if (startIndex > lastIndex) {
            const partText = text.substring(lastIndex, startIndex);
            parts.push(<span key={`text-${startIndex}-${partText}`}>{partText}</span>);
        }

        // Add the highlighted text
        parts.push(
            <span key={`highlight-${highlight.snippet}`} className={`tooltip tooltip-bottom ${color} rounded p-1`} data-tip={highlight.reason}>
                {highlight.snippet}
            </span>
        );

        lastIndex = startIndex + highlight.snippet.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
        parts.push(<span key="text-last">{text.substring(lastIndex)}</span>);
    }
    
    return <>{parts}</>;
};

const ResultsDisplay: React.FC<{ result: AITextAnalysisResult, originalText: string, onAudioGenerate: () => void }> = ({ result, originalText, onAudioGenerate }) => {
    return (
        <div className="space-y-8 mt-8">
            <div className="card bg-base-200 shadow-md">
                <div className="card-body">
                    <h2 className="card-title text-3xl">Analysis Summary</h2>
                    <p className="text-lg">{result.summary}</p>
                    <button onClick={onAudioGenerate} className="btn btn-secondary mt-2 w-fit">Get Audio Summary</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div className="stat bg-base-200 rounded-box">
                    <div className="stat-figure text-secondary"><Bot size={36}/></div>
                    <div className="stat-title text-lg">AI Likelihood</div>
                    <div className="stat-value text-4xl">{result.likelihood}%</div>
                </div>
                <div className="stat bg-base-200 rounded-box">
                    <div className="stat-figure text-secondary"><FileText size={36}/></div>
                    <div className="stat-title text-lg">Word Count</div>
                    <div className="stat-value text-4xl">{result.wordCount}</div>
                </div>
                <div className="stat bg-base-200 rounded-box">
                    <div className="stat-figure text-secondary"><BarChart2 size={36}/></div>
                    <div className="stat-title text-lg">Readability</div>
                    <div className="stat-value text-2xl">{result.readability}</div>
                </div>
                <div className="stat bg-base-200 rounded-box">
                    <div className="stat-figure text-secondary"><Lightbulb size={36}/></div>
                    <div className="stat-title text-lg">Complex Words</div>
                    <div className="stat-value text-4xl">{result.complexWords}</div>
                </div>
            </div>

            <div className="prose prose-lg max-w-none p-6 bg-base-100 rounded-box border border-base-300 min-h-[200px]">
                <HighlightedText text={originalText} highlights={result.forAI} color="bg-red-200/50" />
                <HighlightedText text={originalText} highlights={result.againstAI} color="bg-green-200/50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card bg-red-100/50 shadow">
                    <div className="card-body">
                        <h3 className="card-title text-2xl"><Bot className="mr-2"/>Points Towards AI</h3>
                        <ul className="list-disc list-inside space-y-2">
                            {result.forAI.map((h) => (
                                <li key={h.snippet}><strong>"{h.snippet}"</strong> - {h.reason}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="card bg-green-100/50 shadow">
                    <div className="card-body">
                        <h3 className="card-title text-2xl"><Users className="mr-2"/>Points Towards Human</h3>
                         <ul className="list-disc list-inside space-y-2">
                            {result.againstAI.map((h) => (
                                <li key={h.snippet}><strong>"{h.snippet}"</strong> - {h.reason}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AITextCheckerPage: React.FC = () => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AITextAnalysisResult | null>(null);

    const { isPlaying, isGenerating, error: audioError, generateAndPlay, play, pause } = useAudioPlayer();

    const handleAnalysis = useCallback(async () => {
        if (!text.trim()) {
            setError('Please enter some text to analyze.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const analysisResult = await analyzeTextForAI(text);
            setResult(analysisResult);
        } catch (e: any) {
            setError(`An error occurred during analysis: ${e.message}`);
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [text]);

    const handleFileUpload = (content: string) => {
        setText(content);
    };

    const handleGenerateAudio = () => {
        if (result) {
            const audioContent = `Here is a summary of the analysis for your text. The likelihood of it being AI-generated is ${result.likelihood} percent. ${result.summary}`;
            generateAndPlay(audioContent);
        }
    }

    return (
        <div>
            <div className="text-center">
                <h1 className="text-5xl font-bold">AI Text Checker</h1>
                <p className="text-2xl mt-4 text-base-content/70">Find out if text was written by a human or an AI.</p>
            </div>

            <div className="max-w-4xl mx-auto mt-12">
                <textarea
                    className="textarea textarea-bordered textarea-lg w-full h-64 text-lg"
                    placeholder="Paste text here to analyze..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isLoading}
                ></textarea>
                <div className="flex items-center justify-between mt-4">
                    <p className="text-base-content/70">{text.length} characters</p>
                    <button className="btn btn-primary btn-lg" onClick={handleAnalysis} disabled={isLoading || !text}>
                        {isLoading ? <span className="loading loading-spinner"></span> : "Analyze Text"}
                    </button>
                </div>
                <div className="divider text-xl">OR</div>
                <FileUpload onFileUpload={handleFileUpload} acceptedTypes={['text/plain']} prompt="Upload a text file" />
            </div>

            <div className="mt-12 max-w-5xl mx-auto">
                {isLoading && <LoadingSpinner />}
                {error && <div className="alert alert-error"><AlertCircle /><span>{error}</span></div>}
                
                {(result || isGenerating || isPlaying || audioError) && (
                    <div className="my-4">
                        <AudioPlayer 
                            isPlaying={isPlaying} 
                            isGenerating={isGenerating} 
                            error={audioError} 
                            play={play} 
                            pause={pause}
                            generate={handleGenerateAudio}
                        />
                    </div>
                )}
                
                {result && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <ResultsDisplay result={result} originalText={text} onAudioGenerate={handleGenerateAudio} />
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AITextCheckerPage;
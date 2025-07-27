
import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import type { JSX } from 'react';
import { AnalysisResult, AnalysisObservation, SourceCheckResult, HumanTextExplanationResult } from '../types';
import { analyzeTextForAI, findSourcesForText, explainHumanText } from '../services/geminiService';
import { 
    Robot, 
    Feather, 
    Tie, 
    Lightbulb,
    AlertTriangle,
    ArrowLeft,
    Sparkles,
    CheckCircle,
    HandDrawnCircle,
    ChatBubble,
    XCircle,
    Refresh,
    MagnifyingGlass,
    BookOpen,
    LinkIcon,
    ThumbUp
} from './Icons';

const LoadingSpinner: React.FC<{text?: string}> = ({text}) => (
    <div className="flex flex-col items-center justify-center text-center p-8">
        <Sparkles className="h-16 w-16 text-blue-500 animate-pulse mb-4" />
        <p className="text-xl font-semibold text-slate-700 font-kalam">{text || 'Thinking...'}</p>
        <p className="text-slate-500 mt-2">This may take a moment.</p>
    </div>
);

const LikelihoodMeter: React.FC<{ score: number }> = ({ score }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    let color = 'text-emerald-500';
    let ringColor = 'stroke-emerald-500';
    let trackColor = 'stroke-emerald-200/80';
    let label = 'Very Likely Human';
    let Icon = Feather;

    if (score >= 70) {
        color = 'text-amber-600';
        ringColor = 'stroke-amber-500';
        trackColor = 'stroke-amber-200/80';
        label = 'Likely AI-Generated';
        Icon = Robot;
    } else if (score >= 30) {
        color = 'text-yellow-600';
        ringColor = 'stroke-yellow-500';
        trackColor = 'stroke-yellow-200/80';
        label = 'Shows Some AI Traits';
        Icon = Tie;
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 mb-6">
            <div className="relative h-32 w-32">
                <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 120 120">
                    <circle
                        className={trackColor}
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="60"
                        cy="60"
                    />
                    <circle
                        className={`${ringColor} transition-all duration-1000 ease-out`}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset: offset }}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="60"
                        cy="60"
                    />
                </svg>
                <div className={`absolute inset-0 flex flex-col items-center justify-center ${color}`}>
                     <Icon className="h-8 w-8 mb-1" />
                    <span className="text-3xl font-bold">{score}%</span>
                </div>
            </div>
            <p className={`mt-3 text-lg font-kalam font-bold ${color}`}>{label}</p>
        </div>
    );
};


const CommentBubble: React.FC<{ observation: AnalysisObservation | string | null; onClose: () => void; }> = ({ observation, onClose }) => {
    // Support both string and object for backward compatibility
    let trait = '';
    let explanation = '';
    if (typeof observation === 'string') {
        explanation = observation;
    } else if (observation) {
        trait = observation.trait || '';
        explanation = observation.explanation || '';
    }
    const hasNote = explanation && explanation.trim().length > 0;
    return (
        <div className="bg-amber-100 border-2 border-amber-300 rounded-xl shadow-lg p-4 w-64 animate-fade-in-fast relative">
            <button onClick={onClose} className="absolute top-2 right-2 text-amber-600 hover:text-amber-800">
                <XCircle className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 mb-2">
                <ChatBubble className="h-6 w-6 text-amber-700 flex-shrink-0" />
                <h3 className="font-kalam text-lg font-bold text-amber-800">{trait || 'AI Checker Note'}</h3>
            </div>
            <div className="text-sm text-slate-700 leading-relaxed">
                {hasNote ? (
                    <ReactMarkdown>{explanation}</ReactMarkdown>
                ) : (
                    <span className="italic text-slate-500">No specific note for this highlight.</span>
                )}
            </div>
        </div>
    );
};

const FactCheckModal: React.FC<{
    isChecking: boolean;
    result: SourceCheckResult | null;
    error: string | null;
    selectedText: string;
    onClose: () => void;
}> = ({ isChecking, result, error, selectedText, onClose }) => {
    const [activeSourceUrl, setActiveSourceUrl] = useState<string | null>(null);

    useEffect(() => {
        // When results arrive, automatically select the first source to display
        if (result && result.sources.length > 0) {
            setActiveSourceUrl(result.sources[0].web.uri);
        } else {
            setActiveSourceUrl(null);
        }
    }, [result]);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in-fast">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="p-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-slate-800">Fact-Check Results</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                        <XCircle className="h-7 w-7" />
                    </button>
                </header>
                <div className="p-6 overflow-y-auto">
                    <div className="mb-6 bg-slate-100 p-4 rounded-lg">
                        <p className="text-sm text-slate-600 font-semibold mb-1">You asked about:</p>
                        <p className="text-slate-800 italic">"{selectedText}"</p>
                    </div>
                    {isChecking && <LoadingSpinner text="Searching for sources..." />}
                    {error && (
                        <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-center gap-4">
                            <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold">Couldn't check sources.</h3>
                                <p>{error}</p>
                            </div>
                        </div>
                    )}
                    {result && (
                        <div className="space-y-6">
                            {/* Sources Section */}
                            {result.sources && result.sources.length > 0 ? (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3 font-kalam">Sources</h3>
                                    <div className="flex flex-col gap-3">
                                        {result.sources.map((source, index) => (
                                            <div key={source.web.uri || source.web.title || index} className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold">{source.web.title || 'Untitled Source'}</span>
                                                    {source.web.uri && (
                                                        <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="ml-2 text-sky-600 underline text-xs">View Source</a>
                                                    )}
                                                </div>
                                                {activeSourceUrl === source.web.uri && source.web.uri && (
                                                    <div className="mt-2 border border-slate-300 rounded shadow-inner overflow-hidden" style={{height: '40vh'}}>
                                                        <iframe
                                                            src={source.web.uri}
                                                            title={source.web.title || 'Source Viewer'}
                                                            className="w-full h-full border-0 bg-white"
                                                            sandbox="allow-scripts allow-same-origin"
                                                        ></iframe>
                                                    </div>
                                                )}
                                                {source.web.uri && (
                                                    <button
                                                        className={`mt-2 px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold ${activeSourceUrl === source.web.uri ? 'bg-blue-300' : ''}`}
                                                        onClick={() => setActiveSourceUrl(source.web.uri)}
                                                    >
                                                        {activeSourceUrl === source.web.uri ? 'Hide Preview' : 'Preview Source'}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-amber-700">No specific web sources were returned for this query. The AI's analysis is based on its general knowledge and training data.</p>
                                </div>
                            )}
                            {/* Analysis/Summary Section */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2 font-kalam">Analysis</h3>
                                <div className="text-slate-700 leading-relaxed">
                                    {result.analysis && result.analysis.trim().length > 0 ? (
                                        <ReactMarkdown>{result.analysis}</ReactMarkdown>
                                    ) : (
                                        <span className="italic text-slate-500">No summary or analysis was returned for this query.</span>
                                    )}
                                </div>
                            </div>
                            {/* Source Preview Section */}
                            {activeSourceUrl && (
                                <div className="border border-slate-300 rounded-lg shadow-inner overflow-hidden" style={{height: '60vh'}}>
                                    <div className="p-2 bg-slate-200 border-b border-slate-300 text-xs text-slate-600 flex justify-between items-center">
                                        <p className="truncate mr-4">Viewing: <span className="font-semibold text-slate-800">{activeSourceUrl}</span></p>
                                        <a href={activeSourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline font-semibold flex-shrink-0">
                                            Open in New Tab
                                            <LinkIcon className="h-4 w-4" />
                                        </a>
                                    </div>
                                    <iframe
                                        src={activeSourceUrl}
                                        title={result.sources.find(s => s.web.uri === activeSourceUrl)?.web.title || 'Source Viewer'}
                                        className="w-full h-full border-0 bg-white"
                                        sandbox="allow-scripts allow-same-origin"
                                    ></iframe>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <footer className="p-4 border-t border-slate-200 text-right flex-shrink-0 bg-slate-50">
                    <button onClick={onClose} className="bg-slate-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-slate-700 transition-colors">
                        Close
                    </button>
                </footer>
            </div>
        </div>
    );
};

const ExplanationModal: React.FC<{
    isExplaining: boolean;
    explanation: HumanTextExplanationResult | null;
    error: string | null;
    selectedText: string;
    onClose: () => void;
}> = ({ isExplaining, explanation, error, selectedText, onClose }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in-fast">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <header className="p-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-3">
                    <ThumbUp className="h-6 w-6 text-emerald-600" />
                    <h2 className="text-xl font-bold text-slate-800">Why this sounds human</h2>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                    <XCircle className="h-7 w-7" />
                </button>
            </header>
            <div className="p-6 overflow-y-auto">
                <div className="mb-6 bg-slate-100 p-4 rounded-lg">
                    <p className="text-sm text-slate-600 font-semibold mb-1">You asked about:</p>
                    <p className="text-slate-800 italic">"{selectedText}"</p>
                </div>
                {isExplaining && <LoadingSpinner text="Getting an explanation..." />}
                {error && (
                    <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-center gap-4">
                        <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold">Couldn't get explanation.</h3>
                            <p>{error}</p>
                        </div>
                    </div>
                )}
                {explanation && explanation.explanation && explanation.explanation.trim().length > 0 ? (
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2 font-kalam">Our thoughts...</h3>
                        <div className="text-slate-700 leading-relaxed">
                            <ReactMarkdown>{explanation.explanation}</ReactMarkdown>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-amber-700">Error: No explanation available.</p>
                    </div>
                )}
            </div>
             <footer className="p-4 border-t border-slate-200 text-right flex-shrink-0 bg-slate-50">
                <button onClick={onClose} className="bg-slate-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-slate-700 transition-colors">
                    Close
                </button>
            </footer>
        </div>
    </div>
);


interface AICheckerProps {
    onBack: () => void;
}

const AIChecker: React.FC<AICheckerProps> = ({ onBack }) => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeObservationIndex, setActiveObservationIndex] = useState<number | null>(null);
    
    // State for fact-checking and explanations
    const [selectedText, setSelectedText] = useState('');
    const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
    const [selectionIsSuspicious, setSelectionIsSuspicious] = useState(false);
    
    const [isFactChecking, setIsFactChecking] = useState(false);
    const [factCheckResult, setFactCheckResult] = useState<SourceCheckResult | null>(null);
    const [factCheckError, setFactCheckError] = useState<string | null>(null);
    const [showFactCheckModal, setShowFactCheckModal] = useState(false);

    const [isExplaining, setIsExplaining] = useState(false);
    const [explanation, setExplanation] = useState<HumanTextExplanationResult | null>(null);
    const [explanationError, setExplanationError] = useState<string | null>(null);
    const [showExplanationModal, setShowExplanationModal] = useState(false);
    
    const highlightRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const resultsContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const obsLength = Array.isArray(result?.observations) ? result.observations.length : 0;
        highlightRefs.current = highlightRefs.current.slice(0, obsLength);
    }, [result]);
    
    const resetAll = () => {
        setResult(null);
        setText('');
        setError(null);
        setActiveObservationIndex(null);
        // Reset interactive state
        setSelectedText('');
        setPopupPosition(null);
        setShowFactCheckModal(false);
        setIsFactChecking(false);
        setFactCheckResult(null);
        setFactCheckError(null);
        setShowExplanationModal(false);
        setIsExplaining(false);
        setExplanation(null);
        setExplanationError(null);
    };

    const handleAnalyze = async () => {
        if (!text.trim()) {
            setError("Please enter some text to check.");
            return;
        }
        
        // Reset previous results, but keep the text for display
        setResult(null);
        setError(null);
        setActiveObservationIndex(null);
        setSelectedText('');
        setPopupPosition(null);
        setShowFactCheckModal(false);
        setIsFactChecking(false);
        setFactCheckResult(null);
        setFactCheckError(null);
        setShowExplanationModal(false);
        setIsExplaining(false);
        setExplanation(null);
        setExplanationError(null);

        setIsLoading(true);
        try {
            const analysisResult = await analyzeTextForAI(text);
            setResult(analysisResult);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleMouseUp = () => {
        const selection = window.getSelection();
        const selectedString = selection?.toString().trim();

        if (selection && selectedString && resultsContainerRef.current?.contains(selection.anchorNode)) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const containerRect = containerRef.current!.getBoundingClientRect();
            
            const parentElement = selection.anchorNode && (selection.anchorNode as Element).parentElement;
            const isSuspicious = !!parentElement?.closest('.ai-highlight');
            setSelectionIsSuspicious(isSuspicious);

            setSelectedText(selectedString);
            setPopupPosition({
                top: rect.bottom - containerRect.top + 8, // Position below selection
                left: rect.left - containerRect.left + rect.width / 2,
            });
        } else {
            setPopupPosition(null);
        }
    };

    const handleStartFactCheck = async () => {
        if (!selectedText) return;
        
        setPopupPosition(null);
        setShowFactCheckModal(true);
        setIsFactChecking(true);
        setFactCheckError(null);
        setFactCheckResult(null);

        try {
            const res = await findSourcesForText(selectedText);
            setFactCheckResult(res);
        } catch (err: any) {
            setFactCheckError(err.message || "An unexpected error occurred during fact-checking.");
        } finally {
            setIsFactChecking(false);
        }
    };

    const handleStartExplanation = async () => {
        if (!selectedText) return;
        
        setPopupPosition(null);
        setShowExplanationModal(true);
        setIsExplaining(true);
        setExplanationError(null);
        setExplanation(null);

        try {
            const res = await explainHumanText(selectedText);
            setExplanation(res);
        } catch (err: any) {
            setExplanationError(err.message || "An unexpected error occurred.");
        } finally {
            setIsExplaining(false);
        }
    };
    
    const renderHighlightedText = () => {
        if (!result || !text || !Array.isArray(result.highlights) || result.highlights.length === 0) {
            return <div ref={resultsContainerRef} className="whitespace-pre-wrap leading-loose text-lg text-slate-800">{text}</div>;
        }

        const highlights = result.highlights;
        let lastIndex = 0;
        const parts: (string | JSX.Element)[] = [];

        highlights.forEach((hl, idx) => {
            if (hl.start > lastIndex) {
                parts.push(text.substring(lastIndex, hl.start));
            }
            parts.push(
                <span
                    key={idx}
                    ref={el => { highlightRefs.current[idx] = el; }}
                    onClick={() => setActiveObservationIndex(activeObservationIndex === idx ? null : idx)}
                    className={`ai-highlight p-0.5 rounded-md cursor-pointer transition-colors duration-300 ${activeObservationIndex === idx ? 'bg-amber-300' : 'bg-amber-200/70 hover:bg-amber-300/90'}`}
                    title={hl.reason}
                >
                    {hl.text}
                </span>
            );
            lastIndex = hl.end;
        });

        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }

        if (parts.length === 0) {
            return <div ref={resultsContainerRef} className="whitespace-pre-wrap leading-loose text-lg text-slate-800">{text}</div>;
        }

        return <div ref={resultsContainerRef} className="whitespace-pre-wrap leading-loose text-lg text-slate-800">{parts}</div>;
    };
    
    // Defensive: support both string[] and AnalysisObservation[]
    let activeObservation: AnalysisObservation | string | null = null;
    if (activeObservationIndex !== null && result?.observations) {
        if (Array.isArray(result.observations)) {
            activeObservation = result.observations[activeObservationIndex] || null;
        }
    }
    const activeHighlightEl = activeObservationIndex !== null ? highlightRefs.current[activeObservationIndex] : null;
    
    const commentPosition = useMemo(() => {
        if (!activeHighlightEl || !containerRef.current) return null;
        const rect = activeHighlightEl.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        return {
            top: rect.top - containerRect.top + rect.height / 2,
            left: rect.right - containerRect.left + 15,
        };
    }, [activeObservationIndex, activeHighlightEl]);


    return (
        <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 bg-slate-100 relative overflow-hidden">
            <HandDrawnCircle className="absolute -top-20 -left-20 h-64 w-64 text-blue-200/50 opacity-50" />
            <Sparkles className="absolute -bottom-10 -right-10 h-48 w-48 text-amber-200/50 opacity-50" />
            <div className="w-full max-w-5xl mx-auto z-10">
                <div className="mb-6">
                    <button onClick={onBack} className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold transition-colors">
                        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </button>
                </div>

                <header className="text-center mb-6">
                    <Sparkles className="h-12 w-12 mx-auto text-blue-500 mb-2" />
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">AI Text Detective</h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                        Feels like a robot wrote it? Let's investigate! Paste the text below to see it's credibility.
                    </p>
                </header>

                <div className="mb-6 bg-blue-100/70 border border-blue-200 text-blue-800 rounded-xl p-4 flex items-start gap-4">
                    <Lightbulb className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold">How this works:</h3>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>After we check your text, click any <span className="p-1 py-0.5 rounded-md bg-amber-200/70">highlight</span> to see our notes.</li>
                            <li>To fact-check a specific claim or check why it is likely human written, just select <strong>any</strong> text with your mouse to bring up the search button.</li>
                        </ul>
                    </div>
                </div>
                
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200">
                    {!result && !isLoading && (
                        <>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Paste the text you want to analyze here..."
                                className="w-full h-48 p-4 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleAnalyze}
                                disabled={isLoading || !text}
                                className="mt-4 w-full bg-blue-600 text-white font-bold text-lg py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? 'Analyzing...' : 'Check This Text'}
                            </button>
                        </>
                    )}
                     {error && (
                        <div className="mt-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-center gap-4">
                            <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold">Problem Analyzing Text</h3>
                                <p>{error}</p>
                            </div>
                        </div>
                    )}
                </div>

                {(isLoading || result) && (
                    <div className="mt-6 relative">
                        <div ref={containerRef} onMouseUp={handleMouseUp} className="paper-texture bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12 min-h-[30rem] relative">
                            {isLoading && <LoadingSpinner text="Analyzing your text..." />}
                            {result && !isLoading && (
                                <>
                                    {typeof result.likelihood_score !== 'number' || !Array.isArray(result.observations) ? (
                                        <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
                                            <AlertTriangle className="h-10 w-10 mx-auto text-red-500 mb-2" />
                                            <h3 className="text-lg font-semibold text-red-800 font-kalam">Unexpected response from API service</h3>
                                            <p className="text-red-700">Sorry, we couldn't analyze your text due to a service error. Please try again later.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <LikelihoodMeter score={result.likelihood_score} />
                                            <div className="border-t-2 border-dashed border-slate-300 pt-6">
                                                {result.observations.length > 0 ? (
                                                    <>
                                                        <p className="text-center font-kalam text-slate-600 mb-6 -mt-2">Click highlights to see notes, or select any text to fact-check it!</p>
                                                        {renderHighlightedText()}
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="text-center p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
                                                            <CheckCircle className="h-10 w-10 mx-auto text-emerald-500 mb-2" />
                                                            <h3 className="text-lg font-semibold text-emerald-800 font-kalam">All clear!</h3>
                                                            <p className="text-emerald-700">This text appears to be written by a human. No common AI traits were detected.</p>
                                                        </div>
                                                        <div className="mt-4 border-t-2 border-dashed border-slate-300 pt-6">
                                                            <p className="text-center font-kalam text-slate-600 mb-6 -mt-2">You can still select any text to fact-check it!</p>
                                                            {renderHighlightedText()}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        {popupPosition && (
                            <div
                                className="absolute z-20"
                                style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px`, transform: 'translateX(-50%)' }}
                            >
                                <div className="flex items-center gap-2 bg-slate-800 text-white p-1 rounded-full shadow-lg animate-fade-in-fast">
                                    <button 
                                        onClick={handleStartFactCheck}
                                        className="flex items-center gap-2 font-semibold py-1.5 px-4 rounded-full hover:bg-blue-600 transition-colors">
                                        <MagnifyingGlass className="h-4 w-4" />
                                        Fact-check
                                    </button>
                                    {!selectionIsSuspicious && (
                                        <>
                                            <div className="w-px h-5 bg-slate-600"></div>
                                            <button 
                                                onClick={handleStartExplanation}
                                                className="flex items-center gap-2 font-semibold py-1.5 px-4 rounded-full hover:bg-emerald-600 transition-colors">
                                                <ThumbUp className="h-4 w-4" />
                                                Why is this OK?
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                         )}
                         {commentPosition && activeObservation && (
                            <div
                                className="absolute z-20"
                                style={{
                                    top: `${commentPosition.top}px`,
                                    left: `${commentPosition.left}px`,
                                    transform: 'translateY(-50%)',
                                }}
                            >
                                <CommentBubble observation={activeObservation} onClose={() => setActiveObservationIndex(null)} />
                            </div>
                        )}
                        {result && !isLoading && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={resetAll}
                                    className="group inline-flex items-center justify-center gap-2 bg-slate-600 text-white font-semibold text-md py-2 px-6 rounded-full shadow-md hover:bg-slate-700 transition-colors focus:outline-none focus:ring-4 focus:ring-slate-300"
                                >
                                    <Refresh className="h-4 w-4" />
                                    Check another text
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showFactCheckModal && (
                <FactCheckModal 
                    isChecking={isFactChecking}
                    result={factCheckResult}
                    error={factCheckError}
                    selectedText={selectedText}
                    onClose={() => setShowFactCheckModal(false)}
                />
            )}
            {showExplanationModal && (
                <ExplanationModal 
                    isExplaining={isExplaining}
                    explanation={explanation}
                    error={explanationError}
                    selectedText={selectedText}
                    onClose={() => setShowExplanationModal(false)}
                />
            )}
        </div>
    );
};

export default AIChecker;
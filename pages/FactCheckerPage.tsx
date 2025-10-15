
import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertCircle, CheckCircle, HelpCircle, XCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { factCheckClaim, processFactCheckResults } from '../services/geminiService';
import { SourceCredibility } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Progress Bar Component
const ProgressBar: React.FC<{ 
    percentage: number; 
    stage: string; 
    stages: string[];
}> = ({ percentage, stage, stages }) => {
    const currentStageIndex = stages.findIndex(s => s === stage);
    
    return (
        <div className="w-full max-w-2xl mx-auto mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="font-medium">{stage}</span>
                <span>{Math.round(percentage)}%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                    className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            
            {/* Stage Indicators */}
            <div className="flex justify-between">
                {stages.map((stageName, index) => {
                    const isComplete = index < currentStageIndex;
                    const isCurrent = index === currentStageIndex;
                    const isPending = index > currentStageIndex;
                    
                    let dotClass = 'bg-gray-300';
                    if (isComplete) {
                        dotClass = 'bg-primary';
                    } else if (isCurrent) {
                        dotClass = 'bg-primary animate-pulse';
                    }
                    
                    return (
                        <div key={stageName} className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${dotClass}`} />
                            <span className={`text-xs mt-1 transition-colors duration-300 ${
                                !isPending ? 'text-primary font-medium' : 'text-gray-500'
                            }`}>
                                {stageName}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const CredibilityBadge: React.FC<{ credibility: SourceCredibility['credibility'] }> = ({ credibility }) => {
    const getCredibilityStyle = () => {
        switch (credibility) {
            case 'Very High':
                return {
                    className: "bg-green-100 text-green-800 border border-green-200",
                    icon: <CheckCircle className="w-4 h-4" />,
                    text: "Very High"
                };
            case 'High':
                return {
                    className: "bg-green-100 text-green-800 border border-green-200",
                    icon: <CheckCircle className="w-4 h-4" />,
                    text: "High"
                };
            case 'Medium High':
                return {
                    className: "bg-green-50 text-green-700 border border-green-200",
                    icon: <CheckCircle className="w-4 h-4" />,
                    text: "Medium High"
                };
            case 'Medium':
                return {
                    className: "bg-yellow-100 text-yellow-800 border border-yellow-200",
                    icon: <HelpCircle className="w-4 h-4" />,
                    text: "Medium"
                };
            case 'Medium Low':
                return {
                    className: "bg-orange-100 text-orange-800 border border-orange-200",
                    icon: <AlertCircle className="w-4 h-4" />,
                    text: "Medium Low"
                };
            case 'Low':
                return {
                    className: "bg-red-100 text-red-800 border border-red-200",
                    icon: <XCircle className="w-4 h-4" />,
                    text: "Low"
                };
            case 'Very Low':
                return {
                    className: "bg-red-100 text-red-800 border border-red-200",
                    icon: <XCircle className="w-4 h-4" />,
                    text: "Very Low"
                };
            default:
                return {
                    className: "bg-gray-100 text-gray-800 border border-gray-200",
                    icon: <HelpCircle className="w-4 h-4" />,
                    text: "Unknown"
                };
        }
    };

    const { className, icon, text } = getCredibilityStyle();
    
    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${className}`}>
            {icon}
            {text}
        </span>
    );
};

const RenderedSummary: React.FC<{ summary: string; sources: SourceCredibility[] }> = ({ summary, sources }) => {
    // Extract only the first sentence for verdict, keep rest intact with all markdown formatting
    const firstSentenceMatch = summary.match(/^[^.!?]+[.!?]/);
    const verdict = firstSentenceMatch ? firstSentenceMatch[0].trim() : summary.split('\n')[0];
    const restOfSummary = firstSentenceMatch ? summary.slice(firstSentenceMatch[0].length).trim() : '';
    
    // Custom component to render citations as clickable superscript badges
    const components = {
        // Handle inline code (which includes citation markers like [1])
        code: ({ node, inline, children, ...props }: any) => {
            const text = String(children);
            const citationMatch = /^\[(\d+)\]$/.exec(text);
            
            if (citationMatch) {
                const sourceIndex = parseInt(citationMatch[1], 10) - 1;
                if (sources[sourceIndex]) {
                    return (
                        <a 
                            href={`#source-${sourceIndex}`} 
                            className="inline-flex items-center text-primary hover:text-primary-focus transition-colors duration-200 no-underline font-medium text-sm ml-0.5"
                            title={`Source: ${sources[sourceIndex].title}`}
                        >
                            <sup className="bg-primary text-primary-content px-1.5 py-0.5 rounded-full text-xs font-bold hover:bg-primary-focus transition-all duration-200">
                                {citationMatch[1]}
                            </sup>
                        </a>
                    );
                }
            }
            return inline ? <code {...props}>{children}</code> : <code {...props}>{children}</code>;
        },
        // Style headings for content organization
        h3: ({ children }: any) => <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">{children}</h3>,
        h4: ({ children }: any) => <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">{children}</h4>,
        // Ensure paragraphs maintain proper spacing
        p: ({ children }: any) => <p className="mb-4">{children}</p>,
        // Style links
        a: ({ href, children }: any) => (
            <a href={href} className="text-primary hover:text-primary-focus underline" target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        ),
        // Style strong/bold text
        strong: ({ children }: any) => <strong className="font-bold text-gray-900">{children}</strong>,
        // Style emphasis/italic text  
        em: ({ children }: any) => <em className="italic">{children}</em>,
        // Style unordered lists
        ul: ({ children }: any) => <ul className="list-disc list-inside space-y-2 my-4">{children}</ul>,
        // Style ordered lists
        ol: ({ children }: any) => <ol className="list-decimal list-inside space-y-2 my-4">{children}</ol>,
        // Style list items
        li: ({ children }: any) => <li className="ml-4">{children}</li>,
    };
    
    // Replace citation markers [1] with backticks for markdown processing
    const processTextForMarkdown = (text: string) => {
        return text.replace(/\[(\d+)\]/g, '`[$1]`');
    };

    return (
        <div className="space-y-6">
            {/* Verdict */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6">
                <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div className="w-full">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Verdict</h3>
                        <div className="text-xl leading-relaxed text-gray-800 font-medium prose prose-xl max-w-none">
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={components}
                            >
                                {processTextForMarkdown(verdict)}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Analysis */}
            {restOfSummary && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Detailed Analysis</h3>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={components}
                        >
                            {processTextForMarkdown(restOfSummary)}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
};

const cleanUrl = (url: string): string => {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('google.com') && urlObj.pathname === '/url') {
            const searchParams = new URLSearchParams(urlObj.search);
            const q = searchParams.get('q');
            if (q) return q;
        }
    } catch (e) {
        // Not a valid URL, or other error, return original
        console.error('Error cleaning URL:', e);
    }
    return url;
};

const getCredibilityClass = (credibility: SourceCredibility['credibility']) => {
    const base = 'p-6 rounded-xl border transition-all duration-200 scroll-mt-24 hover:shadow-md';
    switch (credibility) {
        case 'Very High':
            return `${base} bg-green-50 border-green-200 hover:border-green-300`;
        case 'High':
            return `${base} bg-green-50 border-green-200 hover:border-green-300`;
        case 'Medium High':
            return `${base} bg-green-50 border-green-200 hover:border-green-300`;
        case 'Medium':
            return `${base} bg-yellow-50 border-yellow-200 hover:border-yellow-300`;
        case 'Medium Low':
            return `${base} bg-orange-50 border-orange-200 hover:border-orange-300`;
        case 'Low':
            return `${base} bg-red-50 border-red-200 hover:border-red-300`;
        case 'Very Low':
            return `${base} bg-red-50 border-red-200 hover:border-red-300`;
        default:
            return `${base} bg-gray-50 border-gray-200 hover:border-gray-300`;
    }
};


type SourceCredibilityWithOriginal = SourceCredibility & { originalUrl: string };

const FactCheckerPage: React.FC = () => {
    const [claim, setClaim] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    // Store both cleaned and original URLs
    const [sources, setSources] = useState<SourceCredibilityWithOriginal[]>([]);
    const [sortOrder, setSortOrder] = useState<'default' | 'high-to-low' | 'low-to-high'>('default');
    const [progressStage, setProgressStage] = useState<string>('');
    const [progressPercentage, setProgressPercentage] = useState<number>(0);

    const handleAnalysis = useCallback(async () => {
        if (!claim.trim()) {
            setError('Please enter a claim to fact-check.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSummary(null);
        setSources([]);
        setProgressStage('Searching');
        setProgressPercentage(10);

        try {
            // Step 1: Get initial summary and source URLs from Gemini with Search
            setProgressStage('Searching');
            setProgressPercentage(15);
            const { summary: initialSummary, sources: rawSources } = await factCheckClaim(claim);
            
            setProgressStage('Searching');
            setProgressPercentage(35);

            // Step 2: Extract unique sources with titles and clean URLs
             const uniqueSources = Array.from(new Map(
                rawSources
                    .map(s => s.web)
                    .filter((s): s is { uri: string; title?: string } => !!s?.uri)
                    .map(s => {
                        const cleanedUri = cleanUrl(s.uri);
                        return [cleanedUri, { uri: cleanedUri, title: s.title || 'Untitled Source' }];
                    })
            ).values());
            
            setProgressStage('Analyzing');
            setProgressPercentage(50);
            
            if (uniqueSources.length === 0) {
              setSummary(initialSummary); // Show at least the initial summary if no sources are found
              setProgressStage('Complete');
              setProgressPercentage(100);
              setIsLoading(false);
              return;
            }

            // Step 3: Get annotated summary and credibility for sources
            setProgressStage('Verifying');
            setProgressPercentage(75);
            const { annotatedSummary, sources: processedSources } = await processFactCheckResults(initialSummary, uniqueSources);
            
            setProgressStage('Complete');
            setProgressPercentage(100);
            
            setSummary(annotatedSummary);
            setSources(processedSources.map(s => ({
                ...s,
                originalUrl: s.url, // keep the original
                url: cleanUrl(s.url) // cleaned for navigation
            })));

        } catch (e: any) {
            if (e.message === 'SERVER_WARMING') {
                setError('Our server is starting up. Your request will be processed once it\'s ready - this usually takes 30-45 seconds.');
            } else if (e.message === 'SERVER_ERROR') {
                setError('Our server is temporarily unavailable. Please try again in a few minutes.');
            } else {
                setError(`An error occurred while fact-checking: ${e.message}`);
            }
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [claim]);

    const sortedSources = useMemo(() => {
        const credibilityScore: Record<SourceCredibility['credibility'], number> = {
            'Very High': 6,
            'High': 5,
            'Medium High': 4,
            'Medium': 3,
            'Medium Low': 2,
            'Low': 1,
            'Very Low': 0,
            'Unknown': -1
        };

    const sourceWithOriginalIndex = sources.map((s, i) => ({ ...s, originalIndex: i }));

        if (sortOrder === 'default') {
            return sourceWithOriginalIndex;
        }

        const sorted = [...sourceWithOriginalIndex].sort((a, b) => {
            const scoreA = credibilityScore[a.credibility];
            const scoreB = credibilityScore[b.credibility];
            return sortOrder === 'high-to-low' ? scoreB - scoreA : scoreA - scoreB;
        });
        return sorted;
    }, [sources, sortOrder]);


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Trusty Fact-Checker</h1>
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Get a quick read on claims and news stories with credible sources.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto mb-12">
                    <div className="form-control">
                        <div className="join shadow-lg">
                            <input
                                type="text"
                                className="input input-bordered input-lg join-item w-full text-lg bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                placeholder="Enter a claim, e.g., 'Does vitamin C prevent colds?'"
                                value={claim}
                                onChange={(e) => setClaim(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAnalysis()}
                                disabled={isLoading}
                            />
                            <button 
                                className="btn btn-primary btn-lg join-item px-8" 
                                onClick={handleAnalysis} 
                                disabled={isLoading || !claim}
                            >
                                {isLoading ? (
                                    <span className="loading loading-spinner loading-md"></span>
                                ) : (
                                    <>
                                        <Search size={24} />
                                        <span className="hidden sm:inline ml-2">Check Claim</span>
                                    </>
                                )}
                            </button>
                        </div>
                        
                        {/* Example claims when no input */}
                        {!claim && !summary && !isLoading && (
                            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-3 text-center">Try these example claims:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        "Does drinking coffee dehydrate you?",
                                        "Find studies explaining the distribution and credibility of sources that ChatGPT and other major LLMs use.",
                                        "Is chocolate good for your heart?",
                                        "Do goldfish have 3-second memory?"
                                    ].map((example) => (
                                        <button
                                            key={example}
                                            onClick={() => setClaim(example)}
                                            className="text-left p-3 rounded-lg bg-gray-50 hover:bg-primary/5 border border-gray-200 hover:border-primary/30 transition-all duration-200 text-sm"
                                        >
                                            <span className="text-primary">→</span> {example}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 text-center mt-4">
                                    Click any example to try it, or type your own claim above
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* How it Works section when no results */}
                {!summary && !isLoading && !error && (
                    <div className="max-w-3xl mx-auto mb-8">
                        <div className="card bg-white shadow-lg border border-gray-200">
                            <div className="card-body p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
                                    <HelpCircle className="w-5 h-5 text-primary" />
                                    How Our Fact-Checking Works
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Search className="w-6 h-6 text-primary" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">1. Search</h4>
                                        <p className="text-sm text-gray-600">We search through Google, iterating with variations in our searching methods until credible sources are found.</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <CheckCircle className="w-6 h-6 text-primary" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">2. Analyze</h4>
                                        <p className="text-sm text-gray-600">We evaluate each specific source's content, methodology, and relevance—not just the domain</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <HelpCircle className="w-6 h-6 text-primary" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">3. Report</h4>
                                        <p className="text-sm text-gray-600">We provide a clear verdict with source transparency</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-8">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <ProgressBar 
                                percentage={progressPercentage} 
                                stage={progressStage}
                                stages={['Searching', 'Analyzing', 'Verifying', 'Complete']}
                            />
                            <div className="text-center">
                                <LoadingSpinner message={`${progressStage} claim and gathering sources...`} />
                                <p className="text-gray-600 mt-4 max-w-md">
                                    {progressStage === 'Searching' && "We're searching through credible sources to fact-check your claim."}
                                    {progressStage === 'Analyzing' && "Analyzing the quality and relevance of sources found."}
                                    {progressStage === 'Verifying' && "Evaluating each source's credibility and evidence."}
                                    {progressStage === 'Complete' && "Finalizing your fact-check results."}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    This usually takes 15-30 seconds depending on the complexity of your claim.
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {error && (
                        <div className="alert alert-error shadow-lg bg-red-50 border border-red-200">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                            <span className="text-red-800">{error}</span>
                        </div>
                    )}

                {(summary || sources.length > 0) && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        {summary && (
                             <div className="card bg-white shadow-xl border border-gray-200">
                                <div className="card-body p-8 max-w-none">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <Search className="w-6 h-6 text-primary" />
                                        Fact-Check Results
                                    </h2>
                                    <RenderedSummary summary={summary} sources={sources} />
                                </div>
                            </div>
                        )}

                        {sources.length > 0 && (
                            <div className="card bg-white shadow-xl border border-gray-200">
                                <div className="card-body p-8">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                                                <HelpCircle className="w-6 h-6 text-primary" />
                                                Sources & Credibility
                                            </h2>
                                            <p className="text-gray-600">
                                                {sources.length} source{sources.length !== 1 ? 's' : ''} found
                                            </p>
                                        </div>
                                        <div className="form-control w-full sm:w-auto">
                                            <label htmlFor="credibility-sort" className="label hidden sm:block">
                                                <span className="label-text font-semibold text-gray-700">Sort by Credibility</span>
                                            </label>
                                            <select
                                                id="credibility-sort"
                                                className="select select-bordered bg-white border-gray-300"
                                                value={sortOrder}
                                                onChange={(e) => setSortOrder(e.target.value as 'default' | 'high-to-low' | 'low-to-high')}
                                                aria-label="Sort sources by credibility"
                                            >
                                                <option value="default">Default Order</option>
                                                <option value="high-to-low">High to Low Credibility</option>
                                                <option value="low-to-high">Low to High Credibility</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid gap-4">
                                        {sortedSources.map((source) => (
                                            <div key={source.url + source.originalUrl} id={`source-${source.originalIndex}`} className={getCredibilityClass(source.credibility)}>
                                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                                                    <div className="flex-grow space-y-3">
                                                        <div className="flex items-start gap-3">
                                                            <span className="bg-primary text-primary-content px-2 py-1 rounded-full text-sm font-bold flex-shrink-0 mt-0.5">
                                                                {source.originalIndex + 1}
                                                            </span>
                                                            <div>
                                                                <a 
                                                                    href={source.url} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="text-primary hover:text-primary-focus font-semibold text-lg leading-tight transition-colors duration-200 block"
                                                                    title={source.originalUrl}
                                                                >
                                                                    {source.title}
                                                                </a>
                                                                {/* Subtitle removed for cleaner UI */}
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-700 leading-relaxed pl-9">
                                                            {source.explanation}
                                                        </p>
                                                    </div>
                                                    <div className="flex-shrink-0 lg:ml-4">
                                                        <CredibilityBadge credibility={source.credibility} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Trust indicators */}
                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            How We Rate Sources
                                        </h4>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p><strong>Very High/High:</strong> Peer-reviewed studies with relevant methodology, official sources with specific guidance, well-sourced articles with expert evidence</p>
                                            <p><strong>Medium:</strong> News with some expert sourcing, organization reports, government pages with general information</p>
                                            <p><strong>Low:</strong> Poor sourcing, opinion pieces, outdated information, or sources with unclear authorship</p>
                                            <p className="text-xs mt-2 italic">We evaluate each specific page/paper, not just the website domain.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
                </div>
            </div>
        </div>
    );
};

export default FactCheckerPage;

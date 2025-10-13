
import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertCircle, CheckCircle, HelpCircle, XCircle } from 'lucide-react';
import { factCheckClaim, processFactCheckResults } from '../services/geminiService';
import { SourceCredibility } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CredibilityBadge: React.FC<{ credibility: SourceCredibility['credibility'] }> = ({ credibility }) => {
    const baseClass = "badge badge-lg font-semibold";
    switch (credibility) {
        case 'Very High':
            return <span className={`${baseClass} badge-success`}><CheckCircle className="mr-2" /> Very High</span>;
        case 'High':
            return <span className={`${baseClass} badge-success`}><CheckCircle className="mr-2" /> High</span>;
        case 'Medium High':
            return <span className={`${baseClass} badge-success`}><HelpCircle className="mr-2" /> Medium High</span>;
        case 'Medium':
            return <span className={`${baseClass} badge-warning`}><HelpCircle className="mr-2" /> Medium</span>;
        case 'Medium Low':
            return <span className={`${baseClass} badge-warning`}><AlertCircle className="mr-2" /> Medium Low</span>;
        case 'Low':
            return <span className={`${baseClass} badge-error`}><XCircle className="mr-2" /> Low</span>;
        case 'Very Low':
            return <span className={`${baseClass} badge-error`}><XCircle className="mr-2" /> Very Low</span>;
        default:
            return <span className={`${baseClass} badge-ghost`}>Unknown</span>;
    }
};

const RenderedSummary: React.FC<{ summary: string; sources: SourceCredibility[] }> = ({ summary, sources }) => {
    const parts = summary.split(/(\[\d+\])/g);
    return (
        <p className="whitespace-pre-wrap">
            {parts.filter(Boolean).map((part, i) => {
                const match = RegExp(/\[(\d+)\]/).exec(part);
                if (match) {
                    const sourceIndex = parseInt(match[1], 10) - 1;
                    if (sources[sourceIndex]) {
                        return (
                            <a key={`${part}-${i}`} href={`#source-${sourceIndex}`} className="font-bold text-primary no-underline tooltip" data-tip={`Jump to Source: ${sources[sourceIndex].title}`}>
                                <sup>{part}</sup>
                            </a>
                        );
                    }
                }
                return <span key={`${part}-${i}`}>{part}</span>;
            })}
        </p>
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
    const base = 'p-4 rounded-lg border transition-all scroll-mt-24';
    switch (credibility) {
        case 'Very High':
            return `${base} bg-green-200 border-green-400 hover:shadow-md hover:border-green-500`;
        case 'High':
            return `${base} bg-green-100 border-green-300 hover:shadow-md hover:border-green-400`;
        case 'Medium High':
            return `${base} bg-green-50 border-green-200 hover:shadow-md hover:border-green-300`;
        case 'Medium':
            return `${base} bg-yellow-50 border-yellow-200 hover:shadow-md hover:border-yellow-300`;
        case 'Medium Low':
            return `${base} bg-yellow-100 border-yellow-300 hover:shadow-md hover:border-yellow-400`;
        case 'Low':
            return `${base} bg-red-50 border-red-200 hover:shadow-md hover:border-red-300`;
        case 'Very Low':
            return `${base} bg-red-200 border-red-400 hover:shadow-md hover:border-red-500`;
        default:
            return `${base} bg-slate-50 border-slate-200 hover:shadow-md hover:border-slate-300`;
    }
};


const FactCheckerPage: React.FC = () => {
    const [claim, setClaim] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [sources, setSources] = useState<SourceCredibility[]>([]);
    const [sortOrder, setSortOrder] = useState<'default' | 'high-to-low' | 'low-to-high'>('default');

    const handleAnalysis = useCallback(async () => {
        if (!claim.trim()) {
            setError('Please enter a claim to fact-check.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSummary(null);
        setSources([]);

        try {
            // Step 1: Get initial summary and source URLs from Gemini with Search
            const { summary: initialSummary, sources: rawSources } = await factCheckClaim(claim);

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
            
            if (uniqueSources.length === 0) {
              setSummary(initialSummary); // Show at least the initial summary if no sources are found
              setIsLoading(false);
              return;
            }

            // Step 3: Get annotated summary and credibility for sources
            const { annotatedSummary, sources: processedSources } = await processFactCheckResults(initialSummary, uniqueSources);
            
            setSummary(annotatedSummary);
            setSources(processedSources.map(s => ({...s, url: cleanUrl(s.url)})));

        } catch (e: any) {
            if (e.message === 'SERVER_WARMING') {
                setError('Our server is starting up. Please wait a moment and try again.');
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
        <div>
            <div className="text-center">
                <h1 className="text-5xl font-bold">Trusty Fact-Checker</h1>
                <p className="text-2xl mt-4 text-base-content/70">Get a quick read on claims and news stories.</p>
            </div>

            <div className="max-w-3xl mx-auto mt-12">
                <div className="form-control">
                    <div className="join">
                        <input
                            type="text"
                            className="input input-bordered input-lg join-item w-full text-lg"
                            placeholder="Enter a claim, e.g., 'Does vitamin C prevent colds?'"
                            value={claim}
                            onChange={(e) => setClaim(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAnalysis()}
                            disabled={isLoading}
                        />
                        <button className="btn btn-primary btn-lg join-item" onClick={handleAnalysis} disabled={isLoading || !claim}>
                            {isLoading ? <span className="loading loading-spinner"></span> : <Search size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-12 max-w-4xl mx-auto">
                {isLoading && <LoadingSpinner message="Fact-checking..." />}
                {error && <div className="alert alert-error"><AlertCircle /><span>{error}</span></div>}

                {(summary || sources.length > 0) && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        {summary && (
                             <div className="card bg-base-200 shadow-xl">
                                <div className="card-body prose prose-lg max-w-none">
                                    <h2 className="card-title text-3xl">Summary</h2>
                                    <RenderedSummary summary={summary} sources={sources} />
                                </div>
                            </div>
                        )}

                        {sources.length > 0 && (
                            <div className="card bg-base-100 shadow-xl border border-base-300">
                                <div className="card-body">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                                        <h2 className="card-title text-3xl">Sources Found</h2>
                                        <div className="form-control w-full sm:w-auto">
                                            <label htmlFor="credibility-sort" className="label hidden sm:block">
                                                <span className="label-text font-semibold">Sort by Credibility</span>
                                            </label>
                                            <select
                                                id="credibility-sort"
                                                className="select select-bordered"
                                                value={sortOrder}
                                                onChange={(e) => setSortOrder(e.target.value as 'default' | 'high-to-low' | 'low-to-high')}
                                                aria-label="Sort sources by credibility"
                                            >
                                                <option value="default">Default Order</option>
                                                <option value="high-to-low">High to Low</option>
                                                <option value="low-to-high">Low to High</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {sortedSources.map((source) => (
                                            <div key={source.url} id={`source-${source.originalIndex}`} className={getCredibilityClass(source.credibility)}>
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="flex-grow">
                                                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="link link-primary font-semibold text-lg" title={source.url}>{source.title}</a>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <CredibilityBadge credibility={source.credibility} />
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-base-content/80">{source.explanation}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default FactCheckerPage;

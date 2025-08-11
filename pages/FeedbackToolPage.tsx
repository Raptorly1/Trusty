
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, Edit, AlertCircle, Sparkles } from 'lucide-react';
import { getFeedbackForText } from '../services/geminiService';
import { FeedbackResult, Annotation, AnnotationType } from '../types';
import FileUpload from '../components/common/FileUpload';
import LoadingSpinner from '../components/common/LoadingSpinner';
// NOTE: A full implementation of react-konva for hand-drawn annotations is very complex
// and would exceed the scope of a single file generation. This component provides the
// structure and logic, with a simplified CSS-based highlighting approach as a stand-in.

const getAnnotationColor = (type: AnnotationType) => {
    switch (type) {
        case AnnotationType.CLARITY: return 'bg-yellow-200/70 border-yellow-400';
        case AnnotationType.LOGIC: return 'bg-blue-200/70 border-blue-400';
        case AnnotationType.EVIDENCE: return 'bg-green-200/70 border-green-400';
        case AnnotationType.TONE: return 'bg-purple-200/70 border-purple-400';
        case AnnotationType.AI_WARNING: return 'bg-red-200/70 border-red-400';
        case AnnotationType.FACT_CLAIM: return 'bg-indigo-200/70 border-indigo-400';
        default: return 'bg-slate-200/70 border-slate-400';
    }
}

const AnnotatedTextDisplay: React.FC<{ text: string, annotations: Annotation[] }> = ({ text, annotations }) => {
    if (annotations.length === 0) {
        return <p>{text}</p>;
    }

    // This is a simplified version. A real implementation would need a more robust algorithm.
    const sortedAnnotations = [...annotations].sort((a, b) => text.indexOf(a.snippet) - text.indexOf(b.snippet));

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedAnnotations.forEach((annotation, i) => {
        const startIndex = text.indexOf(annotation.snippet);
        if (startIndex === -1) return;

        if (startIndex > lastIndex) {
            parts.push(text.substring(lastIndex, startIndex));
        }

        parts.push(
            <span key={i} className={`tooltip rounded p-1 border-b-4 ${getAnnotationColor(annotation.type)}`} data-tip={`${annotation.type}: ${annotation.feedback} ${annotation.suggestion ? `Suggestion: ${annotation.suggestion}` : ''}`}>
                {annotation.snippet}
            </span>
        );

        lastIndex = startIndex + annotation.snippet.length;
    });

    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return <div className="prose prose-lg max-w-none leading-loose">{parts}</div>;
};

const FeedbackToolPage: React.FC = () => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<FeedbackResult | null>(null);

    const handleAnalysis = useCallback(async () => {
        if (!text.trim()) {
            setError('Please enter some text for feedback.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const feedbackResult = await getFeedbackForText(text);
            setResult(feedbackResult);
        } catch (e: any) {
            if (e.message === 'SERVER_WARMING') {
                setError('Our server is starting up. Please wait a moment and try again.');
            } else if (e.message === 'SERVER_ERROR') {
                setError('Our server is temporarily unavailable. Please try again in a few minutes.');
            } else {
                setError(`An error occurred while getting feedback: ${e.message}`);
            }
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [text]);

    const handleFileUpload = (content: string) => {
        setText(content);
    };

    return (
        <div>
            <div className="text-center">
                <h1 className="text-5xl font-bold">Content Feedback Tool</h1>
                <p className="text-2xl mt-4 text-base-content/70">Get instant, helpful feedback on your writing.</p>
            </div>

            <div className="max-w-4xl mx-auto mt-12">
                 <textarea
                    className="textarea textarea-bordered textarea-lg w-full h-64 text-lg"
                    placeholder="Paste your essay, email, or article here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isLoading}
                ></textarea>
                <div className="flex items-center justify-between mt-4">
                    <p className="text-base-content/70">{text.length} characters</p>
                    <button className="btn btn-primary btn-lg" onClick={handleAnalysis} disabled={isLoading || !text}>
                        {isLoading ? <span className="loading loading-spinner"></span> : <span><Sparkles className="inline-block mr-2" /> Get Feedback</span>}
                    </button>
                </div>
                <div className="divider text-xl">OR</div>
                <FileUpload onFileUpload={handleFileUpload} acceptedTypes={['text/plain']} prompt="Upload a text file" />
            </div>
            
            <div className="mt-12 max-w-6xl mx-auto">
                {isLoading && <LoadingSpinner message="Getting feedback..." />}
                {error && <div className="alert alert-error"><AlertCircle /><span>{error}</span></div>}

                {result && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 card bg-base-100 shadow-lg border border-base-300">
                                <div className="card-body p-8">
                                    <h2 className="card-title text-3xl">Your Annotated Text</h2>
                                    <div className="mt-4 p-4 rounded-box bg-base-200">
                                       <AnnotatedTextDisplay text={text} annotations={result.annotations} />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="card bg-green-100/50 shadow">
                                    <div className="card-body">
                                        <h3 className="card-title text-2xl"><Check /> Strengths</h3>
                                        <p className="text-lg">{result.summary.strengths}</p>
                                    </div>
                                </div>
                                <div className="card bg-amber-100/50 shadow">
                                    <div className="card-body">
                                        <h3 className="card-title text-2xl"><Edit /> Areas for Improvement</h3>
                                        <p className="text-lg">{result.summary.improvements}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default FeedbackToolPage;

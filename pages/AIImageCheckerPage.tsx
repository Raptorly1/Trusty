import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Bot, Sparkles } from 'lucide-react';
import { analyzeImageForAI } from '../services/geminiService';
import { AIImageAnalysisResult } from '../types';
import FileUpload from '../components/common/FileUpload';
import LoadingSpinner from '../components/common/LoadingSpinner';

// This component is a stand-in for a complex react-konva implementation
const AnnotatedImage: React.FC<{ src: string; result: AIImageAnalysisResult }> = ({ src, result }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (containerRef.current) {
            setDimensions({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight
            });
        }
    }, [result]); // Recalculate on new result

    return (
        <div ref={containerRef} className="relative w-full max-w-3xl mx-auto">
            <img src={src} alt="Analyzed" className="w-full h-auto rounded-lg shadow-lg" />
            {result.anomalies.map((anomaly, index) => {
                const { x, y, width, height } = anomaly.box;
                return (
                    <Tippy
                        key={`${x}-${y}-${width}-${height}-${anomaly.reason}`}
                        content={<span className="text-sm font-medium">{anomaly.reason}</span>}
                        placement="top"
                        arrow={true}
                        animation="shift-away"
                        theme="light"
                        delay={[100, 0]}
                        maxWidth={300}
                    >
                        <div
                            className="absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white"
                            style={{
                                left: `${(x + width/2) * dimensions.width - 12}px`,
                                top: `${(y + height/2) * dimensions.height - 12}px`,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                cursor: 'pointer',
                            }}
                        />
                    </Tippy>
                );
            })}
        </div>
    );
};


const AIImageCheckerPage: React.FC = () => {
    const [imageData, setImageData] = useState<{ b64: string; mime: string, name: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AIImageAnalysisResult | null>(null);

    const handleAnalysis = useCallback(async () => {
        if (!imageData) {
            setError('Please upload an image to analyze.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
                const analysisResult = await analyzeImageForAI(imageData.b64, imageData.mime);
                setResult(analysisResult);
            } catch (e: any) {
                // Friendly Trusty-powered error messaging
                if (e.message === 'SERVER_WARMING') {
                    setError('Our image analysis service is warming up. Please wait a moment and try again.');
                } else if (e.message === 'SERVER_ERROR' || e.message?.includes('503')) {
                    setError('Sorry, our image analysis service is temporarily busy. Please try again.');
                } else {
                    setError('Sorry, something went wrong while analyzing your image. Please try again soon.');
                }
                // Optionally log technical details for devs only
                if (process.env.NODE_ENV === 'development') {
                    console.error(e);
                }
        } finally {
            setIsLoading(false);
        }
    }, [imageData]);

    const handleFileUpload = (b64Content: string, fileName: string) => {
        const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
        setImageData({ b64: b64Content, mime: mimeType, name: fileName });
        setResult(null); // Clear previous results
    };

    const imageSrc = imageData ? `data:${imageData.mime};base64,${imageData.b64}` : '';

    return (
        <div>
            <div className="text-center">
                <h1 className="text-5xl font-bold">Trusty Image Checker</h1>
                <p className="text-2xl mt-4 text-base-content/70">Check if an image was created by AI.</p>
            </div>

            <div className="max-w-2xl mx-auto mt-12">
                <FileUpload onFileUpload={handleFileUpload} acceptedTypes={['image/png', 'image/jpeg']} prompt="Upload an image file" />

                {imageData && (
                    <div className="mt-8 text-center">
                        <img src={imageSrc} alt="Uploaded for analysis" className="max-w-sm mx-auto rounded-lg shadow-lg" />
                        <p className="mt-2 text-lg">{imageData.name}</p>
                        <button className="btn btn-primary btn-lg mt-4" onClick={handleAnalysis} disabled={isLoading}>
                             {isLoading ? <span className="loading loading-spinner"></span> : <span><Sparkles className="inline-block mr-2" /> Analyze Image</span>}
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-12 max-w-5xl mx-auto">
                {isLoading && <LoadingSpinner message="Analyzing image..." />}
                {error && (
                    <div className="alert alert-error shadow-lg bg-red-50 border border-red-200 flex items-center gap-3 p-4">
                        <AlertCircle className="w-6 h-6 text-error" />
                        <span className="text-base text-error font-medium">{error}</span>
                    </div>
                )}

                {result && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="text-center mb-8">
                             <div className="stat bg-base-200 rounded-box max-w-sm mx-auto">
                                <div className="stat-figure text-secondary"><Bot size={36}/></div>
                                <div className="stat-title text-xl">AI Likelihood</div>
                                <div className="stat-value text-5xl">{result.likelihood}%</div>
                                <div className="stat-desc text-lg">{result.isLikelyAI ? "Likely AI-generated" : "Likely Human-made"}</div>
                            </div>
                        </div>

                        <AnnotatedImage src={imageSrc} result={result} />

                        {result.anomalies.length > 0 && (
                            <div className="card bg-base-200 shadow-xl mt-8 max-w-3xl mx-auto">
                                <div className="card-body">
                                    <h3 className="card-title text-2xl">Identified Anomalies</h3>
                                    <ul className="list-disc list-inside space-y-2 text-lg">
                                        {result.anomalies.map((a) => (
                                            <li key={`${a.box.x}-${a.box.y}-${a.box.width}-${a.box.height}-${a.reason}`}>
                                                {a.reason}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                     </motion.div>
                )}
            </div>
        </div>
    );
};

export default AIImageCheckerPage;

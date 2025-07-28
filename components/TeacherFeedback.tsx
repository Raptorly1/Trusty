import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BookOpen, Feather, ZapIcon } from './Icons';
import { AnnotatedTextEditor } from './ImprovedAnnotatedTextEditor';
import { AnnotationsSidebar } from './AnnotationsSidebar';
import { ResultsDisplay } from './ResultsDisplay';
import { FileUpload } from './FileUpload';
import { AnnotationStatus } from './AnnotationStatus';
import OverviewCard from './OverviewCard';
import SmartAnalysisPanel from './SmartAnalysisPanel';
import ActionToolbar from './ActionToolbar';
import { CardSkeleton, AnnotationSkeleton } from './LoadingSkeleton';
import { Annotation, TeacherFeedbackState } from '../types/teacherFeedbackTypes';
import { annotationService, detectAIInText } from '../services/annotationService';
import { smartAutoAnnotationService } from '../services/smartAutoAnnotationService';
import { getFactCheck } from '../services/factCheckService';
import { FactCheckResult } from '../types/factCheckTypes';

interface TeacherFeedbackProps {
  onBack: () => void;
}

export const TeacherFeedback: React.FC<TeacherFeedbackProps> = ({ onBack }) => {
  const [state, setState] = useState<TeacherFeedbackState>({
    text: '',
    annotations: [],
    aiDetection: null,
    selectedRange: null,
    activeAnnotationId: null
  });

  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isGeneratingAnnotations, setIsGeneratingAnnotations] = useState(false);
  const [isFactChecking, setIsFactChecking] = useState(false);
  const [factCheckResult, setFactCheckResult] = useState<FactCheckResult | null>(null);
  const [factCheckError, setFactCheckError] = useState<string | null>(null);

  // Generate a text ID for storing annotations
  const textId = useMemo(() => {
    return state.text ? `text_${state.text.slice(0, 50).replace(/\s+/g, '_')}` : 'empty';
  }, [state.text]);

  // Generate automatic annotations when text changes
  useEffect(() => {
    const generateAnnotations = async () => {
      if (state.text) {
        setIsGeneratingAnnotations(true);
        try {
          // Generate helpful annotations for seniors with smart filtering
          const autoAnnotations = await smartAutoAnnotationService.generateAutoAnnotations(state.text);
          setState(prev => ({ ...prev, annotations: autoAnnotations }));
          
          // Save generated annotations
          if (autoAnnotations.length > 0) {
            await annotationService.saveAnnotations(textId, autoAnnotations);
          }
        } catch (error) {
          console.error('Failed to generate annotations:', error);
        } finally {
          setIsGeneratingAnnotations(false);
        }
      } else {
        setState(prev => ({ ...prev, annotations: [] }));
      }
    };

    // Debounce annotation generation
    const debounceTimer = setTimeout(generateAnnotations, 1500);
    return () => clearTimeout(debounceTimer);
  }, [textId, state.text]);

  // AI Detection with debouncing
  useEffect(() => {
    if (!state.text.trim()) {
      setState(prev => ({ ...prev, aiDetection: null }));
      return;
    }

    const debounceTimer = setTimeout(async () => {
      setIsLoadingAI(true);
      try {
        const detection = await detectAIInText(state.text);
        setState(prev => ({
          ...prev,
          aiDetection: {
            ...detection,
            last_updated: Date.now()
          }
        }));
      } catch (error) {
        console.error('AI detection failed:', error);
        setState(prev => ({ ...prev, aiDetection: null }));
      } finally {
        setIsLoadingAI(false);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(debounceTimer);
  }, [state.text]);

  const handleTextChange = useCallback((newText: string) => {
    setState(prev => ({
      ...prev,
      text: newText,
      selectedRange: null,
      activeAnnotationId: null
    }));
    setFactCheckResult(null);
    setFactCheckError(null);
  }, []);

  const handleRegenerateAnnotations = useCallback(async () => {
    if (!state.text) return;
    
    setIsGeneratingAnnotations(true);
    try {
      const autoAnnotations = await smartAutoAnnotationService.generateAutoAnnotations(state.text);
      setState(prev => ({ ...prev, annotations: autoAnnotations, activeAnnotationId: null }));
      
      if (autoAnnotations.length > 0) {
        await annotationService.saveAnnotations(textId, autoAnnotations);
      }
    } catch (error) {
      console.error('Failed to regenerate annotations:', error);
    } finally {
      setIsGeneratingAnnotations(false);
    }
  }, [state.text, textId]);

  const handleDeleteAnnotation = useCallback(async (annotationId: string) => {
    const updatedAnnotations = state.annotations.filter(a => a.id !== annotationId);
    setState(prev => ({ 
      ...prev, 
      annotations: updatedAnnotations,
      activeAnnotationId: null
    }));
    if (state.text) {
      try {
        await annotationService.deleteAnnotation(textId, annotationId);
      } catch (error) {
        console.error('Failed to delete annotation:', error);
      }
    }
  }, [state.annotations, state.text, textId]);

  const handleAnnotationClick = useCallback((annotation: Annotation) => {
    setState(prev => ({ ...prev, activeAnnotationId: annotation.id }));
  }, []);

  const handleFactCheck = useCallback(async () => {
    if (!state.selectedRange) return;

    setIsFactChecking(true);
    setFactCheckError(null);
    setFactCheckResult(null);

    try {
      const result = await getFactCheck(state.text, state.selectedRange.text);
      setFactCheckResult(result);
    } catch (error) {
      console.error('Fact-check failed:', error);
      setFactCheckError('Failed to fact-check the selected text. Please try again.');
    } finally {
      setIsFactChecking(false);
    }
  }, [state.text, state.selectedRange]);

  const handleClearAllAnnotations = useCallback(async () => {
    if (state.annotations.length === 0) return;
    
    const confirmed = window.confirm('Are you sure you want to clear all annotations? This action cannot be undone.');
    if (!confirmed) return;
    
    setState(prev => ({ ...prev, annotations: [], activeAnnotationId: null }));
    
    if (state.text) {
      try {
        await annotationService.clearAllAnnotations(textId);
      } catch (error) {
        console.error('Failed to clear annotations:', error);
      }
    }
  }, [state.annotations.length, state.text, textId]);

  const handleClearText = useCallback(() => {
    if (!state.text) return;
    
    const confirmed = window.confirm('Clear all text and annotations? This action cannot be undone.');
    if (!confirmed) return;
    
    setState({
      text: '',
      annotations: [],
      aiDetection: null,
      selectedRange: null,
      activeAnnotationId: null
    });
    setFactCheckResult(null);
    setFactCheckError(null);
  }, [state.text]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Action Toolbar */}
      <ActionToolbar
        onBack={onBack}
        onRegenerate={handleRegenerateAnnotations}
        onClearAll={handleClearAllAnnotations}
        onClearText={handleClearText}
        isGenerating={isGeneratingAnnotations}
        hasText={!!state.text.trim()}
        hasAnnotations={state.annotations.length > 0}
        disabled={isLoadingAI || isFactChecking}
      />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Feather className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trusty's Text Analysis</h1>
              <p className="text-gray-600 mt-1">
                Analyze text for clarity, comprehension, and potential issues for seniors
              </p>
            </div>
          </div>
          
          {/* Status Summary */}
          {state.text && (
            <div className="mt-4 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Annotations:</span>
                <span className="font-semibold text-blue-600">{state.annotations.length}</span>
              </div>
              {state.aiDetection && (
                <div className="flex items-center gap-2">
                  <ZapIcon className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-600">AI Likelihood:</span>
                  <span className="font-semibold text-yellow-600">{state.aiDetection.likelihood_score}%</span>
                </div>
              )}
              {isGeneratingAnnotations && (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Generating insights...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Text Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload */}
            {!state.text && (
              <FileUpload
                onTextLoaded={handleTextChange}
                disabled={isLoadingAI || isFactChecking}
              />
            )}
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900">Text Analysis</h2>
                {state.selectedRange && (
                  <button
                    onClick={handleFactCheck}
                    disabled={isFactChecking}
                    className="ml-auto px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-1"
                  >
                    {isFactChecking ? 'Checking...' : 'Fact-Check Selection'}
                  </button>
                )}
              </div>
              <AnnotatedTextEditor
                text={state.text}
                annotations={state.annotations}
                activeAnnotationId={state.activeAnnotationId}
                onTextChange={handleTextChange}
                onAnnotationChange={(annotations: Annotation[]) => {
                  setState(prev => ({ ...prev, annotations }));
                }}
                onAnnotationSelect={(id: string | null) => setState(prev => ({ ...prev, activeAnnotationId: id }))}
                onAnnotationEdit={(id: string, text: string, comment: string) => {
                  const updatedAnnotations = state.annotations.map(ann =>
                    ann.id === id ? { ...ann, text, comment } : ann
                  );
                  setState(prev => ({ ...prev, annotations: updatedAnnotations }));
                }}
                onAnnotationDelete={handleDeleteAnnotation}
                placeholder="Paste or upload text here for analysis. Select any text to add highlights, comments, tags, or fact-check it."
              />
            </div>

            {/* Auto-Annotation Status */}
            <AnnotationStatus
              isGenerating={isGeneratingAnnotations}
              annotationCount={state.annotations.length}
              onRegenerate={handleRegenerateAnnotations}
              disabled={!state.text.trim()}
            />

            {/* Fact-Check Results */}
            {factCheckError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold">Fact-Check Error</p>
                <p className="text-red-700">{factCheckError}</p>
              </div>
            )}

            {factCheckResult && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Fact-Check Results</h3>
                <ResultsDisplay result={factCheckResult} />
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Overview Card - Combined Text Statistics and AI Detection */}
            {!state.text ? (
              <CardSkeleton hasHeader={true} hasStats={true} />
            ) : (
              <OverviewCard
                text={state.text}
                aiLikelihood={state.aiDetection?.likelihood_score || null}
                isAnalyzing={isLoadingAI}
                onAnalyze={() => {
                  if (state.text.trim()) {
                    setIsLoadingAI(true);
                    detectAIInText(state.text)
                      .then(detection => {
                        setState(prev => ({
                          ...prev,
                          aiDetection: {
                            ...detection,
                            last_updated: Date.now()
                          }
                        }));
                      })
                      .catch(error => {
                        console.error('AI detection failed:', error);
                        setState(prev => ({ ...prev, aiDetection: null }));
                      })
                      .finally(() => setIsLoadingAI(false));
                  }
                }}
              />
            )}

            {/* Smart Analysis Panel */}
            <SmartAnalysisPanel
              text={state.text}
              annotations={state.annotations}
              aiDetection={state.aiDetection}
            />

            {/* Annotations Sidebar */}
            {isGeneratingAnnotations ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Annotations</h3>
                <AnnotationSkeleton count={3} />
              </div>
            ) : (
              <AnnotationsSidebar
                annotations={state.annotations}
                onDeleteAnnotation={handleDeleteAnnotation}
                onAnnotationClick={handleAnnotationClick}
                activeAnnotationId={state.activeAnnotationId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

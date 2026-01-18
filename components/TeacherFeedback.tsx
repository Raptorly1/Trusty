import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft, BookOpen, Feather, ZapIcon } from './Icons';
import { AnnotatedTextEditor } from './AnnotatedTextEditor';
import { AnnotationControls } from './AnnotationControls';
import { AnnotationsSidebar } from './AnnotationsSidebar';
import { AIDetectionWidget } from './AIDetectionWidget';
import { ResultsDisplay } from './ResultsDisplay';
import { FileUpload } from './FileUpload';
import { TextStatsWidget } from './TextStatsWidget';
import { Annotation, TeacherFeedbackState } from '../types/teacherFeedbackTypes';
import { annotationService, detectAIInText } from '../services/annotationService';
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
    showAIScore: true,
    activeAnnotationId: null
  });

  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isFactChecking, setIsFactChecking] = useState(false);
  const [factCheckResult, setFactCheckResult] = useState<FactCheckResult | null>(null);
  const [factCheckError, setFactCheckError] = useState<string | null>(null);

  // Generate a text ID for storing annotations
  const textId = useMemo(() => {
    return state.text ? `text_${state.text.slice(0, 50).replace(/\s+/g, '_')}` : 'empty';
  }, [state.text]);

  // Load annotations when text changes
  useEffect(() => {
    const loadAnnotations = async () => {
      if (state.text) {
        try {
          const savedAnnotations = await annotationService.loadAnnotations(textId);
          setState(prev => ({ ...prev, annotations: savedAnnotations }));
        } catch (error) {
          console.error('Failed to load annotations:', error);
        }
      }
    };
    loadAnnotations();
  }, [textId, state.text]);

  // Save annotations when they change
  const saveAnnotations = useCallback(async (annotations: Annotation[]) => {
    if (state.text && annotations.length > 0) {
      try {
        await annotationService.saveAnnotations(textId, annotations);
      } catch (error) {
        console.error('Failed to save annotations:', error);
      }
    }
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

  const handleSelectionChange = useCallback((selection: { start: number; end: number; text: string } | null) => {
    setState(prev => ({ ...prev, selectedRange: selection, activeAnnotationId: null }));
  }, []);

  const generateAnnotationId = () => `annotation_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

  const handleAddHighlight = useCallback(async (color: string) => {
    if (!state.selectedRange) return;

    const newAnnotation: Annotation = {
      id: generateAnnotationId(),
      start: state.selectedRange.start,
      end: state.selectedRange.end,
      text: state.selectedRange.text,
      type: 'highlight',
      color: color as any,
      timestamp: Date.now()
    };

    const updatedAnnotations = [...state.annotations, newAnnotation];
    setState(prev => ({ 
      ...prev, 
      annotations: updatedAnnotations,
      selectedRange: null,
      activeAnnotationId: newAnnotation.id
    }));
    await saveAnnotations(updatedAnnotations);
  }, [state.selectedRange, state.annotations, saveAnnotations]);

  const handleAddComment = useCallback(async (comment: string) => {
    if (!state.selectedRange) return;

    const newAnnotation: Annotation = {
      id: generateAnnotationId(),
      start: state.selectedRange.start,
      end: state.selectedRange.end,
      text: state.selectedRange.text,
      type: 'comment',
      comment,
      timestamp: Date.now()
    };

    const updatedAnnotations = [...state.annotations, newAnnotation];
    setState(prev => ({ 
      ...prev, 
      annotations: updatedAnnotations,
      selectedRange: null,
      activeAnnotationId: newAnnotation.id
    }));
    await saveAnnotations(updatedAnnotations);
  }, [state.selectedRange, state.annotations, saveAnnotations]);

  const handleAddTag = useCallback(async (tags: string[]) => {
    if (!state.selectedRange) return;

    const newAnnotation: Annotation = {
      id: generateAnnotationId(),
      start: state.selectedRange.start,
      end: state.selectedRange.end,
      text: state.selectedRange.text,
      type: 'tag',
      tags,
      timestamp: Date.now()
    };

    const updatedAnnotations = [...state.annotations, newAnnotation];
    setState(prev => ({ 
      ...prev, 
      annotations: updatedAnnotations,
      selectedRange: null,
      activeAnnotationId: newAnnotation.id
    }));
    await saveAnnotations(updatedAnnotations);
  }, [state.selectedRange, state.annotations, saveAnnotations]);

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

  const handleToggleAIScore = useCallback(() => {
    setState(prev => ({ ...prev, showAIScore: !prev.showAIScore }));
  }, []);

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
      showAIScore: true,
      activeAnnotationId: null
    });
    setFactCheckResult(null);
    setFactCheckError(null);
  }, [state.text]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack} 
                className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold transition-colors"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </button>
              <div className="flex items-center gap-2">
                <Feather className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Trusty's Feedback</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                {state.annotations.length} annotations
              </div>
              {state.aiDetection && (
                <div className="flex items-center gap-1 text-sm">
                  <ZapIcon className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-600">AI: {state.aiDetection.likelihood_score}%</span>
                </div>
              )}
              {state.text && (
                <div className="flex items-center gap-2">
                  {state.annotations.length > 0 && (
                    <button
                      onClick={handleClearAllAnnotations}
                      className="text-xs text-red-600 hover:text-red-800 px-2 py-1 border border-red-300 rounded hover:bg-red-50 transition-colors"
                    >
                      Clear Annotations
                    </button>
                  )}
                  <button
                    onClick={handleClearText}
                    className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>
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
                onTextChange={handleTextChange}
                onSelectionChange={handleSelectionChange}
                onAnnotationClick={handleAnnotationClick}
                placeholder="Paste or upload text here for analysis. Select any text to add highlights, comments, tags, or fact-check it."
              />
            </div>

            {/* Annotation Controls */}
            <AnnotationControls
              selectedRange={state.selectedRange}
              onAddHighlight={handleAddHighlight}
              onAddComment={handleAddComment}
              onAddTag={handleAddTag}
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
            {/* Text Statistics */}
            <TextStatsWidget
              text={state.text}
              annotations={state.annotations}
            />
            
            {/* AI Detection Widget */}
            <AIDetectionWidget
              result={state.aiDetection}
              isVisible={state.showAIScore}
              onToggleVisibility={handleToggleAIScore}
              isLoading={isLoadingAI}
            />

            {/* Annotations Sidebar */}
            <AnnotationsSidebar
              annotations={state.annotations}
              onDeleteAnnotation={handleDeleteAnnotation}
              onAnnotationClick={handleAnnotationClick}
              activeAnnotationId={state.activeAnnotationId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

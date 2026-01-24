import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BookOpen, Feather, ZapIcon, ChevronLeft, ChevronRight, Filter, EyeIcon, EyeSlashIcon } from './Icons';
import { AnnotatedTextEditor } from './ImprovedAnnotatedTextEditor';
import { ResultsDisplay } from './ResultsDisplay';
import { FileUpload } from './FileUpload';
import OverviewCard from './OverviewCard';
import SmartAnalysisPanel from './SmartAnalysisPanel';
import { CardSkeleton, AnnotationSkeleton } from './LoadingSkeleton';
import { Annotation, TeacherFeedbackState } from '../types/teacherFeedbackTypes';
import { annotationService, detectAIInText } from '../services/annotationService';
import { smartAutoAnnotationService } from '../services/smartAutoAnnotationService';
import { getFactCheck } from '../services/factCheckService';
import { FactCheckResult } from '../types/factCheckTypes';

interface ImprovedTeacherFeedbackProps {
  onBack: () => void;
}

type TabType = 'text-analysis' | 'smart-analysis' | 'fact-check' | 'sources';
type AnnotationFilter = 'all' | 'ai-warning' | 'complexity' | 'factual' | 'general';

export const ImprovedTeacherFeedback: React.FC<ImprovedTeacherFeedbackProps> = ({ onBack }) => {
  const [state, setState] = useState<TeacherFeedbackState>({
    text: '',
    annotations: [],
    aiDetection: null,
    selectedRange: null,
    activeAnnotationId: null
  });

  // UI State
  const [activeTab, setActiveTab] = useState<TabType>('text-analysis');
  const [annotationFilter, setAnnotationFilter] = useState<AnnotationFilter>('all');
  const [currentAnnotationIndex, setCurrentAnnotationIndex] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Loading states
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isGeneratingAnnotations, setIsGeneratingAnnotations] = useState(false);
  const [isFactChecking, setIsFactChecking] = useState(false);
  const [factCheckResult, setFactCheckResult] = useState<FactCheckResult | null>(null);
  const [factCheckError, setFactCheckError] = useState<string | null>(null);

  // Generate a text ID for storing annotations
  const textId = useMemo(() => {
    return state.text ? `text_${state.text.slice(0, 50).replace(/\s+/g, '_')}` : 'empty';
  }, [state.text]);

  // Filter annotations based on current filter
  const filteredAnnotations = useMemo(() => {
    if (annotationFilter === 'all') return state.annotations;
    
    return state.annotations.filter(annotation => {
      // Determine annotation category based on comment content
      const comment = annotation.comment?.toLowerCase() || '';
      
      switch (annotationFilter) {
        case 'ai-warning':
          return comment.includes('ai likelihood') || comment.includes('🤖');
        case 'complexity':
          return comment.includes('complex term') || comment.includes('📚') || comment.includes('📝');
        case 'factual':
          return comment.includes('verify') || comment.includes('📊') || comment.includes('📅') || comment.includes('🔍');
        case 'general':
          return !comment.includes('🤖') && !comment.includes('📚') && !comment.includes('📝') && 
                 !comment.includes('📊') && !comment.includes('📅') && !comment.includes('🔍');
        default:
          return true;
      }
    });
  }, [state.annotations, annotationFilter]);

  // Generate automatic annotations when text changes
  useEffect(() => {
    const generateAnnotations = async () => {
      if (state.text) {
        setIsGeneratingAnnotations(true);
        try {
          const autoAnnotations = await smartAutoAnnotationService.generateAutoAnnotations(state.text);
          setState(prev => ({ ...prev, annotations: autoAnnotations }));
          
          if (autoAnnotations.length > 0) {
            await annotationService.saveAnnotations(textId, autoAnnotations);
          }
        } catch (error) {
          console.error('Failed to generate smart annotations:', error);
        } finally {
          setIsGeneratingAnnotations(false);
        }
      }
    };

    if (state.text.trim()) {
      generateAnnotations();
    }
  }, [state.text, textId]);

  const handleTextChange = useCallback((newText: string) => {
    setState(prev => ({
      ...prev,
      text: newText,
      selectedRange: null,
      activeAnnotationId: null
    }));
    setFactCheckResult(null);
    setFactCheckError(null);
    setCurrentAnnotationIndex(0);
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
      setCurrentAnnotationIndex(0);
    } catch (error) {
      console.error('Failed to regenerate annotations:', error);
    } finally {
      setIsGeneratingAnnotations(false);
    }
  }, [state.text, textId]);

  const handleClearAllAnnotations = useCallback(async () => {
    setState(prev => ({ 
      ...prev, 
      annotations: [], 
      activeAnnotationId: null 
    }));
    
    if (state.text) {
      try {
        await annotationService.clearAllAnnotations(textId);
      } catch (error) {
        console.error('Failed to clear annotations:', error);
      }
    }
    setCurrentAnnotationIndex(0);
  }, [state.text, textId]);

  const handleClearText = useCallback(() => {
    setState({
      text: '',
      annotations: [],
      aiDetection: null,
      selectedRange: null,
      activeAnnotationId: null
    });
    setFactCheckResult(null);
    setFactCheckError(null);
    setCurrentAnnotationIndex(0);
  }, []);

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
    
    // Find the index in filtered annotations for navigation
    const index = filteredAnnotations.findIndex(a => a.id === annotation.id);
    if (index !== -1) {
      setCurrentAnnotationIndex(index);
    }
  }, [filteredAnnotations]);

  const handleFactCheck = useCallback(async () => {
    if (!state.selectedRange) return;

    setIsFactChecking(true);
    setFactCheckError(null);
    
    try {
      const selectedText = state.text.substring(
        state.selectedRange.start, 
        state.selectedRange.end
      );
      
      const result = await getFactCheck(state.text, selectedText);
      setFactCheckResult(result);
      setActiveTab('fact-check');
    } catch (error) {
      console.error('Fact-check failed:', error);
      setFactCheckError(error instanceof Error ? error.message : 'Fact-check failed');
    } finally {
      setIsFactChecking(false);
    }
  }, [state.selectedRange, state.text]);

  // Navigation functions
  const navigateToAnnotation = useCallback((direction: 'prev' | 'next') => {
    if (filteredAnnotations.length === 0) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentAnnotationIndex + 1) % filteredAnnotations.length;
    } else {
      newIndex = currentAnnotationIndex === 0 ? filteredAnnotations.length - 1 : currentAnnotationIndex - 1;
    }
    
    setCurrentAnnotationIndex(newIndex);
    const targetAnnotation = filteredAnnotations[newIndex];
    if (targetAnnotation) {
      setState(prev => ({ ...prev, activeAnnotationId: targetAnnotation.id }));
    }
  }, [filteredAnnotations, currentAnnotationIndex]);

  const getAnnotationColorClass = (comment: string) => {
    const lowerComment = comment.toLowerCase();
    if (lowerComment.includes('🤖') || lowerComment.includes('ai likelihood')) {
      return 'bg-red-100 border-red-300 text-red-800';
    }
    if (lowerComment.includes('📚') || lowerComment.includes('📝')) {
      return 'bg-amber-100 border-amber-300 text-amber-800';
    }
    if (lowerComment.includes('📊') || lowerComment.includes('📅') || lowerComment.includes('🔍')) {
      return 'bg-blue-100 border-blue-300 text-blue-800';
    }
    return 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const tabs = [
    { id: 'text-analysis' as TabType, label: 'Text Analysis', icon: BookOpen },
    { id: 'smart-analysis' as TabType, label: 'Smart Analysis', icon: ZapIcon },
    { id: 'fact-check' as TabType, label: 'Fact-Check', icon: Filter },
    { id: 'sources' as TabType, label: 'Sources', icon: Feather }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header with improved action buttons */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              
              <div className="flex items-center gap-3">
                <Feather className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Trusty's Text Analysis</h1>
                  <p className="text-gray-600 text-sm">
                    Analyze text for clarity, comprehension, and potential issues for seniors
                  </p>
                </div>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="flex items-center gap-3">
              {/* Annotation Navigation */}
              {filteredAnnotations.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 rounded-lg px-3 py-2">
                  <span>{currentAnnotationIndex + 1} of {filteredAnnotations.length}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => navigateToAnnotation('prev')}
                      className="p-1 hover:bg-gray-200 rounded"
                      disabled={filteredAnnotations.length <= 1}
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => navigateToAnnotation('next')}
                      className="p-1 hover:bg-gray-200 rounded"
                      disabled={filteredAnnotations.length <= 1}
                    >
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Filter Dropdown */}
              {state.annotations.length > 0 && (
                <div className="relative">
                  <select
                    value={annotationFilter}
                    onChange={(e) => setAnnotationFilter(e.target.value as AnnotationFilter)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Highlights</option>
                    <option value="ai-warning">🔴 AI-Likely</option>
                    <option value="complexity">🟡 Complex Terms</option>
                    <option value="factual">🔵 Fact-Check</option>
                    <option value="general">⚪ General</option>
                  </select>
                </div>
              )}

              {/* Clear Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleClearAllAnnotations}
                  disabled={state.annotations.length === 0}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Annotations
                </button>
                <button
                  onClick={handleClearText}
                  disabled={!state.text}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear All
                </button>
              </div>

              {/* Primary Regenerate Button */}
              <button
                onClick={handleRegenerateAnnotations}
                disabled={!state.text.trim() || isGeneratingAnnotations}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGeneratingAnnotations && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {isGeneratingAnnotations ? 'Analyzing...' : 'Regenerate Analysis'}
              </button>

              {/* Sidebar Toggle */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
              </button>
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
            </div>
          )}

          {/* Annotation Legend */}
          {state.annotations.length > 0 && (
            <div className="mt-3 flex items-center gap-4 text-xs">
              <span className="text-gray-500">Legend:</span>
              <div className="flex gap-3">
                <div className="flex items-center gap-1" title="AI-generated content detected">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span>AI-Likely</span>
                </div>
                <div className="flex items-center gap-1" title="Complex terms that need clarification">
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  <span>Complex</span>
                </div>
                <div className="flex items-center gap-1" title="Facts that should be verified">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span>Fact-Check</span>
                </div>
                <div className="flex items-center gap-1" title="General notes and comments">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span>General</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className={`grid gap-6 ${sidebarCollapsed ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Main Content Area */}
          <div className={`${sidebarCollapsed ? 'col-span-1' : 'lg:col-span-2'} space-y-6`}>
            {activeTab === 'text-analysis' && (
              <>
                {/* File Upload */}
                {!state.text && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <FileUpload
                      onTextLoaded={handleTextChange}
                      disabled={isLoadingAI || isFactChecking}
                    />
                  </div>
                )}
                
                {/* Text Editor */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-500" />
                        <h2 className="text-lg font-semibold text-gray-900">Text Analysis</h2>
                      </div>
                      {state.selectedRange && (
                        <button
                          onClick={handleFactCheck}
                          disabled={isFactChecking}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 font-medium"
                        >
                          {isFactChecking ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              Checking...
                            </>
                          ) : (
                            'Fact-Check Selection'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <AnnotatedTextEditor
                      text={state.text}
                      annotations={filteredAnnotations}
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
                </div>
              </>
            )}

            {activeTab === 'smart-analysis' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <SmartAnalysisPanel
                  text={state.text}
                  annotations={state.annotations}
                  aiDetection={state.aiDetection}
                />
              </div>
            )}

            {activeTab === 'fact-check' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Fact-Check Results</h2>
                {factCheckError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800 font-semibold">Fact-Check Error</p>
                    <p className="text-red-700">{factCheckError}</p>
                  </div>
                )}
                {factCheckResult ? (
                  <ResultsDisplay result={factCheckResult} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Select text in the editor and click "Fact-Check Selection" to see results here.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'sources' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Sources & References</h2>
                {factCheckResult?.sources && factCheckResult.sources.length > 0 ? (
                  <div className="space-y-4">
                    {factCheckResult.sources.map((source) => (
                      <div key={source.url} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-2">{source.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{source.summary}</p>
                        <div className="flex items-center justify-between">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View Source →
                          </a>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            (() => {
                              switch (source.credibility.rating) {
                                case 'Very High': return 'bg-green-100 text-green-700';
                                case 'High': return 'bg-blue-100 text-blue-700';
                                case 'Medium': return 'bg-yellow-100 text-yellow-700';
                                default: return 'bg-red-100 text-red-700';
                              }
                            })()
                          }`}>
                            {source.credibility.rating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No sources available. Perform a fact-check to see source references.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          {!sidebarCollapsed && (
            <div className="space-y-6">
              {/* Overview Card */}
              {!state.text ? (
                <CardSkeleton hasHeader={true} hasStats={true} />
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                </div>
              )}

              {/* Annotations Sidebar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h3 className="text-lg font-semibold">
                    Annotations ({filteredAnnotations.length})
                  </h3>
                </div>
                <div className="p-6">
                  {isGeneratingAnnotations ? (
                    <AnnotationSkeleton count={3} />
                  ) : (
                    <>
                      {filteredAnnotations.length > 0 ? (
                        <div className="space-y-3">
                          {filteredAnnotations.map((annotation, index) => (
                            <button
                              key={annotation.id}
                              onClick={() => handleAnnotationClick(annotation)}
                              className={`w-full p-3 rounded-lg border cursor-pointer transition-all text-left ${
                                annotation.id === state.activeAnnotationId
                                  ? 'ring-2 ring-blue-500 ' + getAnnotationColorClass(annotation.comment || '')
                                  : 'hover:shadow-sm ' + getAnnotationColorClass(annotation.comment || '')
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className="text-sm font-medium truncate">{annotation.text}</p>
                                  <p className="text-xs mt-1 line-clamp-2">{annotation.comment}</p>
                                </div>
                                <span className="text-xs text-gray-500 flex-shrink-0">
                                  {index + 1}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm">No annotations yet</p>
                          <p className="text-xs mt-1">Add text to see analysis</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

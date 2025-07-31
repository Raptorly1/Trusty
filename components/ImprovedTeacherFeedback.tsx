import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BookOpen, Feather, ZapIcon, ChevronLeft, ChevronRight, Filter, EyeIcon, EyeSlashIcon, CheckCircle, AlertTriangle } from './Icons';
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
        console.log('ImprovedTeacherFeedback: Starting annotation generation for text:', state.text.substring(0, 50));
        setIsGeneratingAnnotations(true);
        try {
          const autoAnnotations = await smartAutoAnnotationService.generateAutoAnnotations(state.text);
          console.log('ImprovedTeacherFeedback: Received annotations:', autoAnnotations);
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
    console.log('ImprovedTeacherFeedback: Text changed to:', newText.substring(0, 50) + '...');
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-inter antialiased">
      {/* Professional Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Section */}
            <div className="flex items-center gap-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="font-medium">Back</span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Feather className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Text Analysis Studio</h1>
                  <p className="text-sm text-slate-600">Professional document analysis and fact-checking</p>
                </div>
              </div>
            </div>

            {/* Action Controls */}
            <div className="flex items-center gap-4">
              {/* Navigation Controls */}
              {filteredAnnotations.length > 0 && (
                <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium text-slate-700">
                    {currentAnnotationIndex + 1} of {filteredAnnotations.length}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => navigateToAnnotation('prev')}
                      className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
                      disabled={filteredAnnotations.length <= 1}
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => navigateToAnnotation('next')}
                      className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
                      disabled={filteredAnnotations.length <= 1}
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Filter Controls */}
              {state.annotations.length > 0 && (
                <select
                  value={annotationFilter}
                  onChange={(e) => setAnnotationFilter(e.target.value as AnnotationFilter)}
                  className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Annotations</option>
                  <option value="ai-warning">AI Detection</option>
                  <option value="complexity">Complexity</option>
                  <option value="factual">Fact-Check</option>
                  <option value="general">General</option>
                </select>
              )}

              {/* Primary Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRegenerateAnnotations}
                  disabled={!state.text.trim() || isGeneratingAnnotations}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  {isGeneratingAnnotations && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  )}
                  {isGeneratingAnnotations ? 'Analyzing...' : 'Regenerate'}
                </button>

                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                  title={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
                >
                  {sidebarCollapsed ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                      ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  } whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm flex items-center gap-2 transition-all duration-200 rounded-t-lg`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid gap-8 ${sidebarCollapsed ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          
          {/* Primary Content */}
          <div className={`${sidebarCollapsed ? 'col-span-1' : 'lg:col-span-2'} space-y-6`}>
            {activeTab === 'text-analysis' && (
              <>
                {/* File Upload Section */}
                {!state.text && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload Document</h3>
                      <p className="text-slate-600">Upload a file or paste text to begin analysis</p>
                    </div>
                    <FileUpload
                      onTextLoaded={handleTextChange}
                      disabled={isLoadingAI || isFactChecking}
                    />
                  </div>
                )}
                
                {/* Text Editor */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900">Document Editor</h2>
                          <p className="text-sm text-slate-600">Select text to add annotations or fact-check</p>
                        </div>
                      </div>
                      {state.selectedRange && (
                        <button
                          onClick={handleFactCheck}
                          disabled={isFactChecking}
                          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 font-medium shadow-sm transition-all duration-200"
                        >
                          {isFactChecking ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              Checking...
                            </>
                          ) : (
                            <>
                              <Filter className="h-4 w-4" />
                              Fact-Check Selection
                            </>
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
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ZapIcon className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Smart Analysis</h2>
                    <p className="text-sm text-slate-600">AI-powered insights and document metrics</p>
                  </div>
                </div>
                <SmartAnalysisPanel
                  text={state.text}
                  annotations={state.annotations}
                  aiDetection={state.aiDetection}
                />
              </div>
            )}

            {activeTab === 'fact-check' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Filter className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Fact-Check Results</h2>
                    <p className="text-sm text-slate-600">Verification and source analysis</p>
                  </div>
                </div>
                {factCheckError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <p className="text-red-800 font-semibold">Fact-Check Error</p>
                    </div>
                    <p className="text-red-700 mt-1">{factCheckError}</p>
                  </div>
                )}
                {factCheckResult ? (
                  <ResultsDisplay result={factCheckResult} />
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Filter className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No Fact-Check Results</h3>
                    <p className="text-slate-600">Select text in the editor and click "Fact-Check Selection" to see results here.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'sources' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Feather className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Sources & References</h2>
                    <p className="text-sm text-slate-600">Credibility assessment and source verification</p>
                  </div>
                </div>
                {factCheckResult?.sources && factCheckResult.sources.length > 0 ? (
                  <div className="space-y-4">
                    {factCheckResult.sources.map((source) => (
                      <div key={source.url} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <h3 className="font-semibold text-slate-900 mb-2">{source.title}</h3>
                        <p className="text-slate-600 text-sm mb-4">{source.summary}</p>
                        <div className="flex items-center justify-between">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                          >
                            View Source
                            <ChevronRight className="h-4 w-4" />
                          </a>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            (() => {
                              switch (source.credibility.rating) {
                                case 'Very High': return 'bg-emerald-100 text-emerald-700';
                                case 'High': return 'bg-blue-100 text-blue-700';
                                case 'Medium': return 'bg-yellow-100 text-yellow-700';
                                default: return 'bg-red-100 text-red-700';
                              }
                            })()
                          }`}>
                            {source.credibility.rating} Credibility
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Feather className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No Sources Available</h3>
                    <p className="text-slate-600">Perform a fact-check to see source references and credibility ratings.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Professional Sidebar */}
          {!sidebarCollapsed && (
            <div className="space-y-6">
              
              {/* Quick Actions Panel */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleClearAllAnnotations}
                    disabled={state.annotations.length === 0}
                    className="w-full px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-slate-200 transition-all"
                  >
                    Clear Annotations
                  </button>
                  <button
                    onClick={handleClearText}
                    disabled={!state.text}
                    className="w-full px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-slate-200 transition-all"
                  >
                    Clear All Text
                  </button>
                </div>
              </div>

              {/* Overview Card */}
              {!state.text ? (
                <CardSkeleton hasHeader={true} hasStats={true} />
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
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

              {/* Annotations Panel */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Annotations
                    </h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {filteredAnnotations.length}
                    </span>
                  </div>
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
                              className={`w-full p-4 rounded-xl border cursor-pointer transition-all text-left hover:shadow-sm ${
                                annotation.id === state.activeAnnotationId
                                  ? 'ring-2 ring-blue-500 border-blue-200 bg-blue-50'
                                  : 'border-slate-200 hover:border-slate-300 ' + getAnnotationColorClass(annotation.comment || '')
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-900 truncate mb-1">
                                    {annotation.text}
                                  </p>
                                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                    {annotation.comment}
                                  </p>
                                </div>
                                <div className="flex-shrink-0 flex flex-col items-center">
                                  <span className="text-xs text-slate-500 font-medium">
                                    #{index + 1}
                                  </span>
                                  {annotation.id === state.activeAnnotationId && (
                                    <CheckCircle className="h-4 w-4 text-blue-600 mt-1" />
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <BookOpen className="h-6 w-6 text-slate-400" />
                          </div>
                          <h4 className="text-sm font-medium text-slate-900 mb-1">No annotations yet</h4>
                          <p className="text-xs text-slate-600">Add text to see analysis</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Analysis Legend */}
              {state.annotations.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Analysis Types</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">AI Detection</p>
                        <p className="text-xs text-slate-600">Content likely generated by AI</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-amber-400 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Complexity</p>
                        <p className="text-xs text-slate-600">Terms needing clarification</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Fact-Check</p>
                        <p className="text-xs text-slate-600">Claims requiring verification</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-slate-400 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">General</p>
                        <p className="text-xs text-slate-600">Notes and comments</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

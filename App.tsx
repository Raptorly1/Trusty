
import React, { useState, useEffect } from 'react';
import { COURSE_MODULES } from './constants';
import Homepage from './components/Homepage';
import CourseModule from './components/CourseModule';
import Quiz from './components/Quiz';
import Certificate from './components/Certificate';
import FactChecker from './components/FactChecker';
import { TeacherFeedback } from './components/TeacherFeedback';

type View = 'home' | 'course' | 'quiz' | 'certificate' | 'ai_checker' | 'teacher_feedback';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [quizScore, setQuizScore] = useState({ score: 0, total: 0 });
  
  useEffect(() => {
    // Scroll to top when view changes
    window.scrollTo(0, 0);
  }, [view, currentModuleIndex]);

  const handleStartCourse = () => {
    setCurrentModuleIndex(0);
    setView('course');
  };

  const handleGoToAIChecker = () => {
    setView('ai_checker');
  };

  const handleGoToTeacherFeedback = () => {
    setView('teacher_feedback');
  };

  const handleNextModule = () => {
    if (currentModuleIndex < COURSE_MODULES.length - 1) {
      setCurrentModuleIndex(prev => prev + 1);
    } else {
      setView('quiz');
    }
  };

  const handleQuizComplete = (score: number, total: number) => {
    setQuizScore({ score, total });
    setView('certificate');
  };

  const handleRestart = () => {
    setCurrentModuleIndex(0);
    setQuizScore({ score: 0, total: 0 });
    setView('home');
  };

  const renderContent = () => {
    switch (view) {
      case 'home':
        return <Homepage onStartCourse={handleStartCourse} onGoToAIChecker={handleGoToAIChecker} onGoToTeacherFeedback={handleGoToTeacherFeedback} />;
      case 'ai_checker':
        return <FactChecker onBack={handleRestart} />;
      case 'teacher_feedback':
        return <TeacherFeedback onBack={handleRestart} />;
      case 'course':
        return (
          <div className="py-12 sm:py-16 lg:py-20">
            <CourseModule
              key={currentModuleIndex}
              module={COURSE_MODULES[currentModuleIndex]}
              onNextModule={handleNextModule}
              isLastModule={currentModuleIndex === COURSE_MODULES.length - 1}
            />
             <div className="text-center mt-8 text-slate-500 font-medium">
                Module {currentModuleIndex + 1} of {COURSE_MODULES.length}
            </div>
          </div>
        );
      case 'quiz':
        return (
          <div className="py-12 sm:py-16 lg:py-20">
            <Quiz onQuizComplete={handleQuizComplete} />
          </div>
        );
      case 'certificate':
        return (
          <div className="py-12 sm:py-16 lg:py-20">
            <Certificate score={quizScore.score} total={quizScore.total} onRestart={handleRestart} />
          </div>
        );
      default:
        return <Homepage onStartCourse={handleStartCourse} onGoToAIChecker={handleGoToAIChecker} onGoToTeacherFeedback={handleGoToTeacherFeedback} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
          {renderContent()}
      </main>
    </div>
  );
};

export default App;
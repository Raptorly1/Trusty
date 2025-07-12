
import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { FINAL_QUIZ_QUESTIONS } from '../constants';
import { ArrowRight, Refresh } from './Icons';

interface QuizProps {
  onQuizComplete: (score: number, total: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ onQuizComplete }) => {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(FINAL_QUIZ_QUESTIONS.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setShowResults(true);
    const score = answers.reduce((acc, answer, index) => {
      return answer === FINAL_QUIZ_QUESTIONS[index].correctAnswerIndex ? acc + 1 : acc;
    }, 0);
    
    // Delay completion to allow user to see results
    setTimeout(() => {
        onQuizComplete(score, FINAL_QUIZ_QUESTIONS.length);
    }, 4000);
  };
  
  const allAnswered = answers.every(answer => answer !== null);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Final Knowledge Check</h2>
        <p className="mt-2 text-lg text-slate-600">Let's see what you've learned!</p>
      </div>

      <div className="space-y-8">
        {FINAL_QUIZ_QUESTIONS.map((q, qIndex) => (
          <div key={qIndex} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <p className="text-xl font-semibold text-slate-800 mb-4">{qIndex + 1}. {q.question}</p>
            <div className="space-y-3">
              {q.options.map((option, oIndex) => {
                const isSelected = answers[qIndex] === oIndex;
                const isCorrect = q.correctAnswerIndex === oIndex;
                
                let buttonClass = 'bg-white border-slate-300 hover:bg-slate-100 hover:border-blue-500';
                if (showResults) {
                  if (isCorrect) {
                     buttonClass = 'bg-emerald-200 border-emerald-400 text-emerald-900 font-bold';
                  } else if (isSelected && !isCorrect) {
                     buttonClass = 'bg-red-200 border-red-400 text-red-900';
                  }
                } else if(isSelected) {
                  buttonClass = 'bg-blue-200 border-blue-400';
                }

                return (
                  <button
                    key={oIndex}
                    onClick={() => handleAnswerSelect(qIndex, oIndex)}
                    disabled={showResults}
                    className={`w-full text-left p-4 rounded-lg border-2 font-medium transition-all ${buttonClass}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
       <div className="mt-10 text-center">
            {!showResults ? (
                <button
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                    className="group inline-flex items-center justify-center gap-3 bg-emerald-600 text-white font-bold text-xl py-3 px-8 rounded-full shadow-lg hover:bg-emerald-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                    Submit Answers
                    <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                </button>
            ) : (
                <div className="text-xl font-semibold text-slate-700">
                    <p>Calculating your score...</p>
                </div>
            )}
        </div>

    </div>
  );
};

export default Quiz;

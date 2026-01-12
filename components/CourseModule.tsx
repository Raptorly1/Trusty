import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Module, InteractiveType } from '../types';
import { CheckCircle, XCircle, ArrowRight } from './Icons';


// MarkdownRenderer now uses react-markdown for robust rendering
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => (
  <div className="prose max-w-none prose-h2:text-3xl prose-h2:font-bold prose-h2:text-slate-900 prose-h3:text-2xl prose-h3:font-semibold prose-h3:text-slate-800 prose-li:text-lg prose-li:text-slate-700 prose-p:text-lg prose-p:text-slate-700">
    <ReactMarkdown>{content}</ReactMarkdown>
  </div>
);


interface InteractiveExerciseProps {
    module: Module;
    onAnswered: () => void;
}

const InteractiveExercise: React.FC<InteractiveExerciseProps> = ({ module, onAnswered }) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<string>('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [password, setPassword] = useState('');

    const handleOptionClick = (index: number) => {
        if (isAnswered) return;
        const option = module.interactive.options![index];
        setSelectedOption(index);
        setFeedback(option.feedback);
        setIsAnswered(true);
        onAnswered();
    };
    
    const getPasswordStrength = (pw: string) => {
        let strength = 0;
        if (pw.length >= 8) strength++;
        if (pw.length >= 12) strength++;
        if (/[A-Z]/.test(pw)) strength++;
        if (/[a-z]/.test(pw)) strength++;
        if (/[0-9]/.test(pw)) strength++;
        if (/[^A-Za-z0-9]/.test(pw)) strength++;
        return strength;
    };

    const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

    const renderPasswordFeedback = () => {
        if (!password) return null;
        if (passwordStrength < 3) return <p className="text-sm text-amber-600 mt-2">Getting warmer... try adding more character types.</p>;
        if (passwordStrength < 5) return <p className="text-sm text-yellow-600 mt-2">Good! For extra security, make it longer or add a symbol.</p>;
        return <p className="text-sm text-emerald-600 mt-2 font-semibold">Excellent! This looks like a strong password.</p>;
    };

    switch (module.interactive.type) {
        case InteractiveType.PASSWORD_CHECKER:
            return (
                <div>
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Type a practice password"
                        className="w-full p-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {renderPasswordFeedback()}
                    <button onClick={onAnswered} disabled={passwordStrength < 4} className="mt-4 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">Looks Good!</button>
                </div>
            );
        case InteractiveType.CHEAT_SHEET:
            return (
                <div className="space-y-6">
                  {module.interactive.extraData?.cheatSheet?.map((section: any) => (
                    <div key={section.title} className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-xl">
                      <h4 className="text-xl font-bold text-amber-800 mb-2">{section.title}</h4>
                      <ul className="list-disc pl-6 text-amber-900 space-y-1">
                        {section.tips.map((tip: string, tipIdx: number) => (
                          <li key={tipIdx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <button
                    onClick={onAnswered}
                    className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Mark as Read
                  </button>
                </div>
            );
        default:
            return (
                <div>
                    {module.interactive.extraData?.message && (
                        <div className="bg-slate-200 p-4 rounded-lg mb-4 text-slate-800 text-center font-mono">
                            {module.interactive.extraData.message}
                        </div>
                    )}
                    <div className="space-y-3">
                        {module.interactive.options?.map((option, index) => {
                            const isSelected = selectedOption === index;
                            const buttonColor = isSelected 
                                ? option.isCorrect ? 'bg-emerald-100 border-emerald-500 text-emerald-900' : 'bg-red-100 border-red-500 text-red-900'
                                : 'bg-white border-slate-300 hover:bg-slate-100 hover:border-blue-500';

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleOptionClick(index)}
                                    disabled={isAnswered}
                                    className={`w-full text-left p-4 rounded-lg border-2 font-medium transition-all flex items-center justify-between ${buttonColor}`}
                                >
                                    <span>{option.text}</span>
                                    {isSelected && (option.isCorrect ? <CheckCircle className="h-6 w-6 text-emerald-600" /> : <XCircle className="h-6 w-6 text-red-600" />)}
                                </button>
                            );
                        })}
                    </div>
                    {feedback && <p className={`mt-4 p-3 rounded-lg text-center ${module.interactive.options?.[selectedOption!]?.isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>{feedback}</p>}
                </div>
            );
    }
};

interface CourseModuleProps {
    module: Module;
    onNextModule: () => void;
    isLastModule: boolean;
}

const CourseModule: React.FC<CourseModuleProps> = ({ module, onNextModule, isLastModule }) => {
    const [interactiveDone, setInteractiveDone] = useState(false);

    return (
        <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="text-center mb-8">
                <h3 className="text-base font-semibold text-blue-600 uppercase tracking-wide">{module.title}</h3>
                <h1 className="mt-2 text-4xl sm:text-5xl font-bold text-slate-900">{module.subtitle}</h1>
            </div>

            <div className="mb-12">
                <MarkdownRenderer content={module.markdownContent} />
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 border-dashed p-6 rounded-2xl">
                <h3 className="text-2xl font-bold text-center text-blue-800 mb-4">Interactive Exercise</h3>
                <p className="text-lg text-center text-blue-700 mb-6">{module.interactive.prompt}</p>
                <InteractiveExercise module={module} onAnswered={() => setInteractiveDone(true)} />
            </div>

            <div className="mt-10 text-center">
                <button
                    onClick={onNextModule}
                    disabled={!interactiveDone}
                    className="group inline-flex items-center justify-center gap-3 bg-blue-600 text-white font-bold text-xl py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLastModule ? 'Take Final Quiz' : 'Next Module'}
                    <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </div>
    );
};

export default CourseModule;
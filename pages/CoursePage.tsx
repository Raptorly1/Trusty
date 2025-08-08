
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { courseModules, finalQuizQuestions } from '../constants/courseData';
import { CourseModule, ExerciseType, FinalQuizQuestion, QuizOption, ScamItem } from '../types';
import { CheckCircle, XCircle, Star, ArrowRight, RotateCcw } from 'lucide-react';

const PasswordChecker: React.FC = () => {
    const [password, setPassword] = useState('');
    const [strength, setStrength] = useState({ score: 0, feedback: '' });

    const checkStrength = (pw: string) => {
        let score = 0;
        let feedback = [];
        if (pw.length >= 12) { score++; feedback.push("Good length (12+ characters)."); } else { feedback.push("Too short. Aim for 12+ characters.");}
        if (/[A-Z]/.test(pw)) { score++; }
        if (/[a-z]/.test(pw)) { score++; }
        if (/[0-9]/.test(pw)) { score++; }
        if (/[^A-Za-z0-9]/.test(pw)) { score++; }
        
        if (score < 3) feedback.unshift("Weak password.");
        else if (score < 5) feedback.unshift("Okay password, could be stronger.");
        else feedback.unshift("Strong password!");
        
        setStrength({ score, feedback: feedback.join(' ') });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        checkStrength(e.target.value);
    };

    const strengthColor = () => {
        if (strength.score < 3) return 'progress-error';
        if (strength.score < 5) return 'progress-warning';
        return 'progress-success';
    }

    return (
        <div className="space-y-4">
            <input type="text" placeholder="Type a password to test it" className="input input-bordered w-full text-lg" value={password} onChange={handleChange} />
            {password && (
                <>
                    <progress className={`progress w-full ${strengthColor()}`} value={strength.score * 20} max="100"></progress>
                    <p className="text-lg">{strength.feedback}</p>
                </>
            )}
        </div>
    );
}

const QuizExercise: React.FC<{ module: CourseModule, onComplete: () => void }> = ({ module, onComplete }) => {
    const [selected, setSelected] = useState<QuizOption | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    
    if (module.exercise.type !== ExerciseType.QUIZ) return null;
    const { question, options, correctFeedback, incorrectFeedback } = module.exercise;

    const handleSelect = (option: QuizOption) => {
        if (isAnswered) return;
        setSelected(option);
        setIsAnswered(true);
        setTimeout(onComplete, 2000);
    };

    const getButtonClass = (option: QuizOption) => {
        if (!isAnswered) return 'btn-outline';
        if (option.isCorrect) return 'btn-success';
        if (selected === option && !option.isCorrect) return 'btn-error';
        return 'btn-outline btn-disabled';
    }

    return (
        <div className="space-y-4">
            <h3 className="text-2xl font-semibold">{question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((option, i) => (
                    <button key={i} onClick={() => handleSelect(option)} className={`btn btn-lg h-auto py-4 text-left justify-start whitespace-normal ${getButtonClass(option)}`}>
                        {option.text}
                    </button>
                ))}
            </div>
            {isAnswered && (
                <div className={`alert ${selected?.isCorrect ? 'alert-success' : 'alert-error'} mt-4`}>
                    {selected?.isCorrect ? <CheckCircle /> : <XCircle />}
                    <span>{selected?.isCorrect ? correctFeedback : incorrectFeedback}</span>
                </div>
            )}
        </div>
    )
}

const ScamIdentificationExercise: React.FC<{ module: CourseModule, onComplete: () => void }> = ({ module, onComplete }) => {
    const [selections, setSelections] = useState<Record<number, boolean>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (module.exercise.type !== ExerciseType.SCAM_IDENTIFICATION) return null;
    const { instructions, items } = module.exercise;
    
    const handleToggle = (index: number) => {
        if (isSubmitted) return;
        setSelections(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        setTimeout(onComplete, 5000);
    }
    
    const getItemClass = (item: ScamItem, index: number) => {
        if (!isSubmitted) return selections[index] ? 'ring-2 ring-primary' : 'border-base-300';
        if (item.isScam) return 'bg-error/20 border-error'; // Was a scam
        return 'bg-success/20 border-success'; // Was safe
    }
    
    return (
        <div className="space-y-4">
            <h3 className="text-2xl font-semibold">{instructions}</h3>
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div key={index} onClick={() => handleToggle(index)} className={`p-4 border rounded-lg cursor-pointer transition-all ${getItemClass(item, index)}`}>
                        <p className="text-lg">{item.content}</p>
                        {isSubmitted && <p className="text-sm font-semibold mt-2">{item.explanation}</p>}
                    </div>
                ))}
            </div>
            {!isSubmitted && <button onClick={handleSubmit} className="btn btn-primary">Check Answers</button>}
             {isSubmitted && (
                <div className="alert alert-info mt-4">
                    <CheckCircle />
                    <span>Great job! The results are now highlighted. We'll move on shortly.</span>
                </div>
            )}
        </div>
    );
};

const FinalQuiz: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    
    const handleSelect = (qIndex: number, option: string) => {
        setAnswers(prev => ({ ...prev, [qIndex]: option }));
    };

    const handleSubmit = () => {
        let score = 0;
        finalQuizQuestions.forEach((q, i) => {
            if (answers[i] === q.correctAnswer) {
                score++;
            }
        });
        onComplete(score);
    };

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title text-4xl">Final Quiz!</h2>
                <p className="text-xl">Let's see what you've learned.</p>
                <div className="space-y-8 mt-4">
                    {finalQuizQuestions.map((q, qIndex) => (
                        <div key={qIndex}>
                            <h3 className="text-2xl font-semibold">{q.question}</h3>
                            <div className="form-control space-y-2 mt-2">
                                {q.options.map(option => (
                                    <label key={option} className="label cursor-pointer text-lg">
                                        <span className="label-text text-lg">{option}</span>
                                        <input type="radio" name={`q-${qIndex}`} className="radio radio-primary" value={option} onChange={() => handleSelect(qIndex, option)} />
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="card-actions justify-center mt-8">
                    <button onClick={handleSubmit} className="btn btn-primary btn-lg">Submit Quiz</button>
                </div>
            </div>
        </div>
    );
};


const Certificate: React.FC<{ score: number, onRestart: () => void }> = ({ score, onRestart }) => {
    const totalQuestions = finalQuizQuestions.length;
    const isPass = score / totalQuestions >= 0.75;

    return (
        <div className="text-center p-8 bg-base-200 rounded-box border-4 border-primary">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                <Star className="h-24 w-24 mx-auto text-amber-400" />
                <h2 className="text-5xl font-bold mt-4">{isPass ? "Congratulations!" : "Good Effort!"}</h2>
                <p className="text-2xl mt-2">You completed the Trusty Digital Safety Course.</p>
                <p className="text-4xl font-bold my-6 text-primary">Your Score: {score} / {totalQuestions}</p>
                {isPass ? (
                    <p className="text-xl">You've earned your certificate of completion. Well done!</p>
                ) : (
                    <p className="text-xl">You're almost there! Feel free to review the modules and try the quiz again.</p>
                )}
                <button onClick={onRestart} className="btn btn-secondary btn-lg mt-8">
                   <RotateCcw /> {isPass ? "Take Again" : "Retry Course"}
                </button>
            </motion.div>
        </div>
    );
};

const CoursePage: React.FC = () => {
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [isExerciseMode, setIsExerciseMode] = useState(false);
    const [isQuizMode, setIsQuizMode] = useState(false);
    const [quizScore, setQuizScore] = useState<number | null>(null);

    const handleNext = () => {
        if (!isExerciseMode) {
            setIsExerciseMode(true);
        } else {
            if (currentModuleIndex < courseModules.length - 1) {
                setCurrentModuleIndex(prev => prev + 1);
                setIsExerciseMode(false);
            } else {
                setIsQuizMode(true);
            }
        }
    }

    const handleQuizComplete = (score: number) => {
        setQuizScore(score);
    }

    const handleRestart = () => {
        setCurrentModuleIndex(0);
        setIsExerciseMode(false);
        setIsQuizMode(false);
        setQuizScore(null);
    }

    const currentModule = courseModules[currentModuleIndex];
    const progress = (currentModuleIndex + (isExerciseMode ? 0.5 : 0)) / courseModules.length * 100;
    
    if (quizScore !== null) {
        return <Certificate score={quizScore} onRestart={handleRestart} />;
    }

    if (isQuizMode) {
        return <FinalQuiz onComplete={handleQuizComplete} />;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-center mb-4">Digital Safety Course</h1>
            <p className="text-xl text-center text-base-content/70 mb-8">
                Module {currentModuleIndex + 1} of {courseModules.length}
            </p>
            <progress className="progress progress-primary w-full mb-8" value={progress} max="100"></progress>
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentModuleIndex + (isExerciseMode ? 1 : 0)}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                    className="card bg-base-100 shadow-xl"
                >
                    <div className="card-body p-8 md:p-12">
                        {!isExerciseMode ? (
                            <>
                                <h2 className="card-title text-4xl mb-4">{currentModule.title}</h2>
                                {currentModule.content}
                            </>
                        ) : (
                            <>
                                <h2 className="card-title text-4xl mb-4">Let's Practice!</h2>
                                {currentModule.exercise.type === ExerciseType.QUIZ && <QuizExercise module={currentModule} onComplete={handleNext} />}
                                {currentModule.exercise.type === ExerciseType.PASSWORD_CHECKER && <PasswordChecker />}
                                {currentModule.exercise.type === ExerciseType.SCAM_IDENTIFICATION && <ScamIdentificationExercise module={currentModule} onComplete={handleNext} />}
                            </>
                        )}
                        
                        <div className="card-actions justify-end mt-8">
                            {(!isExerciseMode || currentModule.exercise.type === ExerciseType.PASSWORD_CHECKER) && (
                                <button onClick={handleNext} className="btn btn-primary btn-lg">
                                    {isExerciseMode ? (currentModuleIndex < courseModules.length - 1 ? 'Next Module' : 'Take Final Quiz') : 'Continue to Exercise'}
                                    <ArrowRight />
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default CoursePage;

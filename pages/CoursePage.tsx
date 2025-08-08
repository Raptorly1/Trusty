
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { courseModules as originalCourseModules, finalQuizQuestions } from '../constants/courseData';
import ReactMarkdown from 'react-markdown';
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
        if (/\d/.test(pw)) { score++; }
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

    // Vite dynamic import for markdown modules
    const [courseModules, setCourseModules] = useState<{
        title: string;
        description: string;
        content: string;
        exercise: any;
    }[]>([]);
    React.useEffect(() => {
        const loadModules = async () => {
            const modules = import.meta.glob('../modules/*.md', { as: 'raw' });
            const moduleEntries = Object.entries(modules);
            const loadedMarkdowns = await Promise.all(moduleEntries.map(async ([file, loader]) => {
                const content = await loader();
                return content;
            }));
            // Define new exercises for each module
            const newExercises = [
                // Module 1: Quiz - Safe/Unsafe actions
                {
                    type: ExerciseType.QUIZ,
                    question: "Which of the following is a safe online habit?",
                    options: [
                        { text: "Clicking on links from unknown emails.", isCorrect: false },
                        { text: "Using strong, unique passwords for each account.", isCorrect: true },
                        { text: "Sharing your birthday on public forums.", isCorrect: false },
                        { text: "Responding to urgent requests for money online.", isCorrect: false },
                    ],
                    correctFeedback: "Correct! Strong, unique passwords are a key part of online safety.",
                    incorrectFeedback: "Not quite. The safest habit is using strong, unique passwords for each account."
                },
                // Module 2: Scam Identification
                {
                    type: ExerciseType.SCAM_IDENTIFICATION,
                    instructions: "Tap the messages below that you think are scams.",
                    items: [
                        { content: "URGENT: Your bank account is locked. Click here to verify your details immediately: bit.ly/bank-fix", isScam: true, explanation: "This is a scam. Urgent language and suspicious links are red flags." },
                        { content: "Hi, your library book is due next Friday. You can renew it online at our official website.", isScam: false, explanation: "This is likely safe. No urgent demands or suspicious links." },
                        { content: "Congratulations! You won a FREE cruise! Provide your credit card for a small fee.", isScam: true, explanation: "Classic scam. Legitimate prizes don't require payment or credit card details." },
                        { content: "Reminder: Your doctor's appointment is scheduled for next week.", isScam: false, explanation: "This is a normal reminder from a trusted source." },
                    ]
                },
                // Module 3: Quiz - Fake news verification
                {
                    type: ExerciseType.QUIZ,
                    question: "You see a shocking news story online. What's the BEST first step?",
                    options: [
                        { text: "Share it immediately so your friends are aware.", isCorrect: false },
                        { text: "Check if respected news sources are reporting the same thing.", isCorrect: true },
                        { text: "Believe it because it looks professionally written.", isCorrect: false },
                        { text: "Comment to argue with people.", isCorrect: false },
                    ],
                    correctFeedback: "Excellent! Checking other reliable sources is the most important step.",
                    incorrectFeedback: "Pause before sharing. Checking other sources helps prevent misinformation."
                },
                // Module 4: Scam Identification - Safe websites/links
                {
                    type: ExerciseType.SCAM_IDENTIFICATION,
                    instructions: "Select which of these websites or links are safe to use.",
                    items: [
                        { content: "https://www.bankofamerica.com", isScam: false, explanation: "This is a legitimate bank website (look for https and correct spelling)." },
                        { content: "http://amaz0n.com/win-prize", isScam: true, explanation: "Misspelled domain and prize offer are red flags." },
                        { content: "https://www.irs.gov", isScam: false, explanation: "Official government site (https, correct spelling)." },
                        { content: "http://face-book.net/login", isScam: true, explanation: "Fake domain and login prompt are signs of a scam." },
                    ]
                },
                // Module 5: Password Checker
                {
                    type: ExerciseType.PASSWORD_CHECKER
                },
                // Module 6: Quiz - Spotting AI-generated fakes
                {
                    type: ExerciseType.QUIZ,
                    question: "Which is a good way to spot AI-generated fake images?",
                    options: [
                        { text: "Look for too many fingers or distorted hands.", isCorrect: true },
                        { text: "Trust any image that looks realistic.", isCorrect: false },
                        { text: "Ignore blurry backgrounds.", isCorrect: false },
                        { text: "Share images without checking sources.", isCorrect: false },
                    ],
                    correctFeedback: "Correct! AI images often have odd details like too many fingers.",
                    incorrectFeedback: "Not quite. Odd details like too many fingers are a sign of AI fakes."
                },
                // Module 7: Quiz - Cyber hygiene habits
                {
                    type: ExerciseType.QUIZ,
                    question: "What's the best cyber hygiene habit?",
                    options: [
                        { text: "Install updates regularly.", isCorrect: true },
                        { text: "Download apps from pop-up ads.", isCorrect: false },
                        { text: "Share passwords with friends.", isCorrect: false },
                        { text: "Ignore privacy settings.", isCorrect: false },
                    ],
                    correctFeedback: "Correct! Regular updates keep your devices secure.",
                    incorrectFeedback: "Nope. Installing updates is the best habit for security."
                },
                // Module 8: Quiz - Reporting scams
                {
                    type: ExerciseType.QUIZ,
                    question: "If you think you've been scammed, what's the FIRST thing you should do?",
                    options: [
                        { text: "Report it to the FTC or local authorities.", isCorrect: true },
                        { text: "Keep it secret and hope it goes away.", isCorrect: false },
                        { text: "Send money to the scammer to fix it.", isCorrect: false },
                        { text: "Delete all your accounts immediately.", isCorrect: false },
                    ],
                    correctFeedback: "Correct! Reporting helps stop scammers and protects others.",
                    incorrectFeedback: "Not quite. Reporting is the most important first step."
                }
            ];
            // Merge markdown content with new exercises
            const merged = originalCourseModules.map((mod, idx) => ({
                ...mod,
                content: loadedMarkdowns[idx] || '',
                exercise: newExercises[idx]
            }));
            setCourseModules(merged);
        };
        loadModules();
    }, []);
    const currentModule = courseModules[currentModuleIndex] || { title: '', description: '', content: '', exercise: null };
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
                                <ReactMarkdown>{currentModule.content}</ReactMarkdown>
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
                                (() => {
                                    let buttonLabel = 'Continue to Exercise';
                                    if (isExerciseMode) {
                                        buttonLabel = currentModuleIndex < courseModules.length - 1 ? 'Next Module' : 'Take Final Quiz';
                                    }
                                    return (
                                        <button onClick={handleNext} className="btn btn-primary btn-lg">
                                            {buttonLabel}
                                            <ArrowRight />
                                        </button>
                                    );
                                })()
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default CoursePage;

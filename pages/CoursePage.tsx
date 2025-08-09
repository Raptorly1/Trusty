import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { finalQuizQuestions } from '../constants/courseData';
import ReactMarkdown from 'react-markdown';
import { CourseModule, ExerciseType, ScamItem } from '../types';
import { CheckCircle, Star, ArrowRight, RotateCcw } from 'lucide-react';

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


// Multi-question quiz component
const MultiQuizExercise: React.FC<{ module: CourseModule, onComplete: () => void }> = ({ module, onComplete }) => {
    const [answers, setAnswers] = useState<Record<number, number | null>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    if (module.exercise.type !== ExerciseType.QUIZ) return null;
    const { questions } = module.exercise;
    if (!questions || !Array.isArray(questions)) return null;

    const handleSelect = (qIdx: number, optIdx: number) => {
        if (isSubmitted) return;
        setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    };
    const handleSubmit = () => {
        setIsSubmitted(true);
        setTimeout(onComplete, 2500);
    };
    // Score calculation
    const score = isSubmitted ? questions.reduce((acc, q, i) => {
        const ansIdx = answers[i];
        if (ansIdx !== undefined && ansIdx !== null && q.options[ansIdx].isCorrect) acc++;
        return acc;
    }, 0) : null;

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-2">Quiz</h3>
            {questions.map((q, qIdx) => (
                <div key={q.question} className="mb-4">
                    <h4 className="text-xl font-bold mb-2">{q.question}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                            let btnClass = 'btn-outline';
                            if (answers[qIdx] === optIdx) {
                                if (isSubmitted) {
                                    btnClass = opt.isCorrect ? 'btn-success' : 'btn-error';
                                } else {
                                    btnClass = 'btn-primary';
                                }
                            }
                            return (
                                <button
                                    key={opt.text}
                                    onClick={() => handleSelect(qIdx, optIdx)}
                                    className={`btn btn-md text-left whitespace-normal ${btnClass}`}
                                    disabled={isSubmitted}
                                    aria-label={opt.text}
                                >
                                    {opt.text}
                                </button>
                            );
                        })}
                    </div>
                    {isSubmitted && answers[qIdx] !== undefined && (
                        <div className={`mt-2 text-lg ${q.options[answers[qIdx]!].isCorrect ? 'text-success' : 'text-error'}`}>{q.options[answers[qIdx]!].isCorrect ? 'Correct!' : 'Incorrect.'}</div>
                    )}
                </div>
            ))}
            {!isSubmitted && <button className="btn btn-primary mt-4" onClick={handleSubmit}>Submit Quiz</button>}
            {isSubmitted && <div className="alert alert-info mt-4">Score: {score} / {questions.length}</div>}
        </div>
    );
};

// Single-question quiz component
const SingleQuizExercise: React.FC<{ module: CourseModule, onComplete: () => void }> = ({ module, onComplete }) => {
    const [selected, setSelected] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    if (module.exercise.type !== ExerciseType.QUIZ) return null;
    const { question, options, correctFeedback, incorrectFeedback } = module.exercise;
    if (!question || !options) return null;

    const handleSelect = (idx: number) => {
        if (isAnswered) return;
        setSelected(idx);
        setIsAnswered(true);
        setTimeout(onComplete, 2000);
    };
    const getButtonClass = (idx: number) => {
        if (!isAnswered) return 'btn-outline';
        if (options[idx].isCorrect) return 'btn-success';
        if (selected === idx && !options[idx].isCorrect) return 'btn-error';
        return 'btn-outline btn-disabled';
    };
    return (
        <div className="space-y-4">
            <h3 className="text-2xl font-semibold">{question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((option, i) => (
                    <button key={option.text} onClick={() => handleSelect(i)} className={`btn btn-lg h-auto py-4 text-left justify-start whitespace-normal ${getButtonClass(i)}`}>
                        {option.text}
                    </button>
                ))}
            </div>
            {isAnswered && (
                <div className={`alert ${selected !== null && options[selected].isCorrect ? 'alert-success' : 'alert-error'} mt-4`}>
                    <span>{selected !== null && options[selected].isCorrect ? correctFeedback : incorrectFeedback}</span>
                </div>
            )}
        </div>
    );
};

// Checklist activity component
const ChecklistExercise: React.FC<{ module: CourseModule }> = ({ module }) => {
    // Always call useState, even if not used
    const items = (module.exercise.type === ExerciseType.CHECKLIST)
        ? (module.exercise as import('../types').ChecklistExerciseData).items
        : [];
    const instructions = (module.exercise.type === ExerciseType.CHECKLIST)
        ? (module.exercise as import('../types').ChecklistExerciseData).instructions
        : '';
    const [checked, setChecked] = useState<boolean[]>(Array(items.length).fill(false));
    const handleToggle = (idx: number) => {
        setChecked(prev => prev.map((v, i) => i === idx ? !v : v));
    };
    if (module.exercise.type !== ExerciseType.CHECKLIST) return null;
    return (
        <div className="space-y-4">
            <h3 className="text-2xl font-semibold mb-2">{instructions}</h3>
            <ul className="space-y-2">
                {items.map((item, idx) => (
                    <li key={item + idx} className="flex items-center gap-2">
                        <input type="checkbox" checked={checked[idx]} onChange={() => handleToggle(idx)} className="checkbox checkbox-primary" aria-label={item} />
                        <span className="text-lg">{item}</span>
                    </li>
                ))}
            </ul>
            <div className="alert alert-info mt-4">This activity is just for you. No need to submit!</div>
        </div>
    );
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
                    <button
                        key={item.content + index}
                        type="button"
                        onClick={() => handleToggle(index)}
                        className={`w-full text-left p-4 border rounded-lg cursor-pointer transition-all ${getItemClass(item, index)}`}
                        aria-pressed={!!selections[index]}
                        aria-label={item.content}
                    >
                        <p className="text-lg">{item.content}</p>
                        {isSubmitted && <p className="text-sm font-semibold mt-2">{item.explanation}</p>}
                    </button>
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
                    {finalQuizQuestions.map((q) => (
                        <div key={q.question}>
                            <h3 className="text-2xl font-semibold">{q.question}</h3>
                            <div className="form-control space-y-2 mt-2">
                                {q.options.map(option => (
                                    <label key={option} className="label cursor-pointer text-lg">
                                        <span className="label-text text-lg">{option}</span>
                                        <input type="radio" name={`q-${q.question}`} className="radio radio-primary" value={option} onChange={() => handleSelect(finalQuizQuestions.indexOf(q), option)} />
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
            return;
        }
        if (currentModuleIndex < courseModules.length - 1) {
            setCurrentModuleIndex(prev => prev + 1);
            setIsExerciseMode(false);
            return;
        }
        setIsQuizMode(true);
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
    const [courseModules, setCourseModules] = useState<CourseModule[]>([]);
    React.useEffect(() => {
        const loadModules = async () => {
            const modules = import.meta.glob('../modules/*.md', { as: 'raw' });
            const moduleEntries = Object.entries(modules);
            const loadedMarkdowns = await Promise.all(moduleEntries.map(async ([file, loader]) => {
                const content = await loader();
                // Extract title from first markdown heading, fallback to filename
                let title = '';
                let description = '';
                const headingRegex = /^#\s+(.+)/m;
                const match = headingRegex.exec(content);
                if (match) {
                    title = match[1].trim();
                } else {
                    // fallback: filename without extension
                    title = file.split('/').pop()?.replace('.md', '') || 'Module';
                }
                // Optionally extract description from first paragraph after heading
                const descRegex = /#.+\n+([^#\n][^\n]*)/;
                const descMatch = descRegex.exec(content);
                description = descMatch ? descMatch[1].trim() : '';
                return { title, description, content };
            }));
            // Define new exercises for each module (order must match markdown file order)
            const newExercises = [
                // Module 1: Checklist Activity
                {
                    type: ExerciseType.CHECKLIST,
                    instructions: "Your Online Safety Checklist – ‘Locking Your Digital Doors’. Place a ✔ next to anything you already do:",
                    items: [
                        "I avoid clicking links in emails or texts from people I don’t know",
                        "I keep my personal information private when using the internet",
                        "I only use trusted websites when shopping or entering information",
                        "I use different passwords for my important accounts",
                        "I double-check if something seems too good to be true online"
                    ]
                },
                // Module 2: Scam Quiz (multi-question)
                {
                    type: ExerciseType.QUIZ,
                    questions: [
                        {
                            question: "Which of the following is a red flag in a phone scam?",
                            options: [
                                { text: "The caller says hello politely", isCorrect: false },
                                { text: "The caller asks you to confirm your name", isCorrect: false },
                                { text: "The caller threatens arrest if you don’t pay right away", isCorrect: true },
                                { text: "The caller offers you a free magazine subscription", isCorrect: false }
                            ]
                        },
                        {
                            question: "You get an email from 'your bank' asking you to click a link and verify your account. What should you do?",
                            options: [
                                { text: "Click the link and enter your details right away", isCorrect: false },
                                { text: "Forward the email to your friends", isCorrect: false },
                                { text: "Delete the email and call your bank using the number on your bank card", isCorrect: true },
                                { text: "Reply and ask if the email is real", isCorrect: false }
                            ]
                        },
                        {
                            question: "What makes a text message suspicious?",
                            options: [
                                { text: "It uses emojis", isCorrect: false },
                                { text: "It comes from a friend", isCorrect: false },
                                { text: "It includes a short link and asks for personal info", isCorrect: true },
                                { text: "It says 'Have a nice day!'", isCorrect: false }
                            ]
                        },
                        {
                            question: "Which of the following giveaway messages is most likely a scam?",
                            options: [
                                { text: "Enter now to win a vacation", isCorrect: false },
                                { text: "You’ve won the lottery, click here to claim your prize!", isCorrect: true },
                                { text: "Sign up for our newsletter", isCorrect: false },
                                { text: "Take our survey for a chance to win", isCorrect: false }
                            ]
                        },
                        {
                            question: "Why should you be careful of email addresses that look almost correct, like 'amaz0n.com'?",
                            options: [
                                { text: "They might be a new version of the company’s website", isCorrect: false },
                                { text: "It’s probably a scam site pretending to be the real one", isCorrect: true },
                                { text: "They usually offer better deals", isCorrect: false },
                                { text: "They’re safe if the email says 'Dear Customer'", isCorrect: false }
                            ]
                        },
                        // ...continue with all other questions from your Module 2 list...
                    ]
                },
                // Module 3: Fake News Quiz (multi-question)
                {
                    type: ExerciseType.QUIZ,
                    questions: [
                        {
                            question: "What is one reason fake news can be dangerous?",
                            options: [
                                { text: "It helps people find cheaper products", isCorrect: false },
                                { text: "It can cause people to make decisions based on wrong information", isCorrect: true },
                                { text: "It’s usually just a joke and doesn’t affect anyone", isCorrect: false },
                                { text: "It only appears on TV", isCorrect: false }
                            ]
                        },
                        // ...continue with all other questions from your Module 3 list...
                    ]
                },
                // Module 4: Safe Browsing Quiz (multi-question)
                {
                    type: ExerciseType.QUIZ,
                    questions: [
                        {
                            question: "Is this website safe to enter your personal information?",
                            options: [
                                { text: "Yes, it’s fine as long as you trust the company", isCorrect: false },
                                { text: "No, it’s missing 'https://' and the lock icon", isCorrect: true },
                                { text: "Yes, the site looks okay visually", isCorrect: false },
                                { text: "Only if the page loads quickly", isCorrect: false }
                            ]
                        },
                        // ...continue with all other questions from your Module 4 list...
                    ]
                },
                // Module 5: Passwords & Privacy (Password Checker)
                {
                    type: ExerciseType.PASSWORD_CHECKER
                },
                // Module 6: AI or Not? Quiz (multi-question)
                {
                    type: ExerciseType.QUIZ,
                    questions: [
                        {
                            question: "You see a photo of a man with perfect skin, glowing eyes, and hands that have six fingers.",
                            options: [
                                { text: "AI", isCorrect: true },
                                { text: "Real", isCorrect: false }
                            ]
                        },
                        // ...continue with all other questions from your Module 6 list...
                    ]
                },
                // Module 7: Cyber Hygiene Cheat Sheet Activity
                {
                    type: ExerciseType.CHECKLIST,
                    instructions: "Create Your Own Digital Safety Cheat Sheet. Choose your top 5 safety habits and write a reminder phrase.",
                    items: [
                        "Keep my phone and computer updated",
                        "Only download apps from the official app store",
                        "Hover over links before clicking",
                        "Don’t share passwords with anyone who messages or calls me",
                        "Use a different password for each account",
                        "Back up important files or photos",
                        "Ignore pop-ups that say I’ve won something",
                        "Pause and double-check urgent or scary messages",
                        "Use antivirus software",
                        "Delete old apps I no longer use",
                        "Check privacy settings on social media"
                    ]
                },
                // Module 8: Personal Safety Plan Activity
                {
                    type: ExerciseType.CHECKLIST,
                    instructions: "Build Your Personal Online Safety Plan. Fill in your emergency scam response sheet and add your support resources.",
                    items: [
                        "I know where to report scams",
                        "I’ve saved important phone numbers",
                        "I know how to freeze my credit if needed",
                        "I know where to get help if I’m not sure what to do",
                        "I will stay calm, pause, and act smart if something feels wrong"
                    ]
                }
            ];
            // Build courseModules from markdowns and exercises
            const merged = loadedMarkdowns.map((mod, idx) => ({
                title: mod.title,
                description: mod.description,
                content: mod.content,
                exercise: newExercises[idx]
            })) as CourseModule[];
            setCourseModules(merged);
        };
        loadModules();
    }, []);
    const currentModule = courseModules[currentModuleIndex] || { title: '', description: '', content: '', exercise: { type: ExerciseType.QUIZ, question: '', options: [], correctFeedback: '', incorrectFeedback: '' } };
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
                                <ReactMarkdown>{currentModule.content as string}</ReactMarkdown>
                            </>
                        ) : (
                            <>
                                <h2 className="card-title text-4xl mb-4">Let's Practice!</h2>
                                {currentModule.exercise.type === ExerciseType.QUIZ && Array.isArray(currentModule.exercise.questions) && (
                                    <MultiQuizExercise module={currentModule} onComplete={handleNext} />
                                )}
                                {currentModule.exercise.type === ExerciseType.QUIZ && currentModule.exercise.question && currentModule.exercise.options && (
                                    <SingleQuizExercise module={currentModule} onComplete={handleNext} />
                                )}
                                {currentModule.exercise.type === ExerciseType.PASSWORD_CHECKER && <PasswordChecker />}
                                {currentModule.exercise.type === ExerciseType.SCAM_IDENTIFICATION && <ScamIdentificationExercise module={currentModule} onComplete={handleNext} />}
                                {currentModule.exercise.type === ExerciseType.CHECKLIST && <ChecklistExercise module={currentModule} />}
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

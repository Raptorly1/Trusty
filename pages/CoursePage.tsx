import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { finalQuizQuestions } from '../constants/courseData';
import { CourseModule, ExerciseType, ScamItem } from '../types';
import { CheckCircle, Star, ArrowRight, RotateCcw } from 'lucide-react';
import Module1 from '../components/course/Module1';
import Module2 from '../components/course/Module2';
import Module3 from '../components/course/Module3';
import Module4 from '../components/course/Module4';
import Module5 from '../components/course/Module5';
import Module6 from '../components/course/Module6';
import Module7 from '../components/course/Module7';
import Module8 from '../components/course/Module8';

// Course modules configuration
const courseModules: CourseModule[] = [
	{
		title: "Digital World Basics",
		description: "Understanding the basics of being online safely",
		content: <Module1 />,
		exercise: {
			type: ExerciseType.CHECKLIST,
			instructions: "Your Online Safety Checklist – 'Locking Your Digital Doors'. Place a ✔ next to anything you already do:",
			items: [
				"I avoid clicking links in emails or texts from people I don't know",
				"I keep my personal information private when using the internet",
				"I double-check website addresses before entering passwords",
				"I pause when someone asks for money or personal details urgently"
			]
		}
	},
	{
		title: "Common Scams",
		description: "Learning to recognize and avoid common online scams",
		content: <Module2 />,
		exercise: {
			type: ExerciseType.SCAM_IDENTIFICATION,
			instructions: "Look at these messages and select which ones are scams:",
			items: [
				{ content: "Dear Customer, Your account will be suspended! Click here to verify immediately!", isScam: true, explanation: "This is a scam. The urgent language and generic greeting are red flags." },
				{ content: "Hi Mom, it's me. Can you send me $500 for an emergency? Don't call my phone.", isScam: true, explanation: "This is a common scam. Family members should be able to verify through normal contact methods." },
				{ content: "Your library book 'Digital Privacy' is due tomorrow. Renew at library.org or return in person.", isScam: false, explanation: "This is likely legitimate. It's a polite reminder without urgent demands or suspicious links." },
				{ content: "CONGRATULATIONS! You've won $10,000! Click to claim your prize now!", isScam: true, explanation: "This is a classic scam. Legitimate prizes don't require immediate action through random links." }
			]
		}
	},
	{
		title: "Spotting Fake News",
		description: "How to identify misinformation and verify facts",
		content: <Module3 />,
		exercise: {
			type: ExerciseType.QUIZ,
			questions: [
				{
					question: "What's the first thing you should do when you see a shocking news story?",
					options: [
						{ text: "Share it immediately with friends", isCorrect: false },
						{ text: "Pause and check if it's from a trusted source", isCorrect: true },
						{ text: "Believe it if it confirms what I already think", isCorrect: false },
						{ text: "Read only the headline to save time", isCorrect: false }
					]
				}
			]
		}
	},
	{
		title: "Safe Browsing",
		description: "How to browse the internet safely and securely",
		content: <Module4 />,
		exercise: {
			type: ExerciseType.QUIZ,
			questions: [
				{
					question: "What should you look for to know a website is secure?",
					options: [
						{ text: "A lock icon and 'https://' in the address bar", isCorrect: true },
						{ text: "Bright colors and lots of advertisements", isCorrect: false },
						{ text: "Pop-ups saying the site is secure", isCorrect: false },
						{ text: "The website loads very quickly", isCorrect: false }
					]
				}
			]
		}
	},
	{
		title: "Strong Passwords",
		description: "Creating and managing secure passwords",
		content: <Module5 />,
		exercise: {
			type: ExerciseType.PASSWORD_CHECKER
		}
	},
	{
		title: "AI Detection",
		description: "Recognizing AI-generated content and staying informed",
		content: <Module6 />,
		exercise: {
			type: ExerciseType.QUIZ,
			questions: [
				{
					question: "You see a photo of a person with perfect skin, glowing eyes, and hands that have six fingers.",
					options: [
						{ text: "AI", isCorrect: true },
						{ text: "Real", isCorrect: false }
					]
				}
			]
		}
	},
	{
		title: "Cyber Hygiene Habits",
		description: "Building healthy digital habits for long-term safety",
		content: <Module7 />,
		exercise: {
			type: ExerciseType.CHECKLIST,
			instructions: "Create Your Own Digital Safety Cheat Sheet. Choose your top 5 safety habits and write a reminder phrase.",
			items: [
				"Keep my phone and computer updated",
				"Only download apps from the official app store",
				"Use antivirus software",
				"Hover over links before clicking",
				"Don't share passwords with anyone who messages or calls me",
				"Use a different password for each account",
				"Back up important files or photos",
				"Ignore pop-ups that say I've won something",
				"Pause and double-check urgent or scary messages",
				"Delete old apps I no longer use",
				"Check privacy settings on social media"
			]
		}
	},
	{
		title: "Reporting & Getting Help",
		description: "What to do when something goes wrong and where to get help",
		content: <Module8 />,
		exercise: {
			type: ExerciseType.CHECKLIST,
			instructions: "Build Your Personal Online Safety Plan. Fill in your emergency scam response sheet and add your support resources.",
			items: [
				"I know where to report scams",
				"I've saved important phone numbers",
				"I know how to freeze my credit if needed",
				"I know where to get help if I'm not sure what to do",
				"I will stay calm, pause, and act smart if something feels wrong"
			]
		}
	}
];

const CoursePage: React.FC = () => {
	const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
	const [isExerciseMode, setIsExerciseMode] = useState(false);
	const [isQuizMode, setIsQuizMode] = useState(false);
	const [quizScore, setQuizScore] = useState<number | null>(null);
	const [exerciseAnswers, setExerciseAnswers] = useState<any>({});
	const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

	const handleNext = () => {
		if (!isExerciseMode) {
			setIsExerciseMode(true);
			return;
		}
		if (currentModuleIndex < courseModules.length - 1) {
			setCurrentModuleIndex(prev => prev + 1);
			setIsExerciseMode(false);
			setExerciseAnswers({});
			setSelectedAnswers([]);
			return;
		}
		setIsQuizMode(true);
	}

	const handleExerciseComplete = () => {
		if (currentModuleIndex < courseModules.length - 1) {
			setCurrentModuleIndex(prev => prev + 1);
			setIsExerciseMode(false);
			setExerciseAnswers({});
			setSelectedAnswers([]);
		} else {
			setIsQuizMode(true);
		}
	}

	const renderExercise = () => {
		const exercise = currentModule.exercise;
		if (!exercise) return null;

		switch (exercise.type) {
			case ExerciseType.CHECKLIST:
				return (
					<div className="space-y-4">
						<p className="text-lg mb-6">{exercise.instructions}</p>
						<div className="space-y-3">
							{exercise.items?.map((item, index) => (
								<div key={index} className="flex items-start gap-3">
									<input 
										type="checkbox" 
										className="checkbox checkbox-primary mt-1" 
										onChange={(e) => {
											setExerciseAnswers(prev => ({
												...prev,
												[index]: e.target.checked
											}));
										}}
									/>
									<label className="text-base cursor-pointer">{item}</label>
								</div>
							))}
						</div>
						<div className="mt-8">
							<button onClick={handleExerciseComplete} className="btn btn-primary btn-lg">
								Continue to Next Module
								<ArrowRight />
							</button>
						</div>
					</div>
				);

			case ExerciseType.SCAM_IDENTIFICATION:
				return (
					<div className="space-y-4">
						<p className="text-lg mb-6">{exercise.instructions}</p>
						<div className="space-y-4">
							{exercise.items?.map((item, index) => (
								<div key={index} className="card bg-base-200 shadow">
									<div className="card-body">
										<p className="text-base mb-4">"{item.content}"</p>
										<div className="flex gap-3">
											<button 
												className={`btn ${selectedAnswers.includes(index) && exerciseAnswers[index] === true ? 'btn-error' : 'btn-outline'}`}
												onClick={() => {
													setSelectedAnswers(prev => [...prev.filter(i => i !== index), index]);
													setExerciseAnswers(prev => ({ ...prev, [index]: true }));
												}}
											>
												Scam
											</button>
											<button 
												className={`btn ${selectedAnswers.includes(index) && exerciseAnswers[index] === false ? 'btn-success' : 'btn-outline'}`}
												onClick={() => {
													setSelectedAnswers(prev => [...prev.filter(i => i !== index), index]);
													setExerciseAnswers(prev => ({ ...prev, [index]: false }));
												}}
											>
												Legitimate
											</button>
										</div>
										{selectedAnswers.includes(index) && (
											<div className={`mt-3 p-3 rounded ${item.isScam === exerciseAnswers[index] ? 'bg-success/20 text-success-content' : 'bg-error/20 text-error-content'}`}>
												{item.explanation}
											</div>
										)}
									</div>
								</div>
							))}
						</div>
						<div className="mt-8">
							<button onClick={handleExerciseComplete} className="btn btn-primary btn-lg">
								Continue to Next Module
								<ArrowRight />
							</button>
						</div>
					</div>
				);

			case ExerciseType.QUIZ: {
				const quizExercise = exercise as any;
				const questions = quizExercise.questions || (quizExercise.question ? [{ question: quizExercise.question, options: quizExercise.options || [] }] : []);
				return (
					<div className="space-y-4">
						{questions.map((question: any, qIndex: number) => (
							<div key={`question-${qIndex}`} className="space-y-4">
								<h3 className="text-xl font-semibold">{question.question}</h3>
								<div className="space-y-2">
									{question.options.map((option: any, oIndex: number) => {
										const isSelected = selectedAnswers.includes(oIndex);
										const buttonClass = isSelected ? 
											(option.isCorrect ? 'btn-success' : 'btn-error') : 
											'btn-outline';
										return (
											<button
												key={`option-${qIndex}-${oIndex}`}
												className={`btn ${buttonClass} w-full justify-start`}
												onClick={() => {
													setSelectedAnswers([oIndex]);
													setExerciseAnswers({ [qIndex]: oIndex });
												}}
											>
												{option.text}
											</button>
										);
									})}
								</div>
								{selectedAnswers.length > 0 && (
									<div className="mt-4">
										<div className={`p-4 rounded ${
											question.options[selectedAnswers[0]]?.isCorrect ? 
												'bg-success/20 text-success-content' : 
												'bg-error/20 text-error-content'
										}`}>
											{question.options[selectedAnswers[0]]?.isCorrect ? 
												'Correct! Great job.' : 
												`Incorrect. The correct answer is: ${question.options.find((o: any) => o.isCorrect)?.text}`
											}
										</div>
									</div>
								)}
							</div>
						))}
						<div className="mt-8">
							<button onClick={handleExerciseComplete} className="btn btn-primary btn-lg">
								Continue to Next Module
								<ArrowRight />
							</button>
						</div>
					</div>
				);
			}

			case ExerciseType.PASSWORD_CHECKER:
				return (
					<div className="space-y-4">
						<p className="text-lg mb-6">Try creating a strong password using the tips from this module:</p>
						<div className="form-control">
							<label htmlFor="password-input" className="label">
								<span className="label-text">Enter a password to check its strength:</span>
							</label>
							<input 
								id="password-input"
								type="password" 
								placeholder="Enter password..." 
								className="input input-bordered w-full" 
								onChange={(e) => {
									const password = e.target.value;
									const strength = {
										hasLength: password.length >= 12,
										hasUpper: /[A-Z]/.test(password),
										hasLower: /[a-z]/.test(password),
										hasNumber: /\d/.test(password),
										hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
									};
									setExerciseAnswers({ strength, password });
								}}
							/>
						</div>
						{exerciseAnswers.strength && (
							<div className="mt-4 space-y-2">
								<div className={`flex items-center gap-2 ${exerciseAnswers.strength.hasLength ? 'text-success' : 'text-error'}`}>
									<CheckCircle className="h-4 w-4" />
									<span>At least 12 characters</span>
								</div>
								<div className={`flex items-center gap-2 ${exerciseAnswers.strength.hasUpper ? 'text-success' : 'text-error'}`}>
									<CheckCircle className="h-4 w-4" />
									<span>Contains uppercase letters</span>
								</div>
								<div className={`flex items-center gap-2 ${exerciseAnswers.strength.hasLower ? 'text-success' : 'text-error'}`}>
									<CheckCircle className="h-4 w-4" />
									<span>Contains lowercase letters</span>
								</div>
								<div className={`flex items-center gap-2 ${exerciseAnswers.strength.hasNumber ? 'text-success' : 'text-error'}`}>
									<CheckCircle className="h-4 w-4" />
									<span>Contains numbers</span>
								</div>
								<div className={`flex items-center gap-2 ${exerciseAnswers.strength.hasSymbol ? 'text-success' : 'text-error'}`}>
									<CheckCircle className="h-4 w-4" />
									<span>Contains symbols</span>
								</div>
							</div>
						)}
						<div className="mt-8">
							<button onClick={handleExerciseComplete} className="btn btn-primary btn-lg">
								Continue to Next Module
								<ArrowRight />
							</button>
						</div>
					</div>
				);

			default:
				return (
					<div>
						<p>Exercise type not implemented yet.</p>
						<div className="mt-8">
							<button onClick={handleExerciseComplete} className="btn btn-primary btn-lg">
								Continue to Next Module
								<ArrowRight />
							</button>
						</div>
					</div>
				);
		}
	};

	const handleQuizComplete = (score: number) => {
		setQuizScore(score);
	}

	const handleRestart = () => {
		setCurrentModuleIndex(0);
		setIsExerciseMode(false);
		setIsQuizMode(false);
		setQuizScore(null);
	}

	const currentModule = courseModules[currentModuleIndex] || { title: '', description: '', content: <div>Loading...</div>, exercise: { type: ExerciseType.QUIZ, question: '', options: [], correctFeedback: '', incorrectFeedback: '' } };
	const progress = (currentModuleIndex + (isExerciseMode ? 0.5 : 0)) / courseModules.length * 100;
    
	if (quizScore !== null) {
		return <div>Certificate goes here</div>; // Replace with your Certificate component
	}

	if (isQuizMode) {
		return <div>Final Quiz goes here</div>; // Replace with your FinalQuiz component
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
								{renderExercise()}
							</>
						)}
                        
						<div className="card-actions justify-end mt-8">
							{(!isExerciseMode) && (
								<button onClick={handleNext} className="btn btn-primary btn-lg">
									Continue to Exercise
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

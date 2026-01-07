import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FinalQuiz from '../components/common/FinalQuiz';
import { motion, AnimatePresence } from 'framer-motion';
import { CourseModule, ExerciseType } from '../types';
import { CheckCircle, Star, ArrowRight } from 'lucide-react';
import Module1 from '../components/course/Module1';
import Module2 from '../components/course/Module2';
import Module3 from '../components/course/Module3';
import Module4 from '../components/course/Module4';
import Module5 from '../components/course/Module5';
import Module6 from '../components/course/Module6';
import Module7 from '../components/course/Module7';
import Module8 from '../components/course/Module8';

// Extra questions for Module 2
const module2ExtraQuestions = [
	{
		question: "A caller says you owe money to the IRS and must pay immediately using a gift card. What kind of scam is this?",
		options: [
			{ text: "Email scam", isCorrect: false },
			{ text: "Giveaway scam", isCorrect: false },
			{ text: "Phone scam", isCorrect: true },
			{ text: "Text message scam", isCorrect: false }
		]
	},
	{
		question: "Which of the following is a red flag of a phone scam?",
		options: [
			{ text: "The caller has a clear voice", isCorrect: false },
			{ text: "They speak calmly and clearly", isCorrect: false },
			{ text: "They ask for gift card payments", isCorrect: true },
			{ text: "They offer helpful tech tips", isCorrect: false }
		]
	},
	{
		question: "What's wrong with this email: \"Dear Customer, click here to verify your account or risk suspension\"?",
		options: [
			{ text: "It's helpful", isCorrect: false },
			{ text: "It includes your full name", isCorrect: false },
			{ text: "It sounds official", isCorrect: false },
			{ text: "It uses a generic greeting and urgency", isCorrect: true }
		]
	},
	{
		question: "A scammer sends you a message about a delivery you didn't order, asking you to click a short link. What should you do?",
		options: [
			{ text: "Click it to track the package", isCorrect: false },
			{ text: "Forward it to your friends", isCorrect: false },
			{ text: "Ignore and delete the message", isCorrect: true },
			{ text: "Reply with your delivery info", isCorrect: false }
		]
	},
	{
		question: "Why are emails with poor grammar and spelling a red flag?",
		options: [
			{ text: "They are written by children", isCorrect: false },
			{ text: "They usually come from official sources", isCorrect: false },
			{ text: "Real companies don't proofread", isCorrect: false },
			{ text: "They're often signs of phishing scams", isCorrect: true }
		]
	},
	{
		question: "Which of the following is a sign of a text scam?",
		options: [
			{ text: "A message from your mom", isCorrect: false },
			{ text: "A security alert from your bank about your real account", isCorrect: false },
			{ text: "A message from a number you don't know about a \"free prize\"", isCorrect: true },
			{ text: "A text about an upcoming doctor's appointment", isCorrect: false }
		]
	},
	{
		question: "A message says: \"Congratulations! You've won a gift card. Pay $10 to claim it.\" What kind of scam is this?",
		options: [
			{ text: "Email scam", isCorrect: false },
			{ text: "Text message scam", isCorrect: false },
			{ text: "Phone scam", isCorrect: false },
			{ text: "Giveaway/lottery scam", isCorrect: true }
		]
	},
	{
		question: "What's a common red flag in a giveaway scam?",
		options: [
			{ text: "You need to answer survey questions", isCorrect: false },
			{ text: "They ask for your address", isCorrect: false },
			{ text: "You're asked to send money to get your prize", isCorrect: true },
			{ text: "You must agree to terms and conditions", isCorrect: false }
		]
	},
	{
		question: "Which of the following is NOT a common method scammers use in phone scams?",
		options: [
			{ text: "Pretending to be the IRS", isCorrect: false },
			{ text: "Offering free Medicare equipment", isCorrect: false },
			{ text: "Asking you to join a real sweepstakes", isCorrect: true },
			{ text: "Claiming a grandchild is in trouble", isCorrect: false }
		]
	},
	{
		question: "An email warning you about \"suspicious activity\" asks you to click a link. What should you do first?",
		options: [
			{ text: "Click the link to fix the problem fast", isCorrect: false },
			{ text: "Call the number in the email", isCorrect: false },
			{ text: "Check if the email address is correct", isCorrect: true },
			{ text: "Forward it to friends", isCorrect: false }
		]
	},
	{
		question: "What makes a scam text look urgent?",
		options: [
			{ text: "It uses emojis", isCorrect: false },
			{ text: "It says, \"Act now!\" or \"Verify immediately!\"", isCorrect: true },
			{ text: "It thanks you politely", isCorrect: false },
			{ text: "It includes personal stories", isCorrect: false }
		]
	},
	{
		question: "What makes a fake email look official even when it's a scam?",
		options: [
			{ text: "It always uses emojis", isCorrect: false },
			{ text: "It includes real news headlines", isCorrect: false },
			{ text: "It mimics the look of a real company email", isCorrect: true },
			{ text: "It's short and vague", isCorrect: false }
		]
	}
];

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
 			{
 				question: "A caller says your grandchild is in jail and needs money urgently. What should you do?",
 				options: [
 					{ text: "Send the money immediately", isCorrect: false },
 					{ text: "Ask the caller to confirm your grandchild’s birthday", isCorrect: false },
 					{ text: "Hang up and call your grandchild or a trusted family member directly", isCorrect: true },
 					{ text: "Keep talking to the caller to learn more", isCorrect: false }
 				]
 			}
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
	const { moduleId } = useParams();
	const navigate = useNavigate();
	const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
	const [isExerciseMode, setIsExerciseMode] = useState(false);
	const [isQuizMode, setIsQuizMode] = useState(false);
	const [quizScore, setQuizScore] = useState<number | null>(null);
	const [exerciseAnswers, setExerciseAnswers] = useState<any>({});
	const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
	const [quizRetakeKey, setQuizRetakeKey] = useState(0);
	const [showExtraQuestions, setShowExtraQuestions] = useState(false);
	const [extraQuestionAnswers, setExtraQuestionAnswers] = useState<number[]>([]);
	const [extraExerciseAnswers, setExtraExerciseAnswers] = useState<any>({});

	// Sync moduleId from URL to state
	useEffect(() => {
		if (moduleId) {
			const idx = parseInt(moduleId, 10) - 1;
			if (!isNaN(idx) && idx >= 0 && idx < courseModules.length) {
				setCurrentModuleIndex(idx);
			}
		}
	}, [moduleId]);

	// Update URL when module changes
	useEffect(() => {
		if (currentModuleIndex >= 0 && currentModuleIndex < courseModules.length) {
			navigate(`/course/${currentModuleIndex + 1}`, { replace: true });
		}
	}, [currentModuleIndex, courseModules.length, navigate]);

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
			setShowExtraQuestions(false);
			setExtraQuestionAnswers([]);
			setExtraExerciseAnswers({});
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
			setShowExtraQuestions(false);
			setExtraQuestionAnswers([]);
			setExtraExerciseAnswers({});
		} else {
			setIsQuizMode(true);
		}
	}

	const renderExtraQuestions = () => {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="mt-8 space-y-6"
			>
				<div className="divider">
					<span className="text-lg font-semibold">Extra Practice Questions</span>
				</div>
				
				{module2ExtraQuestions.map((question, qIndex) => (
					<div key={`extra-question-${qIndex}`} className="card bg-base-200 shadow-lg">
						<div className="card-body">
							<h4 className="text-lg font-semibold mb-4">
								Question {qIndex + 1}: {question.question}
							</h4>
							<div className="space-y-2">
								{question.options.map((option, oIndex) => {
									const answerKey = `${qIndex}-${oIndex}`;
									const isSelected = extraQuestionAnswers.includes(qIndex) && extraExerciseAnswers[qIndex] === oIndex;
									const hasAnswered = extraQuestionAnswers.includes(qIndex);
									const buttonClass = hasAnswered ? 
										(option.isCorrect ? 'btn-success' : isSelected ? 'btn-error' : 'btn-outline') : 
										'btn-outline';
									
									return (
										<button
											key={`extra-option-${qIndex}-${oIndex}`}
											className={`btn ${buttonClass} w-full justify-start`}
											onClick={() => {
												if (!extraQuestionAnswers.includes(qIndex)) {
													setExtraQuestionAnswers(prev => [...prev, qIndex]);
													setExtraExerciseAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
												}
											}}
											disabled={hasAnswered}
										>
											{String.fromCharCode(65 + oIndex)}. {option.text}
										</button>
									);
								})}
							</div>
							{extraQuestionAnswers.includes(qIndex) && (
								<motion.div 
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									className="mt-4"
								>
									<div className={`p-4 rounded-lg ${
										question.options[extraExerciseAnswers[qIndex]]?.isCorrect ? 
											'bg-success/20 text-success-content' : 
											'bg-error/20 text-error-content'
									}`}>
										{question.options[extraExerciseAnswers[qIndex]]?.isCorrect ? 
											'✅ Correct! Great job.' : 
											`❌ Incorrect. The correct answer is: ${String.fromCharCode(65 + question.options.findIndex(o => o.isCorrect))}. ${question.options.find(o => o.isCorrect)?.text}`
										}
									</div>
								</motion.div>
							)}
						</div>
					</div>
				))}
				
				<div className="text-center mt-8">
					<div className="stats shadow">
						<div className="stat">
							<div className="stat-title">Progress</div>
							<div className="stat-value text-2xl">
								{extraQuestionAnswers.length}/{module2ExtraQuestions.length}
							</div>
							<div className="stat-desc">Questions completed</div>
						</div>
						<div className="stat">
							<div className="stat-title">Score</div>
							<div className="stat-value text-2xl">
								{extraQuestionAnswers.filter(qIndex => 
									module2ExtraQuestions[qIndex].options[extraExerciseAnswers[qIndex]]?.isCorrect
								).length}/{extraQuestionAnswers.length || 1}
							</div>
							<div className="stat-desc">Correct answers</div>
						</div>
					</div>
				</div>
			</motion.div>
		);
	};

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
								<div key={typeof item === 'string' ? item : index} className="flex items-start gap-3">
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
								<div key={item.content} className="card bg-base-200 shadow">
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
							<div key={`question-${question.question}`} className="space-y-4">
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
						
						{/* Show extra questions button for Module 2 only */}
						{currentModuleIndex === 1 && !showExtraQuestions && (
							<motion.div 
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5, duration: 0.3 }}
								className="mt-8 text-center"
							>
								<div className="divider">Want more practice?</div>
								<button 
									onClick={() => setShowExtraQuestions(true)}
									className="btn btn-outline btn-lg gap-2"
								>
									<Star className="h-5 w-5" />
									Try Extra Questions
									<ArrowRight className="h-4 w-4" />
								</button>
								<p className="text-sm text-base-content/70 mt-2">
									12 additional questions to test your scam detection skills
								</p>
							</motion.div>
						)}
						
						{/* Render extra questions if enabled for Module 2 */}
						{currentModuleIndex === 1 && showExtraQuestions && renderExtraQuestions()}
						
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



	const currentModule = courseModules[currentModuleIndex] || { title: '', description: '', content: <div>Loading...</div>, exercise: { type: ExerciseType.QUIZ, question: '', options: [], correctFeedback: '', incorrectFeedback: '' } };
	const progress = (currentModuleIndex + (isExerciseMode ? 0.5 : 0)) / courseModules.length * 100;

	// Animation key: changes for every module/exercise view
	const animationKey = `${currentModuleIndex}-${isExerciseMode ? 'exercise' : 'module'}`;

	// Show certificate UI if score >= 8
	if (quizScore !== null && quizScore >= 8) {
		return (
			<FinalQuiz
				key={quizRetakeKey}
				onComplete={() => {}}
			/>
		);
	}

	if (isQuizMode) {
		return (
			<FinalQuiz
				key={quizRetakeKey}
				onComplete={score => {
					if (score >= 8) {
						setQuizScore(score);
					}
					// If score < 8, let FinalQuiz handle retake modal and reset
				}}
			/>
		);
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
					key={animationKey}
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

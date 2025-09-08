import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw, Download, Printer, User, Star } from "lucide-react";

export type FinalQuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

// Complete question bank with all 20 questions
const allQuizQuestions: FinalQuizQuestion[] = [
  {
    question: "What does being safe online mean?",
    options: [
      "Avoiding the internet completely",
      "Protecting yourself and your personal information while using the internet",
      "Only using social media",
      "Using the same password everywhere",
    ],
    correctIndex: 1,
  },
  {
    question: "Which of the following statements about reporting scams is true?",
    options: [
      "You can report internet crimes to the FBI’s Internet Crime Complaint Center (ic3.gov)",
      "You should contact your bank and the credit bureaus if you shared financial information with a scammer",
      "You should call the Social Security Administration if your SSN is compromised",
      "All of the above",
    ],
    correctIndex: 3,
  },
  {
    question: "Why should you read beyond the headline before sharing an article?",
    options: [
      "Headlines are always wrong",
      "Headlines may not tell the full story",
      "Articles are too long otherwise",
      "Headlines are usually fake",
    ],
    correctIndex: 1,
  },
  {
    question:
      "Which is a sign a website is safe for entering personal information?",
    options: [
      "It uses “https://” and shows a lock icon",
      "It loads quickly",
      "It has colorful images",
      "It asks for your credit card right away",
    ],
    correctIndex: 0,
  },
  {
    question: "Which is the best example of a strong password?",
    options: ["12345678", "MyBirthday2024", "IlWbAmF!2023", "password123"],
    correctIndex: 2,
  },
  {
    question:
      "A video shows a friend asking for money, but their lip movements don’t match the words. What should you suspect?",
    options: [
      "AI-generated deepfake",
      "Bad camera quality",
      "They’re tired",
      "It’s definitely real",
    ],
    correctIndex: 0,
  },
  {
    question: "Why is it important to install software updates?",
    options: [
      "They make your device look nicer",
      "They fix security weaknesses scammers could exploit",
      "They help you avoid spam emails",
      "They delete your old files",
    ],
    correctIndex: 1,
  },
  {
    question:
      "You get an email saying your bank account will be closed in one hour unless you click a link. What should you do?",
    options: [
      "Click the link immediately",
      "Call your bank using the number on your bank card",
      "Reply to the email for more info",
      "Forward the email to friends",
    ],
    correctIndex: 1,
  },
  {
    question: "If you think your identity has been stolen, where should you start?",
    options: [
      "Social media",
      "IdentityTheft.gov",
      "A friend’s advice",
      "The app store",
    ],
    correctIndex: 1,
  },
  {
    question:
      "What’s one benefit of freezing your credit after a scam?",
    options: [
      "It erases your debt",
      "It blocks new accounts from being opened in your name",
      "It hides your bank transactions",
      "It lowers your credit score",
    ],
    correctIndex: 1,
  },
  // Additional 10 questions
  {
    question: "What does practicing online safety involve?",
    options: [
      "Sharing your password with friends",
      "Keeping your information private and making smart choices online",
      "Clicking on pop-ups and ads to explore more content",
      "Ignoring warnings and using the internet freely",
    ],
    correctIndex: 1,
  },
  {
    question: "Why should you be careful of email addresses that look almost correct, like \"amaz0n.com\"?",
    options: [
      "They might be a new version of the company's website",
      "It's probably a scam site pretending to be the real one",
      "They usually offer better deals",
      "They're safe if the email says \"Dear Customer\"",
    ],
    correctIndex: 1,
  },
  {
    question: "Which of these tools can help you check if a story is true?",
    options: [
      "Google Translate",
      "FactCheck.org",
      "YouTube",
      "Microsoft Word",
    ],
    correctIndex: 1,
  },
  {
    question: "Is this web address (URL) trustworthy? \"bank-of-america.co\"",
    options: [
      "Yes, because it includes \"bank-of-america\"",
      "No, the \".co\" is suspicious and not the official site",
      "Yes, it looks professional enough",
      "Only if it loads without pop-ups",
    ],
    correctIndex: 1,
  },
  {
    question: "What should a strong password contain?",
    options: [
      "Only your first name",
      "A mix of letters, numbers, and special characters",
      "The word \"password\"",
      "Your birthday only",
    ],
    correctIndex: 1,
  },
  {
    question: "You find a blog post that repeats the same idea over and over in slightly different ways. This is likely:",
    options: [
      "AI",
      "Real",
    ],
    correctIndex: 0,
  },
  {
    question: "Which of the following is a good online safety habit?",
    options: [
      "Installing apps from random websites",
      "Sharing your password with a trusted friend",
      "Hovering over links to check them before clicking",
      "Using the same password for multiple accounts",
    ],
    correctIndex: 2,
  },
  {
    question: "Which action helps protect your devices and personal information online?",
    options: [
      "Clicking on pop-ups that say you've won a prize",
      "Using antivirus software",
      "Keeping unused apps on your phone forever",
      "Ignoring privacy settings on social media",
    ],
    correctIndex: 1,
  },
  {
    question: "What is the main purpose of freezing your credit?",
    options: [
      "To stop new accounts from being opened in your name",
      "To erase your past credit history",
      "To improve your credit score quickly",
      "To close all your current accounts",
    ],
    correctIndex: 0,
  },
  {
    question: "If you suspect you've fallen for an online scam, which of the following is a good first step?",
    options: [
      "Post about it on social media to warn friends",
      "Change your phone number immediately",
      "Delete all your emails to avoid future scams",
      "Report it to the Federal Trade Commission (FTC) at ReportFraud.ftc.gov",
    ],
    correctIndex: 3,
  },
];

// Split into two sets of 10 questions each
const firstSet: FinalQuizQuestion[] = allQuizQuestions.slice(0, 10);
const secondSet: FinalQuizQuestion[] = allQuizQuestions.slice(10, 20);

// Function to randomly select one of the two sets
const getRandomQuestions = (): FinalQuizQuestion[] => {
  // Randomly choose between first set or second set
  return Math.random() < 0.5 ? firstSet : secondSet;
};

const FinalQuiz: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  // Generate random questions only once when component mounts
  const [finalQuizQuestions, setFinalQuizQuestions] = useState<FinalQuizQuestion[]>(() => getRandomQuestions());
  const [answers, setAnswers] = useState<(number | null)[]>(Array(finalQuizQuestions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRetakeModal, setShowRetakeModal] = useState(false);
  const [certificateName, setCertificateName] = useState("");
  const [generatedCertificate, setGeneratedCertificate] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Certificate generation function
  const generateCertificate = useCallback(async (name: string) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match certificate image
    canvas.width = 1200;
    canvas.height = 900;

    // Load the certificate background image
    const img = new Image();
    img.onload = () => {
      // Draw the certificate background
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Configure text styles for the name (use Pacifico if loaded, fallback to serif)
  // Use a slightly smaller font and alphabetic baseline so the text sits on/above the NAME line
  ctx.font = 'bold 42px Pacifico, serif';
  ctx.fillStyle = '#2c3e50';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Add a subtle shadow effect for better contrast on the background
  ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
  ctx.shadowBlur = 3;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  // Draw the name aligned with the NAME underline: tuned to sit just above it
  const centerX = canvas.width / 2;
  const nameY = canvas.height * 0.545; // tuned down from 0.47 to sit closer to the underline
  ctx.fillText(name, centerX, nameY);

  // Draw the current date in the lower-left above the 'DATE' label
  ctx.font = 'italic 26px serif';
  ctx.fillStyle = '#34495e';
  ctx.textAlign = 'left';
  // Use alphabetic baseline so numbers sit nicely on the printed DATE underline
  ctx.textBaseline = 'alphabetic';
  // Use a clearer date format and position it relative to canvas size so it lines up
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  // Position relative to canvas width/height so it scales correctly across resolutions
  const dateX = Math.round(canvas.width * 0.22); // ~22% from the left edge
  const dateY = Math.round(canvas.height * 0.76); // ~76% down the canvas (above the DATE underline)
  ctx.fillText(dateStr, dateX, dateY);

      // Generate the final certificate as data URL
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      setGeneratedCertificate(dataUrl);
    };

    img.src = '/FinalCertificate.png';
  }, []);

  // Download certificate function
  const downloadCertificate = useCallback(() => {
    if (!generatedCertificate) return;
    
    const link = document.createElement('a');
    link.download = `${certificateName || 'Certificate'}_Trusty_Course_Completion.png`;
    link.href = generatedCertificate;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedCertificate, certificateName]);

  // Print certificate function
  const printCertificate = useCallback(() => {
    if (!generatedCertificate) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.title = `Certificate - ${certificateName}`;
    printWindow.document.head.innerHTML = `
      <style>
        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        img { max-width: 100%; height: auto; }
        @media print { body { margin: 0; } img { width: 100%; } }
      </style>
    `;
    printWindow.document.body.innerHTML = `
      <img src="${generatedCertificate}" alt="Certificate" />
    `;
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }, [generatedCertificate, certificateName]);

  React.useEffect(() => {
    const score = answers.filter((a, i) => a === finalQuizQuestions[i].correctIndex).length;
    if (submitted && score >= 8) {
      // Dynamically load Pacifico font for signature
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      return () => { document.head.removeChild(link); };
    }
  }, [submitted, answers]);

  const progress = (answers.filter(a => a !== null).length / finalQuizQuestions.length) * 100;
  const allAnswered = answers.every(a => a !== null);

  const handleSelect = (qIdx: number, optIdx: number) => {
    setAnswers(prev => {
      const copy = [...prev];
      copy[qIdx] = optIdx;
      return copy;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowModal(true);
    scrollToTop();
    const score = answers.filter((a, i) => a === finalQuizQuestions[i].correctIndex).length;
    onComplete(score);
  };

  if (submitted) {
    const score = answers.filter((a, i) => a === finalQuizQuestions[i].correctIndex).length;
    const passed = score >= 8;
    return (
      <>
        {/* Modal Popup for Score and Cutoff */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="modal modal-open">
              <div className="modal-box p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">Quiz Submitted</h2>
                <div className="text-lg mb-2">Minimum score to pass: <span className="font-bold">8 / 10</span></div>
                <div className="text-xl mb-4">Your score: <span className={passed ? 'text-success' : 'text-error'}>{score} / 10</span></div>
                {passed ? (
                  <div className="text-success font-semibold mb-2">You passed! 🎉</div>
                ) : (
                  <div className="text-error font-semibold mb-2">You did not reach the cutoff.</div>
                )}
                <button className="btn btn-primary mt-4" onClick={() => {
                  setShowModal(false);
                  scrollToTop();
                }}>
                  {passed ? 'View Certificate & Answers' : 'Review Answers'}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Retake Modal for failed attempts */}
        {showRetakeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="modal modal-open">
              <div className="modal-box p-8 text-center">
                <h2 className="text-2xl font-bold mb-4 text-error">Retake Required</h2>
                <div className="text-lg mb-2">You answered <span className="font-bold text-error">{score} / 10</span> correctly.</div>
                <div className="mb-4">You need at least <span className="font-bold">8 / 10</span> to pass. Please review your answers and try again.</div>
                <button className="btn btn-primary" onClick={() => {
                  // Generate new random questions for retake
                  const newQuestions = getRandomQuestions();
                  setFinalQuizQuestions(newQuestions);
                  setAnswers(Array(newQuestions.length).fill(null));
                  setSubmitted(false);
                  setShowRetakeModal(false);
                  setShowModal(false);
                  scrollToTop();
                }}>
                  Retake Quiz <RotateCcw />
                </button>
              </div>
            </div>
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card bg-base-100 shadow-xl p-8"
        >
          <h2 className="text-4xl font-bold mb-4 text-center">Final Quiz Results</h2>
          <div className="text-2xl mb-6 text-center">Score: {score} / {finalQuizQuestions.length}</div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Review Your Answers:</h3>
            <div className="space-y-4">
              {finalQuizQuestions.map((q, idx) => {
                const userAnswer = answers[idx];
                const isCorrect = userAnswer === q.correctIndex;
                return (
                  <div key={q.question} className={`p-4 rounded ${isCorrect ? 'bg-success/10' : 'bg-error/10'}`}>
                    <div className="font-semibold mb-1">Question {idx + 1}: {q.question}</div>
                    <div className="mb-1">
                      <span className="font-medium">Your answer: </span>
                      <span className={isCorrect ? 'text-success' : 'text-error'}>
                        {userAnswer !== null ? q.options[userAnswer] : <span className="italic">No answer</span>}
                      </span>
                    </div>
                    {/* Do NOT show correct answer if user was wrong */}
                    {!isCorrect && (
                      <div className="text-sm text-error font-medium">Incorrect</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-center">
            {passed ? (
              <div className="max-w-2xl mx-auto mb-12">
                {/* Hidden canvas for certificate generation */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                
                {!generatedCertificate ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-4 border-primary rounded-xl bg-base-100 p-8 shadow-lg"
                  >
                    <div className="text-center mb-6">
                      <div className="mb-4">
                        <Star className="w-16 h-16 text-warning mx-auto" />
                      </div>
                      <h3 className="text-3xl font-bold text-primary mb-2">🎉 Congratulations!</h3>
                      <p className="text-lg mb-4">You've successfully completed the Trusty Online Safety Course!</p>
                      <p className="text-base text-base-content/70 mb-6">
                        Enter your name below to generate your personalized certificate of completion.
                      </p>
                    </div>
                    
                    <div className="form-control w-full max-w-md mx-auto">
                      <label className="label" htmlFor="certificate-name">
                        <span className="label-text font-medium flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Your Full Name
                        </span>
                      </label>
                      <input
                        id="certificate-name"
                        type="text"
                        placeholder="Enter your full name"
                        className="input input-bordered input-primary w-full text-center text-lg"
                        value={certificateName}
                        onChange={(e) => setCertificateName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && certificateName.trim()) {
                            generateCertificate(certificateName.trim());
                          }
                        }}
                      />
                      <button
                        className="btn btn-primary mt-4"
                        onClick={() => generateCertificate(certificateName.trim())}
                        disabled={!certificateName.trim()}
                      >
                        Generate Certificate
                        <Star className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border-4 border-primary rounded-xl bg-base-100 p-8 shadow-lg"
                  >
                    <h3 className="text-3xl font-bold text-primary mb-6 text-center">Your Certificate</h3>
                    
                    {/* Certificate Preview */}
                    <div className="mb-6 rounded-lg overflow-hidden shadow-xl">
                      <img 
                        src={generatedCertificate} 
                        alt="Certificate of Completion"
                        className="w-full h-auto"
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={downloadCertificate}
                        className="btn btn-success flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Certificate
                      </button>
                      <button
                        onClick={printCertificate}
                        className="btn btn-outline btn-primary flex items-center gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        Print Certificate
                      </button>
                      <button
                        onClick={() => {
                          setGeneratedCertificate(null);
                          setCertificateName("");
                        }}
                        className="btn btn-ghost flex items-center gap-2"
                      >
                        Generate New
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="mt-6">
                <h3 className="text-2xl font-bold text-error mb-2">Try Again</h3>
                <p className="text-lg mb-4">You need at least 8/10 to pass. Review the questions you missed and try again!</p>
                <button className="btn btn-primary btn-lg" onClick={() => {
                  setShowRetakeModal(true);
                  setShowModal(false);
                  scrollToTop();
                }}>
                  Retake Quiz <RotateCcw />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-4">Final Quiz</h2>
      <progress className="progress progress-primary w-full mb-8" value={progress} max="100"></progress>
      <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        <div className="space-y-8">
          {finalQuizQuestions.map((q, qIdx) => (
            <div key={q.question} className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="text-xl font-semibold mb-2">Question {qIdx + 1}: {q.question}</h3>
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[qIdx] === oIdx;
                    return (
                      <button
                        type="button"
                        key={opt}
                        className={`btn w-full justify-start ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleSelect(qIdx, oIdx)}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button
            type="submit"
            className="btn btn-success btn-lg"
            disabled={!allAnswered}
          >
            Submit Quiz
            <ArrowRight />
          </button>
          {!allAnswered && (
            <div className="mt-2 text-error text-sm">Please answer all questions before submitting.</div>
          )}
        </div>
      </form>
    </div>
  );
};

export default FinalQuiz;

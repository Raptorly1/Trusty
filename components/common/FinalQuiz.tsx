import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw, Star } from "lucide-react";

export type FinalQuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

const finalQuizQuestions: FinalQuizQuestion[] = [
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
    question:
      "A caller says you must pay the IRS immediately with a gift card or be arrested. What should you do?",
    options: [
      "Pay quickly to avoid trouble",
      "Hang up and call the IRS using the official number",
      "Ask for more details",
      "Give them your bank account",
    ],
    correctIndex: 1,
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
];

const FinalQuiz: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(finalQuizQuestions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRetakeModal, setShowRetakeModal] = useState(false);
  const [certificateName, setCertificateName] = useState("");

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
                <button className="btn btn-primary mt-4" onClick={() => setShowModal(false)}>
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
                  setAnswers(Array(finalQuizQuestions.length).fill(null));
                  setSubmitted(false);
                  setShowRetakeModal(false);
                  setShowModal(false);
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
                    <div className="font-semibold mb-1">Q{idx + 1}: {q.question}</div>
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
                <div className="border-4 border-primary rounded-xl bg-base-100 p-8 shadow-lg relative">
                  <div className="absolute top-4 right-4">
                    <Star className="w-10 h-10 text-warning" />
                  </div>
                  <h2 className="text-4xl font-bold text-center mb-2">Digital Safety Certificate</h2>
                  <p className="text-lg text-center mb-6">This certifies that</p>
                  <div className="flex flex-col items-center mb-6">
                    <input
                      type="text"
                      value={certificateName}
                      onChange={e => setCertificateName(e.target.value)}
                      placeholder="Enter your name"
                      className="input input-bordered text-center text-2xl font-semibold mb-2 w-64"
                      style={{ fontFamily: 'Pacifico, cursive' }}
                      aria-label="Your Name"
                    />
                    <span className="text-base-content/70 text-sm">Your name will appear below in signature style</span>
                  </div>
                  <div className="mt-8 mb-4 text-center">
                    <span className="block text-lg mb-2">has successfully completed the</span>
                    <span className="block text-2xl font-bold mb-2">Trusty-powered Digital Safety Course</span>
                    <span className="block text-base-content/70 mb-2">Date: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="mt-8 flex flex-col items-center">
                    <span className="text-lg mb-2">Signature:</span>
                    <span
                      className="text-3xl text-primary mt-2"
                      style={{ fontFamily: 'Pacifico, cursive', minHeight: '2.5rem' }}
                    >
                      {certificateName || <span className="text-base-content/40">Your Name</span>}
                    </span>
                  </div>
                  <div className="mt-8 text-center">
                    <span className="badge badge-success badge-lg">Certificate Awarded</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <h3 className="text-2xl font-bold text-error mb-2">Try Again</h3>
                <p className="text-lg mb-4">You need at least 8/10 to pass. Review the questions you missed and try again!</p>
                <button className="btn btn-primary btn-lg" onClick={() => {
                  setShowRetakeModal(true);
                  setShowModal(false);
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
                <h3 className="text-xl font-semibold mb-2">Q{qIdx + 1}: {q.question}</h3>
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

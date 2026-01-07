import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowRight, RotateCcw, Star } from "lucide-react";

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
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = finalQuizQuestions[current];
  const progress = ((current + (showFeedback ? 1 : 0)) / finalQuizQuestions.length) * 100;

  const handleSelect = (idx: number) => {
    setSelected(idx);
    setShowFeedback(true);
    setAnswers((prev) => {
      const copy = [...prev];
      copy[current] = idx;
      return copy;
    });
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelected(null);
    if (current < finalQuizQuestions.length - 1) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
      const score = answers.filter((a, i) => a === finalQuizQuestions[i].correctIndex).length;
      onComplete(score);
    }
  };

  if (finished) {
    const score = answers.filter((a, i) => a === finalQuizQuestions[i].correctIndex).length;
    const passed = score >= 8;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card bg-base-100 shadow-xl p-8 text-center"
      >
        <h2 className="text-4xl font-bold mb-4">Final Quiz Results</h2>
        <div className="text-2xl mb-2">Score: {score} / {finalQuizQuestions.length}</div>
        {passed ? (
          <div className="mt-6">
            <Star className="w-12 h-12 text-warning mx-auto mb-2" />
            <h3 className="text-3xl font-bold text-success mb-2">Congratulations!</h3>
            <p className="text-lg mb-4">You’ve earned your Trusty-powered Digital Safety Certificate.</p>
            <div className="badge badge-success badge-lg mb-4">Certificate Awarded</div>
          </div>
        ) : (
          <div className="mt-6">
            <h3 className="text-2xl font-bold text-error mb-2">Try Again</h3>
            <p className="text-lg mb-4">You need at least 8/10 to pass. Review the modules and try again!</p>
            <button className="btn btn-primary btn-lg" onClick={() => {
              setCurrent(0);
              setAnswers([]);
              setFinished(false);
              setShowFeedback(false);
              setSelected(null);
            }}>
              Retake Quiz <RotateCcw />
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-4">Final Quiz</h2>
      <progress className="progress progress-primary w-full mb-8" value={progress} max="100"></progress>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className="card bg-base-100 shadow-xl"
        >
          <div className="card-body p-8">
            <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
            <div className="space-y-2 mb-4">
              {question.options.map((opt, idx) => {
                const isSelected = selected === idx;
                let btnClass = "btn btn-outline w-full justify-start";
                if (showFeedback && isSelected) {
                  btnClass =
                    idx === question.correctIndex
                      ? "btn btn-success w-full justify-start"
                      : "btn btn-error w-full justify-start";
                }
                return (
                  <button
                    key={opt}
                    className={btnClass}
                    disabled={showFeedback}
                    onClick={() => handleSelect(idx)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {showFeedback && (
              <div className={`mt-4 p-4 rounded ${selected === question.correctIndex ? "bg-success/20 text-success-content" : "bg-error/20 text-error-content"}`}>
                {selected === question.correctIndex ? (
                  <span>
                    <CheckCircle className="inline-block w-5 h-5 mr-2" /> Correct! Well done.
                  </span>
                ) : (
                  <span>
                    Incorrect. The correct answer is: <b>{question.options[question.correctIndex]}</b>
                  </span>
                )}
              </div>
            )}
            {showFeedback && (
              <div className="card-actions justify-end mt-8">
                <button className="btn btn-primary btn-lg" onClick={handleNext}>
                  {current < finalQuizQuestions.length - 1 ? "Next Question" : "See Results"}
                  <ArrowRight />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FinalQuiz;

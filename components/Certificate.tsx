
import React, { useState } from 'react';
import { GraduationCap, Printer, Refresh, Sparkles } from './Icons';

interface CertificateProps {
  score: number;
  total: number;
  onRestart: () => void;
}

const Certificate: React.FC<CertificateProps> = ({ score, total, onRestart }) => {
  const [name, setName] = useState('');
  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 80;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="printable-area bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12 text-center">
            {passed ? (
                <>
                    <Sparkles className="h-16 w-16 mx-auto text-amber-500 mb-4" />
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Congratulations!</h2>
                    <p className="mt-2 text-lg text-slate-600">You've successfully completed the course.</p>
                    <p className="mt-1 text-xl font-semibold text-emerald-600">Your Score: {score}/{total} ({percentage}%)</p>

                    <div className="my-10 border-t-2 border-b-2 border-slate-200 py-8">
                        <p className="text-base font-semibold text-blue-600 uppercase tracking-widest">Certificate of Completion</p>
                        <p className="mt-4 text-lg text-slate-700">This certificate is awarded to</p>
                        
                        <div className="my-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter Your Name Here"
                                className="text-3xl font-bold text-slate-800 text-center w-full max-w-md mx-auto p-2 border-b-2 border-slate-300 focus:border-blue-500 focus:outline-none bg-transparent"
                            />
                        </div>

                        <p className="mt-4 text-lg text-slate-700">for completing the</p>
                        <h3 className="mt-2 text-2xl font-bold text-slate-900">TRUSTY Digital Safety Course</h3>
                    </div>

                     <div className="flex justify-center items-center gap-2 text-slate-500">
                        <GraduationCap className="h-6 w-6" />
                        <span className="font-semibold">A Commitment to Online Safety</span>
                    </div>

                </>
            ) : (
                 <>
                    <Refresh className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Keep Practicing!</h2>
                    <p className="mt-2 text-lg text-slate-600">You're on the right track. A little more review will make a big difference.</p>
                    <p className="mt-2 text-xl font-semibold text-amber-600">Your Score: {score}/{total} ({percentage}%)</p>
                    <p className="mt-4 text-lg text-slate-700 max-w-md mx-auto">We recommend a score of 80% or higher. Don't worry, you can restart the course and try the quiz again anytime.</p>
                 </>
            )}
        </div>
        
        <div className="no-print mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
                onClick={onRestart}
                className="group inline-flex items-center justify-center gap-3 bg-blue-600 text-white font-bold text-lg py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
                <Refresh className="h-5 w-5" />
                {passed ? 'Start Over' : 'Try Again'}
            </button>
            {passed && (
                 <button
                    onClick={() => window.print()}
                    disabled={!name}
                    className="group inline-flex items-center justify-center gap-3 bg-slate-700 text-white font-bold text-lg py-3 px-6 rounded-full shadow-lg hover:bg-slate-800 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-400 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    <Printer className="h-5 w-5" />
                    Print Certificate
                </button>
            )}
        </div>
        {!name && passed && <p className="no-print text-center text-sm text-slate-500 mt-4">Enter your name to enable printing.</p>}
    </div>
  );
};

export default Certificate;

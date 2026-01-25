
import React from 'react';
import { ArrowRight, GraduationCap, Sparkles } from './Icons';

interface HomepageProps {
  onStartCourse: () => void;
  onGoToAIChecker: () => void;
  onGoToTeacherFeedback: () => void;
}

const Homepage: React.FC<HomepageProps> = ({ onStartCourse, onGoToAIChecker, onGoToTeacherFeedback }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto text-center">
        <div className="flex justify-center items-center gap-4 mb-6">
            <GraduationCap className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">TRUSTY</h1>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">Why Trust Matters Online</h2>


        {/* Clara's Story */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-left max-w-2xl mx-auto mb-8">
          <p className="text-lg text-slate-700 leading-relaxed mb-2">
            <span className="font-semibold text-slate-900">Story from Clara, 72</span>
          </p>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            “One morning, I got an email that looked like it came from my bank. It asked me to click a link and update my information.<br /><br />
            It looked real, but something felt a little off. So I showed it to my son, Mason. He told me it was a scam, and I’m glad I didn’t click it.<br /><br />
            That’s when I realized: the internet is helpful, but it’s also important to be careful. I wanted to learn more, and that’s how I found Trusty.”
          </p>
        </div>

        {/* Why Trusty Matters */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl max-w-3xl mx-auto mb-8">
          <h3 className="text-2xl font-bold text-blue-800 mb-3">Why Trusty Matters</h3>
          <ul className="list-disc pl-6 text-lg text-blue-900 space-y-2">
            <li><span className="font-semibold">1 in 4 older adults</span> gets targeted by an online scam every year</li>
            <li><span className="font-semibold">In 2023, seniors lost over $3 billion</span> to fraud</li>
            <li>With AI, fake websites, and scam calls, it’s getting harder to tell what’s real</li>
          </ul>
          <p className="mt-4 text-blue-900 text-lg">
            But don’t worry! You don’t need to be a tech expert. <span className="font-semibold">Trusty will guide you, one simple step at a time.</span> Trusty is always here for you, trust.
          </p>
        </div>

        {/* What You'll Learn */}
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl max-w-3xl mx-auto mb-8">
          <h3 className="text-2xl font-bold text-amber-800 mb-3">What you’ll learn</h3>
          <ul className="list-disc pl-6 text-lg text-amber-900 space-y-2">
            <li>How to recognize online scams</li>
            <li>How to spot fake news and photos</li>
            <li>How to browse the internet safely</li>
            <li>Where to go for help if something seems suspicious</li>
          </ul>
          <p className="mt-4 text-amber-900 text-lg">
            And all explained in a calm, friendly way, with big text, short lessons, and helpful examples!
          </p>
        </div>

        {/* Clara's Testimonial */}
        <div className="max-w-2xl mx-auto mb-8">
          <blockquote className="italic text-xl text-slate-700 border-l-4 border-blue-400 pl-4">
            “I feel more confident now. And I know Trusty will always be by my side.”<br />
            <span className="block mt-2 font-semibold text-slate-800">— Clara, Trusty user</span>
          </blockquote>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <p className="text-xl text-slate-800 font-bold mb-2">Ready to begin? —&gt; start the course!</p>
          <button 
            onClick={onStartCourse}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-blue-600 text-white font-bold text-xl py-4 px-10 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Start Learning
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
          </button>
          <button 
            onClick={onGoToAIChecker}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-blue-600 font-bold text-lg py-3 px-8 rounded-full shadow-md border border-blue-200 hover:bg-blue-50 hover:border-blue-400 transition-all focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <Sparkles className="h-6 w-6 text-blue-500 transition-transform group-hover:scale-110" />
            Try our AI Text Checker
          </button>
          <button 
            onClick={onGoToTeacherFeedback}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-green-600 text-white font-bold text-lg py-3 px-8 rounded-full shadow-md hover:bg-green-700 transition-all focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            Feedback Tool (includes AI Detection)
          </button>
        </div>

        {/* Curriculum Overview */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 max-w-3xl mx-auto mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Curriculum Overview: TRUSTY Digital Safety Course</h3>
          <ol className="list-decimal pl-6 text-lg text-slate-800 space-y-1">
            <li>Module 1: The Basics</li>
            <li>Module 2: Common Scams Explained</li>
            <li>Module 3: Spotting Fake News & Deepfakes</li>
            <li>Module 4: Safe Browsing & Websites</li>
            <li>Module 5: Passwords & Privacy</li>
            <li>Module 6: AI & Misinformation</li>
            <li>Module 7: Cyber Hygiene Habits</li>
            <li>Module 8: Reporting & Getting Help</li>
            <li>Final Quiz & Certificate</li>
          </ol>
        </div>

        {/* ...moved call-to-action and buttons above... */}
      </div>
    </div>
  );
};

export default Homepage;
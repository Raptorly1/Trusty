import React, { useEffect } from 'react';
import FinalQuiz from '../components/common/FinalQuiz';

const FinalQuizPage: React.FC = () => {
  // Auto-scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // The FinalQuiz component expects an onComplete prop, but for direct access, we can provide a no-op.
  return (
    <div className="max-w-3xl mx-auto py-12">
      <FinalQuiz onComplete={() => {}} />
    </div>
  );
};

export default FinalQuizPage;

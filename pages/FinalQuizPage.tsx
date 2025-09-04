import React from 'react';
import FinalQuiz from '../components/common/FinalQuiz';

const FinalQuizPage: React.FC = () => {
  // The FinalQuiz component expects an onComplete prop, but for direct access, we can provide a no-op.
  return (
    <div className="max-w-3xl mx-auto py-12">
      <FinalQuiz onComplete={() => {}} />
    </div>
  );
};

export default FinalQuizPage;

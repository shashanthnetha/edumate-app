import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  topic: string; // e.g., "Python Loops"
  onClose: () => void;
}

const QuizModal = ({ isOpen, topic, onClose }: QuizModalProps) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Questions when opened
  useEffect(() => {
    if (isOpen && topic) {
      setLoading(true);
      fetch(`http://127.0.0.1:8000/get_quiz/${encodeURIComponent(topic)}`)
        .then(res => res.json())
        .then(data => {
          setQuestions(data);
          setLoading(false);
          setCurrentQIndex(0);
          setFeedback(null);
        })
        .catch(err => console.error("Failed to load quiz", err));
    }
  }, [isOpen, topic]);

  // 2. Handle Answer Click
  const handleAnswer = async (selectedOption: string) => {
    const currentQ = questions[currentQIndex];
    const isCorrect = selectedOption === currentQ.correct_option;

    setFeedback(isCorrect ? "correct" : "wrong");

    // Send data to Brain (BKT Algorithm)
    await fetch('http://127.0.0.1:8000/predict_mastery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_mastery: 0.5, is_correct: isCorrect ? 1 : 0 })
    });

    // Wait 1 second, then go to next question
    setTimeout(() => {
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setFeedback(null);
      } else {
        alert("Quiz Complete! Great job.");
        onClose();
      }
    }, 1500);
  };

  if (!isOpen) return null;

  const q = questions[currentQIndex];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 relative">
        
        {/* Header */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
        <h2 className="text-xl font-bold text-gray-800 mb-2">{topic} Quiz</h2>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-2 rounded-full mb-6">
          <div 
            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Area */}
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading Questions...</p>
        ) : q ? (
          <div>
            <p className="text-lg font-medium text-gray-700 mb-6">
              <span className="font-bold text-indigo-600 mr-2">Q{currentQIndex + 1}:</span> 
              {q.text}
            </p>

            <div className="space-y-3">
              {['A', 'B', 'C'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={feedback !== null}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center group
                    ${feedback === null ? 'border-gray-100 hover:border-indigo-600 hover:bg-indigo-50' : ''}
                    ${feedback === 'correct' && q.correct_option === opt ? 'border-green-500 bg-green-50 text-green-700' : ''}
                    ${feedback === 'wrong' && opt === (feedback ? 'wrong_selected' : '') ? 'border-red-500 bg-red-50' : ''}
                  `}
                >
                  <span className="font-medium">
                    {opt}) {q[`option_${opt.toLowerCase()}`]} 
                  </span>
                  
                  {/* Icons for Feedback */}
                  {feedback === 'correct' && q.correct_option === opt && <CheckCircle className="text-green-600" size={20} />}
                  {feedback === 'wrong' && feedback === opt && <XCircle className="text-red-600" size={20} />}
                </button>
              ))}
            </div>

            {/* Feedback Message */}
            {feedback === 'correct' && (
               <p className="text-green-600 font-bold mt-4 text-center animate-bounce">Correct! +10 XP</p>
            )}
            {feedback === 'wrong' && (
               <p className="text-red-500 font-bold mt-4 text-center">Not quite. The AI is adjusting...</p>
            )}

          </div>
        ) : (
          <p>No questions found for this topic.</p>
        )}

      </div>
    </div>
  );
};

export default QuizModal;
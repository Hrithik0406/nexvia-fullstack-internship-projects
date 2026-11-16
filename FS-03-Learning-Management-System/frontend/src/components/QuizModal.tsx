import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, HelpCircle, Award, ArrowRight } from 'lucide-react';
import { Quiz } from '../types';

interface QuizModalProps {
  quiz: Quiz | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitQuiz: (answers: { [qId: string]: number }) => Promise<{ passed: boolean; score: number }>;
  onViewCertificate: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  quiz,
  isOpen,
  onClose,
  onSubmitQuiz,
  onViewCertificate,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [submittedResult, setSubmittedResult] = useState<{ passed: boolean; score: number } | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  if (!isOpen || !quiz) return null;

  const handleSelect = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    setIsEvaluating(true);
    const result = await onSubmitQuiz(selectedAnswers);
    setIsEvaluating(false);
    setSubmittedResult(result);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isComplete = answeredCount === quiz.questions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-900">{quiz.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedResult ? (
          /* Result Card */
          <div className="text-center py-6 space-y-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                submittedResult.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
              }`}
            >
              {submittedResult.passed ? (
                <Award className="w-8 h-8" />
              ) : (
                <AlertCircle className="w-8 h-8" />
              )}
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Evaluation Score
              </span>
              <h3 className="text-4xl font-black text-slate-900 mt-1">
                {submittedResult.score}%
              </h3>
              <p
                className={`text-sm font-bold mt-1 ${
                  submittedResult.passed ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {submittedResult.passed
                  ? 'Exam Passed! You achieved certification standard.'
                  : 'Passing threshold is 70%. Review course materials and retake.'}
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
              {submittedResult.passed && (
                <button
                  onClick={() => {
                    onClose();
                    onViewCertificate();
                  }}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>View Verified Certificate</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Questions list */
          <div className="space-y-6">
            <p className="text-xs text-slate-500">
              Answer all questions below. You must achieve at least {quiz.passingScore}% to unlock your official verified certificate.
            </p>

            <div className="space-y-6">
              {quiz.questions.map((q, idx) => (
                <div key={q.id} className="space-y-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <p className="text-xs font-extrabold text-slate-900">
                    {idx + 1}. {q.question}
                  </p>

                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelect(q.id, optIdx)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-semibold'
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span>{opt}</span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-600 text-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected ? '✓' : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {answeredCount} of {quiz.questions.length} answered
              </span>

              <button
                onClick={handleSubmit}
                disabled={!isComplete || isEvaluating}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
              >
                <span>{isEvaluating ? 'Grading Answers...' : 'Submit Assessment'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

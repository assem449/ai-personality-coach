"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mbtiQuestions, type MBTIQuestion } from '@/data/mbti-questions';

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const question = mbtiQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === mbtiQuestions.length - 1;
  const allQuestionsAnswered = Object.keys(answers).length === mbtiQuestions.length;

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [question.dimension]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < mbtiQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    if (!allQuestionsAnswered) {
      setError('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to dashboard with success
        router.push('/dashboard?quiz=completed&type=' + data.mbtiType);
      } else {
        setError(data.error || 'Failed to submit quiz');
      }
    } catch (error) {
      console.error('Quiz submission error:', error);
      setError('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / mbtiQuestions.length) * 100;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-pink-300">
      <div className="text-center p-8 rounded-lg shadow-lg bg-white/80 max-w-2xl w-full mx-4">
        <h1 className="text-3xl font-bold mb-6 text-pink-700">MBTI Personality Quiz</h1>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {mbtiQuestions.length}</span>
            <span>{Math.round(getProgressPercentage())}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            {question.question}
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={() => handleAnswer(question.optionA.value)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                answers[question.dimension] === question.optionA.value
                  ? 'border-pink-500 bg-pink-50 text-pink-700'
                  : 'border-gray-300 hover:border-pink-300 hover:bg-pink-50'
              }`}
            >
              <span className="font-medium">A)</span> {question.optionA.text}
            </button>
            
            <button
              onClick={() => handleAnswer(question.optionB.value)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                answers[question.dimension] === question.optionB.value
                  ? 'border-pink-500 bg-pink-50 text-pink-700'
                  : 'border-gray-300 hover:border-pink-300 hover:bg-pink-50'
              }`}
            >
              <span className="font-medium">B)</span> {question.optionB.text}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className={`px-6 py-2 rounded transition ${
              currentQuestion === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={submitQuiz}
              disabled={!allQuestionsAnswered || isSubmitting}
              className={`px-6 py-2 rounded transition ${
                !allQuestionsAnswered || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-pink-600 text-white hover:bg-pink-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={!answers[question.dimension]}
              className={`px-6 py-2 rounded transition ${
                !answers[question.dimension]
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-pink-600 text-white hover:bg-pink-700'
              }`}
            >
              Next
            </button>
          )}
        </div>

        {/* Home Link */}
        <div className="mt-8">
          <a 
            href="/"
            className="text-pink-600 hover:text-pink-700 underline"
          >
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
} 
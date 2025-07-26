'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { mbtiQuestions } from '@/data/mbti-questions';
import MBTIInsights from '@/components/MBTIInsights';

const getDimensionName = (value: string): string => {
  switch (value) {
    case 'E': return 'Extraversion';
    case 'I': return 'Introversion';
    case 'S': return 'Sensing';
    case 'N': return 'Intuition';
    case 'T': return 'Thinking';
    case 'F': return 'Feeling';
    case 'J': return 'Judging';
    case 'P': return 'Perceiving';
    default: return 'Unknown';
  }
};

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingResult, setHasExistingResult] = useState(false);
  const [existingMBTI, setExistingMBTI] = useState<string>('');

  const progress = ((currentQuestion + 1) / mbtiQuestions.length) * 100;

  useEffect(() => {
    checkExistingMBTI();
  }, []);

  const checkExistingMBTI = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/mbti');
      const data = await response.json();

      if (data.success && data.hasProfile) {
        setHasExistingResult(true);
        setExistingMBTI(data.mbtiType);
      } else {
        setHasExistingResult(false);
      }
    } catch (error) {
      console.error('Error checking MBTI profile:', error);
      setHasExistingResult(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetakeQuiz = () => {
    setHasExistingResult(false);
    setCurrentQuestion(0);
    setAnswers({});
    setError('');
  };

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId.toString()]: answer
    }));
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < mbtiQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      }
    }, 300);
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < mbtiQuestions.length) {
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
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/quiz/result?completed=true');
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-teal-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-lg text-slate-600">Loading your personality assessment...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show existing MBTI insights if user already has results
  if (hasExistingResult && existingMBTI) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-teal-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Your Personality Insights
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover personalized recommendations and insights based on your MBTI type
            </p>
          </div>

          <MBTIInsights mbtiType={existingMBTI} onRetake={handleRetakeQuiz} />
        </div>
      </div>
    );
  }

  // Show quiz form if no existing results
  const currentQ = mbtiQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-teal-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Personality Assessment
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover your unique personality type with our scientifically-backed MBTI assessment. 
            Answer honestly - there are no right or wrong answers!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Question {currentQuestion + 1} of {mbtiQuestions.length}
            </span>
            <span className="text-sm font-medium text-slate-700">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl text-slate-900 mb-4">
              {currentQ.question}
            </CardTitle>
            <CardDescription className="text-lg">
              Choose the option that best describes you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Option A */}
              <button
                onClick={() => handleAnswer(currentQ.id, currentQ.optionA.value)}
                className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left group hover:shadow-md ${
                  answers[currentQ.id.toString()] === currentQ.optionA.value
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                    answers[currentQ.id.toString()] === currentQ.optionA.value
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-slate-300 group-hover:border-indigo-400'
                  }`}>
                    {answers[currentQ.id.toString()] === currentQ.optionA.value && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-900 mb-2">
                      {currentQ.optionA.text}
                    </p>
                    <p className="text-sm text-slate-600">
                      This choice indicates a preference for {getDimensionName(currentQ.optionA.value)}
                    </p>
                  </div>
                </div>
              </button>

              {/* Option B */}
              <button
                onClick={() => handleAnswer(currentQ.id, currentQ.optionB.value)}
                className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left group hover:shadow-md ${
                  answers[currentQ.id.toString()] === currentQ.optionB.value
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                    answers[currentQ.id.toString()] === currentQ.optionB.value
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-slate-300 group-hover:border-indigo-400'
                  }`}>
                    {answers[currentQ.id.toString()] === currentQ.optionB.value && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-900 mb-2">
                      {currentQ.optionB.text}
                    </p>
                    <p className="text-sm text-slate-600">
                      This choice indicates a preference for {getDimensionName(currentQ.optionB.value)}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="px-6"
          >
            Previous
          </Button>

          <div className="flex space-x-2">
            {mbtiQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentQuestion
                    ? 'bg-indigo-600'
                    : answers[index.toString()]
                    ? 'bg-indigo-300'
                    : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={() => setCurrentQuestion(prev => Math.min(mbtiQuestions.length - 1, prev + 1))}
            disabled={currentQuestion === mbtiQuestions.length - 1}
            className="px-6"
          >
            Next
          </Button>
        </div>

        {/* Submit Section */}
        {currentQuestion === mbtiQuestions.length - 1 && (
          <Card className="mt-8 border-indigo-200 bg-indigo-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Ready to Discover Your Type?
                </h3>
                <p className="text-slate-600 mb-6">
                  You've answered all questions. Click below to get your personalized MBTI results.
                </p>
                {error && (
                  <p className="text-red-600 mb-4">{error}</p>
                )}
                <Button
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  size="lg"
                  variant="gradient"
                  className="px-8 py-4 text-lg"
                >
                  {isSubmitting ? 'Analyzing...' : 'Get My Results'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back to Home */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-slate-600 hover:text-slate-900 underline transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
} 
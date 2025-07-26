'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import MBTIResult from '@/components/MBTIResult';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function QuizResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Check if user just completed the quiz
    const completed = searchParams.get('completed');
    if (completed === 'true') {
      setShowResult(true);
    }
  }, [searchParams]);

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleTakeQuizAgain = () => {
    router.push('/quiz');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-teal-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Your Personality Assessment Results
            </h1>
            <p className="text-lg text-slate-600">
              Discover your unique personality type and what it means for you
            </p>
          </div>

          {/* MBTI Result */}
          <div className="mb-8">
            <MBTIResult onRetake={handleTakeQuizAgain} showRetakeButton={true} />
          </div>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">What's Next?</CardTitle>
              <CardDescription>
                Explore your personality insights and start your growth journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Start Journaling</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Reflect on your day and track your mood patterns
                  </p>
                  <Button 
                    onClick={() => router.push('/journal')} 
                    variant="outline" 
                    size="sm"
                  >
                    Begin Journaling
                  </Button>
                </div>

                <div className="text-center p-6 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-all duration-200">
                  <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✅</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Track Habits</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Build positive habits tailored to your personality
                  </p>
                  <Button 
                    onClick={() => router.push('/habits')} 
                    variant="outline" 
                    size="sm"
                  >
                    Start Tracking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              onClick={handleGoToDashboard} 
              size="lg" 
              variant="gradient"
              className="px-8 py-4 text-lg"
            >
              Go to Dashboard
            </Button>
            <Button 
              onClick={() => router.push('/')} 
              size="lg" 
              variant="outline"
              className="px-8 py-4 text-lg"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 
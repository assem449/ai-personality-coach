'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import SentimentChart from '@/components/SentimentChart';
import ProtectedRoute from '@/components/ProtectedRoute';
import MBTIResult from '@/components/MBTIResult';
import { useAuth } from '@/hooks/useAuth';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  mbtiType?: string;
  mbtiConfidence?: number;
  mbtiAssessmentDate?: string;
  hasMBTIProfile: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();

      if (data.success) {
        setUserProfile(data);
      } else {
        setError(data.error || 'Failed to load user profile');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setError('Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakeQuiz = () => {
    router.push('/quiz');
  };

  const dashboardContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                onClick={loadUserProfile}
                variant="outline"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (!userProfile) {
      return (
        <div className="text-center">
          <p className="text-slate-600">No user profile found.</p>
        </div>
      );
    }

    return (
      <>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
            Welcome back {userProfile.name}! 👋
          </h1>
          <p className="text-xl text-slate-600">
            Your personalized dashboard with insights and recommendations
          </p>
        </div>

        {/* MBTI Profile Section */}
        <div className="mb-8">
          <MBTIResult onRetake={handleTakeQuiz} showRetakeButton={false} />
        </div>

        {/* Sentiment Chart Section - Only show if MBTI profile exists */}
        {userProfile.hasMBTIProfile && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <span className="text-3xl mr-3">📊</span>
                  Your Journal Insights
                </CardTitle>
                <CardDescription>
                  Track your mood and motivation patterns over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SentimentChart />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Quick Actions</CardTitle>
              <CardDescription>
                Access your tools and features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <a
                  href="/journal"
                  className="group flex items-center p-6 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mr-4 group-hover:bg-indigo-200 transition-colors">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Journal Entry</div>
                    <div className="text-sm text-slate-600">Write today's reflection</div>
                  </div>
                </a>
                <a
                  href="/habits"
                  className="group flex items-center p-6 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mr-4 group-hover:bg-teal-200 transition-colors">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Habit Tracker</div>
                    <div className="text-sm text-slate-600">Track your daily habits</div>
                  </div>
                </a>
                {userProfile.hasMBTIProfile && (
                  <a
                    href="/recommendations"
                    className="group flex items-center p-6 border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                  >
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                      <span className="text-2xl">✨</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Personalized Insights</div>
                      <div className="text-sm text-slate-600">Get AI-powered recommendations</div>
                    </div>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 underline transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
        </div>
      </>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-teal-50">
        <div className="container mx-auto px-4 py-8">
          {dashboardContent()}
        </div>
      </div>
    </ProtectedRoute>
  );
} 
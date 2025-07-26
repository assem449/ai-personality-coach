'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import SentimentChart from '@/components/SentimentChart';
import DashboardRecommendations from '@/components/DashboardRecommendations';

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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();

      if (data.success) {
        setUserProfile(data);
        
        // Simple protection: redirect to quiz if no MBTI profile
        if (!data.hasMBTIProfile) {
          // Don't redirect immediately, let user see the dashboard with quiz prompt
          console.log('No MBTI profile found - showing quiz prompt');
        }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-teal-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-teal-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Dashboard</h1>
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
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-teal-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Dashboard</h1>
            <p className="text-slate-600">No user profile found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
            Welcome back, {userProfile.name}! 👋
          </h1>
          <p className="text-xl text-slate-600">
            Your personalized dashboard with insights and recommendations
          </p>
        </div>

        {/* MBTI Profile Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <span className="text-3xl mr-3">🧠</span>
                Your MBTI Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userProfile.hasMBTIProfile ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">
                      {userProfile.mbtiType}
                    </div>
                    <div className="text-sm text-slate-600">Personality Type</div>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200">
                    <div className="text-4xl font-bold text-teal-600 mb-2">
                      {userProfile.mbtiConfidence}%
                    </div>
                    <div className="text-sm text-slate-600">Assessment Confidence</div>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200">
                    <div className="text-lg font-semibold text-slate-800 mb-2">
                      {userProfile.mbtiAssessmentDate ? 
                        new Date(userProfile.mbtiAssessmentDate).toLocaleDateString() : 
                        'N/A'
                      }
                    </div>
                    <div className="text-sm text-slate-600">Assessment Date</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-6">🧠</div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                    Complete Your MBTI Assessment
                  </h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    Take the personality quiz to unlock personalized insights, 
                    recommendations, and a deeper understanding of yourself.
                  </p>
                  <Button
                    onClick={handleTakeQuiz}
                    size="lg"
                    variant="gradient"
                    className="px-8 py-4 text-lg"
                  >
                    Take MBTI Quiz
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
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

        {/* AI Recommendations Section - Only show if MBTI profile exists */}
        {userProfile.hasMBTIProfile && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <span className="text-3xl mr-3">🤖</span>
                  AI-Powered Recommendations
                </CardTitle>
                <CardDescription>
                  Personalized suggestions based on your personality and patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardRecommendations />
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
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">AI Insights</div>
                      <div className="text-sm text-slate-600">Get personalized recommendations</div>
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
      </div>
    </div>
  );
} 
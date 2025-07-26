'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={loadUserProfile}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!userProfile) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
            <p className="text-gray-600">No user profile found.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {userProfile.name}!</h1>
          <p className="text-gray-600">Your personalized dashboard with insights and recommendations</p>
        </div>

        {/* MBTI Profile Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="text-purple-600 mr-2">🧠</span>
              Your MBTI Profile
            </h2>
            
            {userProfile.hasMBTIProfile ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {userProfile.mbtiType}
                  </div>
                  <div className="text-sm text-gray-600">Personality Type</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {userProfile.mbtiConfidence}%
                  </div>
                  <div className="text-sm text-gray-600">Assessment Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800 mb-2">
                    {userProfile.mbtiAssessmentDate ? 
                      new Date(userProfile.mbtiAssessmentDate).toLocaleDateString() : 
                      'N/A'
                    }
                  </div>
                  <div className="text-sm text-gray-600">Assessment Date</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🧠</div>
                <h3 className="text-lg font-semibold mb-2">Complete Your MBTI Assessment</h3>
                <p className="text-gray-600 mb-4">
                  Take the personality quiz to unlock personalized insights and recommendations.
                </p>
                <button
                  onClick={handleTakeQuiz}
                  className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Take MBTI Quiz
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sentiment Chart Section - Only show if MBTI profile exists */}
        {userProfile.hasMBTIProfile && (
          <div className="mb-8">
            <SentimentChart />
          </div>
        )}

        {/* AI Recommendations Section - Only show if MBTI profile exists */}
        {userProfile.hasMBTIProfile && (
          <div className="mb-8">
            <DashboardRecommendations />
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/journal"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <span className="text-2xl mr-3">📝</span>
              <div>
                <div className="font-medium">Journal Entry</div>
                <div className="text-sm text-gray-600">Write today's reflection</div>
              </div>
            </a>
            <a
              href="/habits"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <span className="text-2xl mr-3">✅</span>
              <div>
                <div className="font-medium">Habit Tracker</div>
                <div className="text-sm text-gray-600">Track your daily habits</div>
              </div>
            </a>
            {userProfile.hasMBTIProfile && (
              <a
                href="/recommendations"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <span className="text-2xl mr-3">🤖</span>
                <div>
                  <div className="font-medium">AI Insights</div>
                  <div className="text-sm text-gray-600">Get personalized recommendations</div>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
} 
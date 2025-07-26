'use client';

import { useEffect, useState } from 'react';

interface Recommendation {
  title: string;
  description: string;
  category: string;
}

interface RecommendationsData {
  habits: Recommendation[];
  careerPaths: Recommendation[];
  context: {
    mbtiType: string;
    mbtiConfidence: number;
    activeHabitsCount: number;
    totalCompletions: number;
    averageStreak: number;
  };
}

export default function DashboardRecommendations() {
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      // Get user data first
      const userResponse = await fetch('/api/user/profile');
      const userData = await userResponse.json();

      if (!userData.success || !userData.mbtiType) {
        setError('Please complete the MBTI quiz first to get personalized recommendations.');
        setIsLoading(false);
        return;
      }

      // Fetch recommendations
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: userData.userId,
          limit: 5
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRecommendations(data);
      } else {
        if (data.error && (data.error.includes('rate limit') || data.error.includes('429'))) {
          setError('AI recommendations temporarily unavailable. Please try again later.');
        } else {
          setError(data.error || 'Failed to load recommendations');
        }
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">AI-Powered Recommendations</h3>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">AI-Powered Recommendations</h3>
        <div className="text-center text-gray-500 py-4">
          <p className="mb-3">{error}</p>
          <button 
            onClick={fetchRecommendations}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Context Info */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Your Profile Context</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium">MBTI Type</div>
            <div>{recommendations.context.mbtiType}</div>
          </div>
          <div>
            <div className="font-medium">Confidence</div>
            <div>{recommendations.context.mbtiConfidence}%</div>
          </div>
          <div>
            <div className="font-medium">Active Habits</div>
            <div>{recommendations.context.activeHabitsCount}</div>
          </div>
          <div>
            <div className="font-medium">Avg Streak</div>
            <div>{recommendations.context.averageStreak.toFixed(1)} days</div>
          </div>
        </div>
      </div>

      {/* Habits Recommendations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="text-green-600 mr-2">🌱</span>
          Recommended Habits
        </h3>
        <div className="space-y-4">
          {recommendations.habits.map((habit, index) => (
            <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-medium text-gray-900">{habit.title}</h4>
              <p className="text-gray-600 text-sm mt-1">{habit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Career Paths */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="text-blue-600 mr-2">💼</span>
          Career Paths
        </h3>
        <div className="space-y-4">
          {recommendations.careerPaths.map((career, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-medium text-gray-900">{career.title}</h4>
              <p className="text-gray-600 text-sm mt-1">{career.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button 
          onClick={fetchRecommendations}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Refresh Recommendations
        </button>
      </div>
    </div>
  );
} 
"use client";

import { useState, useEffect } from 'react';

interface HabitRecommendation {
  title: string;
  description: string;
  category: string;
  frequency: string;
  goal: number;
  reasoning: string;
}

interface CareerRecommendation {
  title: string;
  description: string;
  skills: string[];
  growthPotential: string;
  workStyle: string;
  reasoning: string;
}

interface Recommendations {
  habits: HabitRecommendation[];
  careerPaths: CareerRecommendation[];
  insights: string[];
  mbtiInsights: string;
}

interface RecommendationsResponse {
  success: boolean;
  recommendations: Recommendations;
  context: {
    mbtiType: string;
    mbtiConfidence?: number;
    journalEntriesAnalyzed?: number;
    activeHabitsCount?: number;
    totalCompletions?: number;
    averageStreak?: number;
    averageMotivation?: number;
    dominantMood?: Record<string, number>;
    recentMood?: string;
    habitStats?: {
      totalHabits: number;
      avgStreak: number;
      longestStreak: number;
    };
    note?: string;
  };
}

interface UserData {
  mbtiType?: string;
  userId?: string;
}

interface PageContent {
  title: string;
  description: string;
  subtitle: string;
  callToAction: string;
}

export default function RecommendationsTest() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null);
  const [pageContent, setPageContent] = useState<PageContent>({
    title: 'AI-Powered Recommendations',
    description: 'Get personalized habit and career recommendations based on your MBTI type and personal data',
    subtitle: 'Your Profile',
    callToAction: 'Get AI Recommendations'
  });

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Get user's MBTI profile and user ID
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (data.success && data.user) {
        // Check if user has an MBTI profile
        if (data.mbtiProfile && data.mbtiProfile.mbtiType) {
          setUserData({
            mbtiType: data.mbtiProfile.mbtiType,
            userId: data.user._id
          });
          
          // Generate personalized page content using Gemini
          generatePageContent(data.mbtiProfile.mbtiType);
        } else {
          setError('Please take the MBTI quiz first to get personalized recommendations.');
        }
      } else {
        setError('Please take the MBTI quiz first to get personalized recommendations.');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load user data. Please try again.');
    } finally {
      setIsLoadingUser(false);
    }
  };

  const generatePageContent = async (mbtiType: string) => {
    try {
      const response = await fetch('/api/gemini/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generate personalized page content for a recommendations page for someone with MBTI type ${mbtiType}. 
          
          Return a JSON object with:
          {
            "title": "Engaging, personalized title (max 50 chars)",
            "description": "Brief description explaining what they'll get (max 120 chars)",
            "subtitle": "Section title for their profile info (max 30 chars)",
            "callToAction": "Button text for getting recommendations (max 30 chars)"
          }
          
          Make it feel personal and specific to their ${mbtiType} personality type.`,
          type: 'json'
        }),
      });

      const data = await response.json();
      if (data.success && data.response) {
        setPageContent(data.response);
      }
    } catch (error) {
      console.error('Error generating page content:', error);
      // Keep default content if AI generation fails
    }
  };

  const handleGetRecommendations = async () => {
    if (!userData?.userId) {
      setError('User data not available. Please take the MBTI quiz first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setRecommendations(null);

    try {
      const response = await fetch('/api/recommendations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setRecommendations(data);
      } else {
        // Check if it's a rate limit error
        if (data.error && (data.error.includes('rate limit') || data.error.includes('429'))) {
          setError('AI service is temporarily busy. Please wait a moment and try again, or use the fallback recommendations below.');
        } else {
          setError(data.error || 'Failed to generate recommendations');
        }
      }
    } catch (error) {
      console.error('Recommendations error:', error);
      setError('Failed to generate recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      health: 'bg-green-100 text-green-800',
      productivity: 'bg-blue-100 text-blue-800',
      learning: 'bg-purple-100 text-purple-800',
      social: 'bg-pink-100 text-pink-800',
      mindfulness: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getGrowthColor = (growth: string) => {
    switch (growth) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoadingUser) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!userData?.mbtiType) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">MBTI Quiz Required</h2>
          <p className="text-yellow-700 mb-6">
            To get personalized recommendations, you need to take the MBTI quiz first.
          </p>
          <div className="space-y-4">
            <a 
              href="/quiz" 
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Take MBTI Quiz
            </a>
            <div>
              <a href="/" className="text-blue-600 hover:text-blue-700 underline">
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{pageContent.title}</h2>
        <p className="text-gray-600">{pageContent.description}</p>
      </div>

      {/* User Info */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">{pageContent.subtitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">MBTI Type:</span> {userData.mbtiType}
          </div>
          <div>
            <span className="font-medium">Status:</span> Ready for recommendations
          </div>
        </div>
      </div>

      {/* Get Recommendations Button */}
      <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
        <div className="text-center">
          <p className="text-gray-700 mb-4">
            Click the button below to generate personalized recommendations based on your:
          </p>
          <ul className="text-sm text-gray-600 mb-6 space-y-1">
            <li>• MBTI personality type ({userData.mbtiType})</li>
            <li>• Recent journal entries and mood patterns</li>
            <li>• Current habit tracking progress</li>
            <li>• Personal growth patterns</li>
          </ul>
          
          <button
            onClick={handleGetRecommendations}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Personalized Recommendations...
              </div>
            ) : (
              pageContent.callToAction
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Results */}
      {recommendations && (
        <div className="space-y-6">
          {/* Context Info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Analysis Context</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">MBTI Type:</span> {recommendations.context.mbtiType}
                {recommendations.context.mbtiConfidence && (
                  <span className="text-blue-600 ml-1">({recommendations.context.mbtiConfidence}% confidence)</span>
                )}
              </div>
              <div>
                <span className="font-medium">Recent Mood:</span> {recommendations.context.recentMood || 'neutral'}
              </div>
              <div>
                <span className="font-medium">Active Habits:</span> {recommendations.context.habitStats?.totalHabits || 0}
              </div>
              <div>
                <span className="font-medium">Avg Streak:</span> {recommendations.context.habitStats?.avgStreak || 0} days
              </div>
            </div>
            {recommendations.context.totalCompletions && recommendations.context.totalCompletions > 0 && (
              <div className="mt-2 text-sm text-blue-700">
                <span className="font-medium">Habit Progress:</span> {recommendations.context.totalCompletions} total completions, 
                {recommendations.context.averageStreak || 0} day average streak
              </div>
            )}
            {recommendations.context.note && (
              <p className="text-blue-700 mt-2 text-sm italic">{recommendations.context.note}</p>
            )}
          </div>



          {/* Habits Recommendations */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended Habits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.recommendations.habits.map((habit, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{habit.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(habit.category || 'General')}`}>
                      {habit.category || 'General'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{habit.description}</p>
                  <div className="text-xs text-gray-500 mb-2">
                    <span className="font-medium">Frequency:</span> {habit.frequency || 'Daily'}
                    <span className="mx-2">•</span>
                    <span className="font-medium">Goal:</span> {(habit.goal || 1)}x
                  </div>
                  <p className="text-xs text-gray-700 italic">"{habit.reasoning || 'This habit aligns with your personality type.'}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Career Recommendations */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Career Path Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.recommendations.careerPaths.map((career, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{career.title}</h4>
                    <span className={`text-xs font-medium ${getGrowthColor(career.growthPotential || 'Medium')}`}>
                      {(career.growthPotential || 'Medium').toUpperCase()} Growth
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{career.description}</p>
                  <div className="mb-3">
                    <span className="text-xs font-medium text-gray-700">Key Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(career.skills || ['Problem Solving', 'Communication']).map((skill, skillIndex) => (
                        <span key={skillIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    <span className="font-medium">Work Style:</span> {career.workStyle || 'Flexible'}
                  </p>
                  <p className="text-xs text-gray-700 italic">"{career.reasoning || 'This role aligns with your personality strengths.'}"</p>
                </div>
              ))}
            </div>
          </div>


        </div>
      )}
    </div>
  );
} 
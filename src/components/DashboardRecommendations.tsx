'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface Recommendation {
  title: string;
  description: string;
  category?: string;
  frequency?: string;
  goal?: number;
  reasoning?: string;
  skills?: string[];
  growthPotential?: string;
  workStyle?: string;
}

interface RecommendationsData {
  recommendations: {
    habits: Recommendation[];
    careerPaths: Recommendation[];
  };
  context: {
    mbtiType: string;
    confidence?: number;
    recentMood?: string;
    habitStats?: {
      totalHabits: number;
      avgStreak: number;
    };
    note?: string;
  };
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function DashboardRecommendations() {
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    checkUserProfile();
  }, []);

  const checkUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (data.success) {
        setUserProfile(data);
        if (data.hasMBTIProfile) {
          fetchRecommendations();
        } else {
          setIsLoading(false);
        }
      } else {
        setError('Failed to load user profile');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setError('Failed to load user profile');
      setIsLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setIsRefreshing(true);
      setError('');

      const response = await fetch('/api/recommendations');
      const data = await response.json();

      if (data.success) {
        setRecommendations(data);
      } else {
        setError(data.error || 'Failed to load recommendations');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to load recommendations');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const getGrowthColor = (growth: string | undefined) => {
    switch (growth?.toLowerCase()) {
      case 'very high':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string | undefined) => {
    switch (category?.toLowerCase()) {
      case 'productivity':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'wellness':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'learning':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'growth':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your personalized insights...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
      >
        <div className="text-red-600 text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Recommendations</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <Button 
          onClick={fetchRecommendations}
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-100"
        >
          Try Again
        </Button>
      </motion.div>
    );
  }

  // Show MBTI quiz requirement if user doesn't have an MBTI profile
  if (!userProfile?.hasMBTIProfile) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8 text-center"
      >
        <div className="text-amber-600 text-6xl mb-6">🧠</div>
        <h2 className="text-3xl font-bold text-amber-800 mb-4">
          Click the button below to get your personalized recommendations
        </h2>
        <p className="text-lg text-amber-700 mb-6 max-w-2xl mx-auto">
          To get personalized insights and recommendations, you need to take the MBTI personality quiz first. 
          This will help us understand your unique traits and provide tailored suggestions.
        </p>
        <div className="space-y-4">
          <Button 
            onClick={() => window.location.href = '/quiz'}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg font-medium"
          >
            See Results
          </Button>
          <div>
            <a 
              href="/dashboard" 
              className="text-amber-600 hover:text-amber-700 underline"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!recommendations) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center"
      >
        <div className="text-blue-600 text-4xl mb-4">🔄</div>
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Ready to Generate Insights</h3>
        <p className="text-blue-700 mb-4">Click the button below to get your personalized recommendations</p>
        <Button 
          onClick={fetchRecommendations}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Generate Insights
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div 
        variants={fadeInUp}
        className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 rounded-2xl p-8 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              ✨ Personalized Insights for {recommendations.context.mbtiType}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              AI-powered recommendations tailored to your personality and patterns
            </p>
          </div>
          <Button 
            onClick={fetchRecommendations}
            disabled={isRefreshing}
            variant="outline"
            className="border-indigo-300 text-indigo-700 hover:bg-indigo-100 px-6 py-3 text-base font-medium"
          >
            {isRefreshing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                Refreshing...
              </>
            ) : (
              '🔄 Refresh Recommendations'
            )}
          </Button>
        </div>
        
        {/* Context Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div 
            variants={fadeInUp}
            className="bg-white rounded-xl p-4 border border-indigo-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-sm text-slate-500 mb-1">MBTI Type</div>
            <div className="font-bold text-lg text-slate-900">{recommendations.context.mbtiType}</div>
          </motion.div>
          <motion.div 
            variants={fadeInUp}
            className="bg-white rounded-xl p-4 border border-indigo-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-sm text-slate-500 mb-1">Recent Mood</div>
            <div className="font-bold text-lg text-slate-900 capitalize">
              {recommendations.context.recentMood || 'Neutral'}
            </div>
          </motion.div>
          <motion.div 
            variants={fadeInUp}
            className="bg-white rounded-xl p-4 border border-indigo-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-sm text-slate-500 mb-1">Active Habits</div>
            <div className="font-bold text-lg text-slate-900">
              {recommendations.context.habitStats?.totalHabits || 0}
            </div>
          </motion.div>
          <motion.div 
            variants={fadeInUp}
            className="bg-white rounded-xl p-4 border border-indigo-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-sm text-slate-500 mb-1">Avg Streak</div>
            <div className="font-bold text-lg text-slate-900">
              {recommendations.context.habitStats?.avgStreak || 0} days
            </div>
          </motion.div>
        </div>
        
        {recommendations.context.note && (
          <motion.div 
            variants={fadeInUp}
            className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
          >
            <p className="text-sm text-blue-700 italic">{recommendations.context.note}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Career Recommendations */}
      <motion.div 
        variants={fadeInUp}
        className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 flex items-center">
          <span className="text-4xl mr-4">💼</span>
          Recommended Careers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.recommendations.careerPaths.map((career, index) => (
            <motion.div 
              key={index}
              variants={fadeInUp}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-lg text-slate-900 group-hover:text-indigo-700 transition-colors">
                  {career.title}
                </h4>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getGrowthColor(career.growthPotential)}`}>
                  {(career.growthPotential || 'Medium').toUpperCase()} Growth
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">{career.description}</p>
              
              {career.skills && career.skills.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-slate-700 mb-2">Key Skills:</div>
                  <div className="flex flex-wrap gap-2">
                    {career.skills.slice(0, 3).map((skill, skillIndex) => (
                      <span key={skillIndex} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="font-semibold">Work Style:</span> {career.workStyle || 'Flexible'}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Habit Suggestions */}
      <motion.div 
        variants={fadeInUp}
        className="bg-teal-50 rounded-2xl p-8 border border-teal-200 shadow-sm"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 flex items-center">
          <span className="text-4xl mr-4">📈</span>
          Habit Suggestions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.recommendations.habits.map((habit, index) => (
            <motion.div 
              key={index}
              variants={fadeInUp}
              className="bg-white rounded-xl p-6 border border-teal-200 hover:shadow-lg hover:border-teal-300 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-lg text-slate-900 group-hover:text-teal-700 transition-colors">
                  {habit.title}
                </h4>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(habit.category)}`}>
                  {habit.category || 'General'}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">{habit.description}</p>
              
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span><span className="font-semibold">Frequency:</span> {habit.frequency || 'Daily'}</span>
                <span><span className="font-semibold">Goal:</span> {(habit.goal || 1)}x</span>
              </div>
              
              {habit.reasoning && (
                <p className="text-xs text-slate-600 italic leading-relaxed pt-2 border-t border-slate-100">
                  "{habit.reasoning}"
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Motivation Tip */}
      <motion.div 
        variants={fadeInUp}
        className="bg-amber-50 rounded-2xl p-8 border border-amber-200 shadow-sm"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 flex items-center">
          <span className="text-4xl mr-4">💡</span>
          Motivation Tip
        </h3>
        <div className="bg-white rounded-xl p-6 border border-amber-200 shadow-sm">
          <p className="text-slate-700 leading-relaxed text-lg">
            Embrace your <span className="font-semibold text-amber-700">{recommendations.context.mbtiType}</span> personality type and use your natural strengths to achieve your goals. 
            Remember that consistency beats perfection - focus on building sustainable habits that align with your personality.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
} 
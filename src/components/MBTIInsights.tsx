'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import GeminiBadge from '@/components/GeminiBadge';

interface MBTIInsights {
  careers: string[];
  habits: string[];
  motivationTip: string;
  strengths: string[];
  challenges: string[];
  learningStyle: string;
}

interface MBTIInsightsProps {
  mbtiType: string;
  onRetake: () => void;
}

export default function MBTIInsights({ mbtiType, onRetake }: MBTIInsightsProps) {
  const [insights, setInsights] = useState<MBTIInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchInsights();
  }, [mbtiType]);

  const fetchInsights = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/mbti/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mbtiType }),
      });

      const data = await response.json();

      if (data.success) {
        setInsights(data.insights);
      } else {
        setError(data.error || 'Failed to load insights');
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
      setError('Failed to load insights');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      'INTJ': 'The Architect - Imaginative and strategic thinkers',
      'INTP': 'The Logician - Innovative inventors with an unquenchable thirst for knowledge',
      'ENTJ': 'The Commander - Bold, imaginative and strong-willed leaders',
      'ENTP': 'The Debater - Smart and curious thinkers who cannot resist an intellectual challenge',
      'INFJ': 'The Advocate - Quiet and mystical, yet very inspiring and tireless idealists',
      'INFP': 'The Mediator - Poetic, kind and altruistic people, always eager to help a good cause',
      'ENFJ': 'The Protagonist - Charismatic and inspiring leaders, able to mesmerize their listeners',
      'ENFP': 'The Campaigner - Enthusiastic, creative and sociable free spirits',
      'ISTJ': 'The Logistician - Practical and fact-minded individuals, whose reliability cannot be doubted',
      'ISFJ': 'The Defender - Very dedicated and warm protectors, always ready to defend their loved ones',
      'ESTJ': 'The Executive - Excellent administrators, unsurpassed at managing things or people',
      'ESFJ': 'The Consul - Extraordinarily caring, social and popular people',
      'ISTP': 'The Virtuoso - Bold and practical experimenters, masters of all kinds of tools',
      'ISFP': 'The Adventurer - Flexible and charming artists, always ready to explore and experience something new',
      'ESTP': 'The Entrepreneur - Smart, energetic and very perceptive people',
      'ESFP': 'The Entertainer - Spontaneous, energetic and enthusiastic entertainers'
    };
    return descriptions[type] || 'A unique personality type with distinct characteristics';
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-lg text-slate-600">Generating your personalized insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchInsights} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <GeminiBadge />
        </div>
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-4">
          <span className="text-2xl font-bold text-indigo-900 mr-3">{mbtiType}</span>
          <span className="text-indigo-700">Your Personality Type</span>
        </div>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          {getTypeDescription(mbtiType)}
        </p>
      </div>

      {/* Insights Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Careers */}
        <Card className="border-indigo-200 hover:border-indigo-300 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center text-indigo-900">
              <span className="text-2xl mr-3">💼</span>
              Career Paths
            </CardTitle>
            <CardDescription>
              Professions that align with your strengths
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.careers.map((career, index) => (
                <li key={index} className="flex items-center text-slate-700">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  {career}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Habits */}
        <Card className="border-green-200 hover:border-green-300 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center text-green-900">
              <span className="text-2xl mr-3">✅</span>
              Recommended Habits
            </CardTitle>
            <CardDescription>
              Daily practices to enhance your growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.habits.map((habit, index) => (
                <li key={index} className="flex items-center text-slate-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  {habit}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Strengths */}
        <Card className="border-blue-200 hover:border-blue-300 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <span className="text-2xl mr-3">⭐</span>
              Your Strengths
            </CardTitle>
            <CardDescription>
              Natural abilities you can leverage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.strengths.map((strength, index) => (
                <li key={index} className="flex items-center text-slate-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Challenges */}
        <Card className="border-orange-200 hover:border-orange-300 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-900">
              <span className="text-2xl mr-3">🎯</span>
              Growth Areas
            </CardTitle>
            <CardDescription>
              Challenges to overcome for development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.challenges.map((challenge, index) => (
                <li key={index} className="flex items-center text-slate-700">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  {challenge}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Learning Style */}
      <Card className="border-purple-200 hover:border-purple-300 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-900">
            <span className="text-2xl mr-3">📚</span>
            Learning Style
          </CardTitle>
          <CardDescription>
            How you learn most effectively
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 leading-relaxed">{insights.learningStyle}</p>
        </CardContent>
      </Card>

      {/* Motivation Tip */}
      <Card className="border-gradient-to-r from-pink-200 to-rose-200 bg-gradient-to-r from-pink-50 to-rose-50">
        <CardHeader>
          <CardTitle className="flex items-center text-pink-900">
            <span className="text-2xl mr-3">💪</span>
            Motivation Tip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-slate-700 leading-relaxed italic">
            "{insights.motivationTip}"
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <Button 
          onClick={onRetake} 
          variant="outline" 
          size="lg"
          className="px-8 py-4"
        >
          Retake Quiz
        </Button>
        <Button 
          onClick={() => router.push('/dashboard')} 
          size="lg"
          variant="gradient"
          className="px-8 py-4"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
} 
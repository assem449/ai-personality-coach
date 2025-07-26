'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface MBTIResult {
  mbtiType: string;
  confidence: number;
  assessmentDate: string;
  answers: Record<string, string>;
}

interface MBTIResultProps {
  onRetake?: () => void;
  showRetakeButton?: boolean;
}

const mbtiDescriptions: Record<string, { title: string; description: string; color: string }> = {
  'INTJ': {
    title: 'The Architect',
    description: 'Imaginative and strategic thinkers, with a plan for everything.',
    color: 'from-purple-500 to-indigo-600'
  },
  'INTP': {
    title: 'The Logician',
    description: 'Innovative inventors with an unquenchable thirst for knowledge.',
    color: 'from-blue-500 to-cyan-600'
  },
  'ENTJ': {
    title: 'The Commander',
    description: 'Bold, imaginative and strong-willed leaders, always finding a way.',
    color: 'from-red-500 to-pink-600'
  },
  'ENTP': {
    title: 'The Debater',
    description: 'Smart and curious thinkers who cannot resist an intellectual challenge.',
    color: 'from-orange-500 to-red-600'
  },
  'INFJ': {
    title: 'The Advocate',
    description: 'Quiet and mystical, yet very inspiring and tireless idealists.',
    color: 'from-green-500 to-emerald-600'
  },
  'INFP': {
    title: 'The Mediator',
    description: 'Poetic, kind and altruistic people, always eager to help a good cause.',
    color: 'from-teal-500 to-green-600'
  },
  'ENFJ': {
    title: 'The Protagonist',
    description: 'Charismatic and inspiring leaders, able to mesmerize their listeners.',
    color: 'from-yellow-500 to-orange-600'
  },
  'ENFP': {
    title: 'The Campaigner',
    description: 'Enthusiastic, creative and sociable free spirits.',
    color: 'from-pink-500 to-purple-600'
  },
  'ISTJ': {
    title: 'The Logistician',
    description: 'Practical and fact-minded individuals, whose reliability cannot be doubted.',
    color: 'from-gray-500 to-slate-600'
  },
  'ISFJ': {
    title: 'The Defender',
    description: 'Very dedicated and warm protectors, always ready to defend their loved ones.',
    color: 'from-indigo-500 to-blue-600'
  },
  'ESTJ': {
    title: 'The Executive',
    description: 'Excellent administrators, unsurpassed at managing things or people.',
    color: 'from-amber-500 to-yellow-600'
  },
  'ESFJ': {
    title: 'The Consul',
    description: 'Extraordinarily caring, social and popular people.',
    color: 'from-emerald-500 to-teal-600'
  },
  'ISTP': {
    title: 'The Virtuoso',
    description: 'Bold and practical experimenters, masters of all kinds of tools.',
    color: 'from-slate-500 to-gray-600'
  },
  'ISFP': {
    title: 'The Adventurer',
    description: 'Flexible and charming artists, always ready to explore and experience something new.',
    color: 'from-rose-500 to-pink-600'
  },
  'ESTP': {
    title: 'The Entrepreneur',
    description: 'Smart, energetic and very perceptive people.',
    color: 'from-violet-500 to-purple-600'
  },
  'ESFP': {
    title: 'The Entertainer',
    description: 'Spontaneous, energetic and enthusiastic entertainers.',
    color: 'from-cyan-500 to-blue-600'
  }
};

export default function MBTIResult({ onRetake, showRetakeButton = true }: MBTIResultProps) {
  const [mbtiResult, setMbtiResult] = useState<MBTIResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMBTIResult();
  }, []);

  const fetchMBTIResult = async () => {
    try {
      const response = await fetch('/api/mbti');
      const data = await response.json();

      if (data.success) {
        setMbtiResult(data);
      } else if (data.hasProfile === false) {
        setMbtiResult(null);
      } else {
        setError(data.error || 'Failed to fetch MBTI result');
      }
    } catch (error) {
      console.error('Error fetching MBTI result:', error);
      setError('Failed to load MBTI result');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchMBTIResult} variant="outline">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!mbtiResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <span className="text-2xl mr-3">🧠</span>
            MBTI Personality Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🤔</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              You haven't taken the quiz yet
            </h3>
            <p className="text-slate-600 mb-6">
              Take the MBTI personality assessment to discover your unique personality type.
            </p>
            <Button onClick={() => window.location.href = '/quiz'} variant="gradient">
              Take MBTI Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const mbtiInfo = mbtiDescriptions[mbtiResult.mbtiType] || {
    title: 'Personality Type',
    description: 'Your unique personality type based on the MBTI assessment.',
    color: 'from-indigo-500 to-purple-600'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <span className="text-2xl mr-3">🧠</span>
          Your MBTI Personality Type
        </CardTitle>
        <CardDescription>
          Discovered on {new Date(mbtiResult.assessmentDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main Result */}
          <div className={`bg-gradient-to-r ${mbtiInfo.color} text-white rounded-xl p-6 text-center`}>
            <div className="text-5xl font-bold mb-2">{mbtiResult.mbtiType}</div>
            <div className="text-xl font-semibold mb-2">{mbtiInfo.title}</div>
            <p className="text-white/90">{mbtiInfo.description}</p>
          </div>

          {/* Confidence Score */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Assessment Confidence</span>
              <span className="text-sm font-bold text-slate-900">{mbtiResult.confidence}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${mbtiResult.confidence}%` }}
              ></div>
            </div>
          </div>

          {/* Type Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <div className="text-sm font-medium text-slate-600">Energy</div>
              <div className="text-lg font-bold text-indigo-700">
                {mbtiResult.mbtiType[0] === 'E' ? 'Extravert' : 'Introvert'}
              </div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-slate-600">Information</div>
              <div className="text-lg font-bold text-blue-700">
                {mbtiResult.mbtiType[1] === 'S' ? 'Sensing' : 'Intuition'}
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-slate-600">Decision</div>
              <div className="text-lg font-bold text-green-700">
                {mbtiResult.mbtiType[2] === 'T' ? 'Thinking' : 'Feeling'}
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-sm font-medium text-slate-600">Lifestyle</div>
              <div className="text-lg font-bold text-purple-700">
                {mbtiResult.mbtiType[3] === 'J' ? 'Judging' : 'Perceiving'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {showRetakeButton && (
            <div className="flex gap-3">
              <Button 
                onClick={onRetake || (() => window.location.href = '/quiz')} 
                variant="outline" 
                className="flex-1"
              >
                Retake Quiz
              </Button>
              <Button 
                onClick={() => window.location.href = '/recommendations'} 
                variant="gradient" 
                className="flex-1"
              >
                Get Recommendations
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 
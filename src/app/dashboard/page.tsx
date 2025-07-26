"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [mbtiType, setMbtiType] = useState<string>('');
  const [showQuizResult, setShowQuizResult] = useState(false);

  useEffect(() => {
    // Check if user just completed the quiz
    const quizCompleted = searchParams.get('quiz');
    const quizType = searchParams.get('type');
    
    if (quizCompleted === 'completed' && quizType) {
      setMbtiType(quizType);
      setShowQuizResult(true);
      
      // Clear the URL parameters
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [searchParams]);

  const getMBTIDescription = (type: string) => {
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
    
    return descriptions[type] || 'Your unique personality type';
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-100 to-green-300">
      <div className="text-center p-8 rounded-lg shadow-lg bg-white/80 max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-4 text-green-700">User Dashboard</h1>
        
        {/* Quiz Result Banner */}
        {showQuizResult && mbtiType && (
          <div className="mb-6 p-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg border-2 border-pink-200">
            <h2 className="text-2xl font-bold text-pink-700 mb-2">
              🎉 Quiz Completed!
            </h2>
            <p className="text-lg font-semibold text-purple-700 mb-2">
              Your MBTI Type: <span className="text-pink-600">{mbtiType}</span>
            </p>
            <p className="text-gray-700 text-sm">
              {getMBTIDescription(mbtiType)}
            </p>
          </div>
        )}
        
        {/* User Profile Section */}
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full border-2 border-green-300 bg-green-200 flex items-center justify-center">
              <span className="text-green-600 text-xl">👤</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            Welcome to your Dashboard!
          </h2>
          <p className="text-green-600">Please login to see your profile information</p>
        </div>

        <p className="text-gray-700 mb-6">Here you can view your MBTI results, track your progress, and more.</p>
        
        <div className="border border-dashed border-green-400 p-6 rounded bg-green-50 text-green-600 mb-4">
          User stats and MBTI results coming soon!
        </div>
        
        <div className="flex gap-4 justify-center">
          <a 
            href="/quiz" 
            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
          >
            Take MBTI Quiz
          </a>
          <a 
            href="/api/auth/login" 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Login
          </a>
          <a 
            href="/" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Home
          </a>
        </div>
      </div>
    </main>
  );
} 
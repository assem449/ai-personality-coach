import { NextRequest, NextResponse } from 'next/server';
import { calculateMBTI } from '@/data/mbti-questions';
import { updateMBTIProfile, ensureUser } from '@/lib/db-utils';

interface QuizSubmission {
  answers: Record<string, string>;
  userId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { answers, userId }: QuizSubmission = await request.json();
    
    if (!answers) {
      return NextResponse.json(
        { error: 'Missing answers' },
        { status: 400 }
      );
    }

    // Create or get user (for demo purposes, create a test user)
    const user = await ensureUser('test-auth0-id', {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://via.placeholder.com/150'
    });

    // Calculate MBTI type
    const mbtiType = calculateMBTI(answers);
    
    // Calculate scores for each dimension
    const scores = {
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    };

    Object.values(answers).forEach(answer => {
      if (answer in scores) {
        scores[answer as keyof typeof scores]++;
      }
    });

    // Calculate confidence (simple percentage)
    const totalQuestions = 4;
    const confidence = Math.round((totalQuestions / totalQuestions) * 100);

    // Store in database using the user's ObjectId
    const profile = await updateMBTIProfile(user._id.toString(), {
      mbtiType,
      scores,
      confidence,
      questionsAnswered: totalQuestions,
      totalQuestions,
      insights: {
        strengths: [`Strong ${mbtiType} characteristics`],
        weaknesses: [`Areas for growth in ${mbtiType} development`],
        careerSuggestions: [`Careers suitable for ${mbtiType} types`],
        relationshipAdvice: [`Relationship tips for ${mbtiType} personalities`]
      }
    });

    return NextResponse.json({
      success: true,
      mbtiType,
      profile: {
        id: profile._id,
        mbtiType: profile.mbtiType,
        confidence: profile.confidence,
        assessmentDate: profile.assessmentDate
      }
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
} 
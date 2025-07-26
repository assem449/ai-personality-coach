import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createAuthErrorResponse } from '@/lib/auth0-middleware';
import { createOrUpdateMBTIProfile } from '@/lib/db-utils';
import { calculateMBTI } from '@/data/mbti-questions';

export async function POST(request: NextRequest) {
  try {
    const { authUser } = await requireAuth(request);
    const { answers } = await request.json();

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid answers format' },
        { status: 400 }
      );
    }

    // Calculate MBTI type
    const mbtiType = calculateMBTI(answers);
    
    // Calculate confidence (simple percentage based on questions answered)
    const totalQuestions = 4;
    const answeredQuestions = Object.keys(answers).length;
    const confidence = Math.round((answeredQuestions / totalQuestions) * 100);
    
    // Store MBTI profile in database
    const mbtiProfile = await createOrUpdateMBTIProfile(authUser.auth0Id, {
      mbtiType: mbtiType,
      confidence: confidence,
      answers: answers,
    });

    return NextResponse.json({
      success: true,
      mbtiType: mbtiType,
      confidence: confidence,
      description: `Your MBTI type is ${mbtiType}`,
      profileId: mbtiProfile._id,
    });

  } catch (error) {
    console.error('Quiz submission error:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthErrorResponse();
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
} 
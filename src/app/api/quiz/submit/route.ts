import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { createOrUpdateMBTIProfile } from '@/lib/db-utils';
import { requireAuth, createAuthErrorResponse } from '@/lib/auth-utils';
import { calculateMBTI } from '@/data/mbti-questions';

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    const { answers } = await request.json();
    
    if (!answers || Object.keys(answers).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No answers provided'
      }, { status: 400 });
    }

    await connectDB();

    // Calculate MBTI type from answers
    const mbtiType = calculateMBTI(answers);
    const confidence = Math.round((Object.keys(answers).length / 4) * 100);
    const assessmentDate = new Date().toISOString();

    // Store MBTI profile in database
    await createOrUpdateMBTIProfile(authUser.sub, {
      mbtiType,
      confidence,
      answers,
    });

    return NextResponse.json({
      success: true,
      mbtiType,
      confidence,
      description: `You are a ${mbtiType} personality type with ${confidence}% confidence.`,
    });

  } catch (error) {
    console.error('Quiz submission error:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthErrorResponse();
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to submit quiz'
    }, { status: 500 });
  }
} 
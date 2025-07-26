import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getMBTIProfile } from '@/lib/db-utils';
import { requireAuth, createAuthErrorResponse } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    await connectDB();
    
    const mbtiProfile = await getMBTIProfile(authUser.sub);
    
    if (!mbtiProfile) {
      return NextResponse.json({
        success: false,
        error: 'No MBTI profile found',
        hasProfile: false
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      hasProfile: true,
      mbtiType: mbtiProfile.mbtiType,
      confidence: mbtiProfile.confidence,
      assessmentDate: mbtiProfile.assessmentDate,
      answers: mbtiProfile.answers
    });

  } catch (error) {
    console.error('Error fetching MBTI profile:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthErrorResponse();
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch MBTI profile'
    }, { status: 500 });
  }
} 
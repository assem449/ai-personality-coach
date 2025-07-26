import { NextRequest, NextResponse } from 'next/server';
import { generateMBTIInsights } from '@/lib/gemini';
import { requireAuth, createAuthErrorResponse } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    const { mbtiType } = await request.json();
    
    if (!mbtiType) {
      return NextResponse.json({
        success: false,
        error: 'MBTI type is required'
      }, { status: 400 });
    }

    const insights = await generateMBTIInsights(mbtiType);
    
    return NextResponse.json({
      success: true,
      insights
    });

  } catch (error) {
    console.error('Error generating MBTI insights:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthErrorResponse();
    }
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate MBTI insights';
    if (error instanceof Error) {
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        errorMessage = 'AI service is currently busy. Using personality-based insights instead.';
      } else if (error.message.includes('API key') || error.message.includes('not configured')) {
        errorMessage = 'AI service not configured. Using personality-based insights.';
      } else if (error.message.includes('quota')) {
        errorMessage = 'AI service quota exceeded. Using personality-based insights.';
      } else if (error.message.includes('hardcoded fallback')) {
        errorMessage = 'Using personality-based insights for optimal performance.';
      }
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
} 
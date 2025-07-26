import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createAuthErrorResponse } from '@/lib/auth0-middleware';
import { getUserProfile } from '@/lib/db-utils';

export async function GET(request: NextRequest) {
  try {
    const { user, authUser } = await requireAuth(request);
    
    // Get complete user profile with all related data
    const profile = await getUserProfile(authUser.auth0Id);
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      _id: profile.user._id,
      name: profile.user.name,
      email: profile.user.email,
      picture: profile.user.picture,
      mbtiType: profile.mbtiProfile?.mbtiType,
      mbtiConfidence: profile.mbtiProfile?.confidence,
      mbtiAssessmentDate: profile.mbtiProfile?.assessmentDate,
      hasMBTIProfile: !!profile.mbtiProfile,
      userId: authUser.auth0Id, // Return Auth0 ID for API calls
      recentJournalEntries: profile.recentJournalEntries.length,
      activeHabits: profile.activeHabits.length,
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthErrorResponse();
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
} 
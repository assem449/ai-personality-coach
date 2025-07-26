import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createAuthErrorResponse } from '@/lib/auth0-middleware';
import { updateHabitTracking } from '@/lib/db-utils';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { authUser } = await requireAuth(request);
    const { date, completed } = await request.json();

    if (!date || typeof completed !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: date and completed' },
        { status: 400 }
      );
    }

    const habit = await updateHabitTracking(params.id, authUser.auth0Id, date, completed);

    if (!habit) {
      return NextResponse.json(
        { success: false, error: 'Habit not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      habit: {
        id: habit._id,
        title: habit.title,
        completed: habit.completed,
        streak: habit.streak,
        longestStreak: habit.longestStreak,
        tracking: habit.tracking,
      },
    });

  } catch (error) {
    console.error('Habit tracking error:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthErrorResponse();
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update habit tracking' },
      { status: 500 }
    );
  }
} 
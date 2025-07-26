import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { updateHabitTracking } from '@/lib/db-utils';
import { requireAuth, createAuthErrorResponse } from '@/lib/auth-utils';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await requireAuth(request);
    const { date, completed } = await request.json();
    const { id } = await params;
    
    if (!date) {
      return NextResponse.json({
        success: false,
        error: 'Date is required'
      }, { status: 400 });
    }

    await connectDB();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid habit ID'
      }, { status: 400 });
    }

    // Update habit tracking
    const habit = await updateHabitTracking(
      id,
      authUser.sub,
      date,
      completed !== false // Default to true if not specified
    );

    if (!habit) {
      return NextResponse.json({
        success: false,
        error: 'Habit not found or access denied'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      habit: {
        _id: habit._id,
        title: habit.title,
        tracking: habit.tracking,
        completed: habit.completed,
        streak: habit.streak,
        longestStreak: habit.longestStreak,
      }
    });

  } catch (error) {
    console.error('Habit tracking error:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthErrorResponse();
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update habit tracking'
    }, { status: 500 });
  }
} 
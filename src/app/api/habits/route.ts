import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { createHabit, getHabits } from '@/lib/db-utils';
import { requireAuth, createAuthErrorResponse } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    const { title, description, category, frequency } = await request.json();
    
    if (!title || title.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Habit title is required'
      }, { status: 400 });
    }

    await connectDB();

    // Check if user already has 3 active habits
    const existingHabits = await getHabits(authUser.sub, true);
    if (existingHabits.length >= 3) {
      return NextResponse.json({
        success: false,
        error: 'You can only have up to 3 active habits at a time'
      }, { status: 400 });
    }

    // Create habit
    const habit = await createHabit(authUser.sub, {
      title,
      description: description || '',
      category: category || 'general',
      frequency: frequency || 'daily',
    });

    return NextResponse.json({
      success: true,
      habit: {
        _id: habit._id,
        title: habit.title,
        description: habit.description,
        category: habit.category,
        frequency: habit.frequency,
        isActive: habit.isActive,
        createdAt: habit.createdAt,
      }
    });

  } catch (error) {
    console.error('Habit creation error:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthErrorResponse();
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create habit'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    
    const { searchParams } = new URL(request.url);
    const isActiveParam = searchParams.get('isActive');
    const isActive = isActiveParam === null ? undefined : isActiveParam === 'true';
    
    await connectDB();
    
    const habits = await getHabits(authUser.sub, isActive);
    
    return NextResponse.json({
      success: true,
      habits: habits.map(habit => ({
        _id: habit._id,
        title: habit.title,
        description: habit.description,
        category: habit.category,
        frequency: habit.frequency,
        isActive: habit.isActive,
        tracking: habit.tracking,
        completed: habit.completed,
        streak: habit.streak,
        longestStreak: habit.longestStreak,
        createdAt: habit.createdAt,
      }))
    });

  } catch (error) {
    console.error('Habit fetch error:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthErrorResponse();
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch habits'
    }, { status: 500 });
  }
} 
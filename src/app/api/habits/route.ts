import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createAuthErrorResponse } from '@/lib/auth0-middleware';
import { createHabit, getHabits } from '@/lib/db-utils';

export async function POST(request: NextRequest) {
  try {
    const { authUser } = await requireAuth(request);
    const { title, description, category, frequency } = await request.json();

    if (!title || !category || !frequency) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already has 3 active habits
    const existingHabits = await getHabits(authUser.auth0Id, true);
    if (existingHabits.length >= 3) {
      return NextResponse.json(
        { success: false, error: 'Maximum 3 active habits allowed' },
        { status: 400 }
      );
    }

    // Create new habit
    const habit = await createHabit(authUser.auth0Id, {
      title,
      description,
      category,
      frequency,
    });

    return NextResponse.json({
      success: true,
      habit: {
        id: habit._id,
        title: habit.title,
        description: habit.description,
        category: habit.category,
        frequency: habit.frequency,
        isActive: habit.isActive,
        completed: habit.completed,
        streak: habit.streak,
        longestStreak: habit.longestStreak,
        createdAt: habit.createdAt,
      },
    });

  } catch (error) {
    console.error('Habit creation error:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthErrorResponse();
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create habit' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { authUser } = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    
    const isActive = searchParams.get('active') !== 'false'; // Default to active habits

    const habits = await getHabits(authUser.auth0Id, isActive);

    return NextResponse.json({
      success: true,
      habits: habits.map(habit => ({
        id: habit._id,
        title: habit.title,
        description: habit.description,
        category: habit.category,
        frequency: habit.frequency,
        isActive: habit.isActive,
        completed: habit.completed,
        streak: habit.streak,
        longestStreak: habit.longestStreak,
        tracking: habit.tracking,
        createdAt: habit.createdAt,
      })),
    });

  } catch (error) {
    console.error('Habit retrieval error:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthErrorResponse();
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve habits' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { createHabit, getHabits, ensureUser } from '@/lib/db-utils';

export async function POST(request: NextRequest) {
  try {
    const { title, description, category, frequency, goal } = await request.json();
    
    if (!title || !category || !frequency || !goal) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create or get user (for demo purposes)
    const user = await ensureUser('test-auth0-id', {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://via.placeholder.com/150'
    });

    // Check if user already has 3 habits
    const existingHabits = await getHabits(user._id.toString(), true);
    if (existingHabits.length >= 3) {
      return NextResponse.json(
        { error: 'Maximum 3 habits allowed' },
        { status: 400 }
      );
    }

    const habit = await createHabit(user._id.toString(), {
      title,
      description: description || '',
      category,
      frequency,
      goal: parseInt(goal),
    });

    return NextResponse.json({
      success: true,
      habit: {
        id: habit._id,
        title: habit.title,
        description: habit.description,
        category: habit.category,
        frequency: habit.frequency,
        goal: habit.goal,
        completed: habit.completed,
        streak: habit.streak,
        isActive: habit.isActive,
      }
    });
  } catch (error) {
    console.error('Habit creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create habit' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Create or get user (for demo purposes)
    const user = await ensureUser('test-auth0-id', {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://via.placeholder.com/150'
    });

    const habits = await getHabits(user._id.toString(), true);
    
    return NextResponse.json({
      success: true,
      habits: habits.map(habit => ({
        id: habit._id,
        title: habit.title,
        description: habit.description,
        category: habit.category,
        frequency: habit.frequency,
        goal: habit.goal,
        completed: habit.completed,
        streak: habit.streak,
        longestStreak: habit.longestStreak,
        isActive: habit.isActive,
        startDate: habit.startDate,
      }))
    });
  } catch (error) {
    console.error('Habit retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve habits' },
      { status: 500 }
    );
  }
} 
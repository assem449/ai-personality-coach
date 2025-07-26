import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Habit } from '@/models';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { date, completed } = await request.json();
    const habitId = params.id;
    
    if (!date || typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing date or completed status' },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Find the habit
    const habit = await Habit.findById(habitId);
    if (!habit) {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      );
    }

    // Initialize tracking data if it doesn't exist
    if (!habit.tracking) {
      habit.tracking = {};
    }

    // Update tracking for the specific date
    habit.tracking[date] = completed;

    // Calculate new completion count
    const completedDays = Object.values(habit.tracking).filter(Boolean).length;
    habit.completed = completedDays;

    // Calculate streak (simplified - counts consecutive completed days)
    let currentStreak = 0;
    const dates = Object.keys(habit.tracking).sort().reverse();
    
    for (const trackDate of dates) {
      if (habit.tracking[trackDate]) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    habit.streak = currentStreak;
    
    // Update longest streak if current is longer
    if (currentStreak > habit.longestStreak) {
      habit.longestStreak = currentStreak;
    }

    await habit.save();

    return NextResponse.json({
      success: true,
      habit: {
        id: habit._id,
        title: habit.title,
        completed: habit.completed,
        streak: habit.streak,
        longestStreak: habit.longestStreak,
        tracking: habit.tracking,
      }
    });
  } catch (error) {
    console.error('Habit tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track habit' },
      { status: 500 }
    );
  }
} 
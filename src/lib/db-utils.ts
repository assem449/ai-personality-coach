import connectDB from './mongodb';
import User, { IUser } from '@/models/User';
import JournalEntry, { IJournalEntry } from '@/models/JournalEntry';
import MBTIProfile, { IMBTIProfile } from '@/models/MBTIProfile';
import Habit, { IHabit } from '@/models/Habit';

/**
 * Create or update a user in the database
 */
export async function createOrUpdateUser(userData: {
  auth0Id: string;
  email: string;
  name: string;
  picture?: string;
  emailVerified?: boolean;
}): Promise<IUser> {
  await connectDB();
  
  const user = await User.findOneAndUpdate(
    { auth0Id: userData.auth0Id },
    userData,
    { upsert: true, new: true }
  );
  
  return user;
}

/**
 * Get user by Auth0 ID
 */
export async function getUserByAuth0Id(auth0Id: string): Promise<IUser | null> {
  await connectDB();
  return await User.findOne({ auth0Id });
}

/**
 * Create a journal entry
 */
export async function createJournalEntry(
  userId: string,
  data: {
    title: string;
    content: string;
    mood: string;
    tags?: string[];
    isPrivate?: boolean;
    aiAnalysis?: {
      sentiment: 'positive' | 'neutral' | 'negative';
      motivationLevel: number;
      summary: string;
      insights: string[];
      moodKeywords: string[];
    };
  }
): Promise<IJournalEntry> {
  await connectDB();
  
  const journalEntry = await JournalEntry.create({
    userId,
    ...data,
  });
  
  return journalEntry;
}

/**
 * Get journal entries for a user with pagination
 */
export async function getJournalEntries(
  userId: string,
  limit: number = 10,
  page: number = 1,
  isPrivate?: boolean
): Promise<IJournalEntry[]> {
  await connectDB();
  
  const skip = (page - 1) * limit;
  const query: { userId: string; isPrivate?: boolean } = { userId };
  
  if (isPrivate !== undefined) {
    query.isPrivate = isPrivate;
  }
  
  return await JournalEntry.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}

/**
 * Create or update MBTI profile
 */
export async function createOrUpdateMBTIProfile(
  userId: string,
  data: {
    mbtiType: string;
    confidence: number;
    answers: Record<string, string>;
  }
): Promise<IMBTIProfile> {
  await connectDB();
  
  const profile = await MBTIProfile.findOneAndUpdate(
    { userId },
    {
      ...data,
      assessmentDate: new Date(),
    },
    { upsert: true, new: true }
  );
  
  return profile;
}

/**
 * Get MBTI profile for a user
 */
export async function getMBTIProfile(userId: string): Promise<IMBTIProfile | null> {
  await connectDB();
  return await MBTIProfile.findOne({ userId });
}

/**
 * Create a habit
 */
export async function createHabit(
  userId: string,
  data: {
    title: string;
    description?: string;
    category: string;
    frequency: 'daily' | 'weekly' | 'monthly';
  }
): Promise<IHabit> {
  await connectDB();
  
  const habit = await Habit.create({
    userId,
    ...data,
  });
  
  return habit;
}

/**
 * Get habits for a user
 */
export async function getHabits(
  userId: string,
  isActive?: boolean
): Promise<IHabit[]> {
  await connectDB();
  
  const query: { userId: string; isActive?: boolean } = { userId };
  
  if (isActive !== undefined) {
    query.isActive = isActive;
  }
  
  return await Habit.find(query).sort({ createdAt: -1 });
}

/**
 * Update habit tracking for a specific date
 */
export async function updateHabitTracking(
  habitId: string,
  userId: string,
  date: string,
  completed: boolean
): Promise<IHabit | null> {
  await connectDB();
  
  const habit = await Habit.findOne({ _id: habitId, userId });
  
  if (!habit) {
    return null;
  }
  
  // Update tracking data
  habit.tracking = habit.tracking || {};
  habit.tracking[date] = completed;
  
  // Recalculate stats
  const trackingValues = Object.values(habit.tracking);
  habit.completed = trackingValues.filter(Boolean).length;
  
  // Calculate current streak
  let currentStreak = 0;
  const sortedDates = Object.keys(habit.tracking).sort().reverse();
  
  for (const trackDate of sortedDates) {
    if (habit.tracking[trackDate]) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  habit.streak = currentStreak;
  habit.longestStreak = Math.max(habit.longestStreak, currentStreak);
  
  await habit.save();
  return habit;
}

/**
 * Get user's complete profile with all related data
 */
export async function getUserProfile(auth0Id: string): Promise<{
  user: IUser;
  mbtiProfile: IMBTIProfile | null;
  recentJournalEntries: IJournalEntry[];
  activeHabits: IHabit[];
} | null> {
  await connectDB();
  
  const user = await getUserByAuth0Id(auth0Id);
  if (!user) {
    return null;
  }
  
  const [mbtiProfile, recentJournalEntries, activeHabits] = await Promise.all([
    getMBTIProfile(auth0Id),
    getJournalEntries(auth0Id, 5, 1),
    getHabits(auth0Id, true),
  ]);
  
  return {
    user,
    mbtiProfile,
    recentJournalEntries,
    activeHabits,
  };
} 
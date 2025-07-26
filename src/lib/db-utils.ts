import connectDB from './mongodb';
import { User, JournalEntry, MBTIProfile, Habit } from '@/models';
import type { IUser, IJournalEntry, IMBTIProfile, IHabit } from '@/models';

export async function ensureUser(auth0Id: string, userData: {
  email: string;
  name: string;
  picture?: string;
}) {
  await connectDB();
  
  let user = await User.findOne({ auth0Id });
  
  if (!user) {
    user = await User.create({
      auth0Id,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
    });
  }
  
  return user;
}

export async function getUserByAuth0Id(auth0Id: string) {
  await connectDB();
  return await User.findOne({ auth0Id });
}

export async function getUserById(userId: string) {
  await connectDB();
  return await User.findById(userId);
}

export async function getJournalEntries(
  userId: string,
  limit: number = 10,
  page: number = 1
): Promise<IJournalEntry[]> {
  await connectDB();
  
  const skip = (page - 1) * limit;
  
  return await JournalEntry.find({ userId })
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
}

export async function getMBTIProfile(userId: string) {
  await connectDB();
  return await MBTIProfile.findOne({ userId });
}

export async function getHabits(userId: string, activeOnly = true) {
  await connectDB();
  const query: { userId: string; isActive?: boolean } = { userId };
  if (activeOnly) {
    query.isActive = true;
  }
  return await Habit.find(query).sort({ createdAt: -1 });
}

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
  
  const entry = new JournalEntry({
    userId,
    ...data,
  });
  
  return await entry.save();
}

export async function updateMBTIProfile(userId: string, profileData: {
  mbtiType: string;
  scores: any;
  confidence: number;
  questionsAnswered: number;
  totalQuestions: number;
  insights?: any;
}) {
  await connectDB();
  return await MBTIProfile.findOneAndUpdate(
    { userId },
    { ...profileData, assessmentDate: new Date() },
    { upsert: true, new: true }
  );
}

export async function createHabit(userId: string, habitData: {
  title: string;
  description?: string;
  category: string;
  frequency: string;
  goal: number;
  reminders?: any;
}) {
  await connectDB();
  return await Habit.create({
    userId,
    ...habitData,
  });
} 
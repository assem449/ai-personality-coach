import mongoose, { Schema, Document } from 'mongoose';

export interface IHabit extends Document {
  userId: string; // Auth0 user ID
  title: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
  completed: number;
  streak: number;
  longestStreak: number;
  tracking: Record<string, boolean>; // Date string -> completion status
  createdAt: Date;
  updatedAt: Date;
}

const HabitSchema = new Schema<IHabit>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  category: {
    type: String,
    required: true,
    enum: ['health', 'productivity', 'learning', 'social', 'mindfulness', 'other'],
  },
  frequency: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  completed: {
    type: Number,
    default: 0,
    min: 0,
  },
  streak: {
    type: Number,
    default: 0,
    min: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
    min: 0,
  },
  tracking: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Create indexes for efficient queries
HabitSchema.index({ userId: 1, isActive: 1 });
HabitSchema.index({ userId: 1, category: 1 });
HabitSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Habit || mongoose.model<IHabit>('Habit', HabitSchema); 
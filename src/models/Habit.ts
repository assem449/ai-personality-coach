import mongoose, { Document, Schema } from 'mongoose';

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: 'health' | 'productivity' | 'learning' | 'social' | 'mindfulness' | 'other';
  frequency: 'daily' | 'weekly' | 'monthly';
  goal: number; // Target number of completions
  completed: number; // Current number of completions
  streak: number; // Current streak count
  longestStreak: number; // Longest streak achieved
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  tracking?: Record<string, boolean>; // Daily tracking data
  reminders: {
    enabled: boolean;
    time: string; // HH:MM format
    days: number[]; // 0-6 (Sunday-Saturday)
  };
  createdAt: Date;
  updatedAt: Date;
}

const HabitSchema = new Schema<IHabit>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
  },
  goal: {
    type: Number,
    required: true,
    min: 1,
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
  isActive: {
    type: Boolean,
    default: true,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  tracking: {
    type: Schema.Types.Mixed, // Store as object with date keys
    default: {},
  },
  reminders: {
    enabled: {
      type: Boolean,
      default: false,
    },
    time: {
      type: String,
      match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, // HH:MM format
    },
    days: [{
      type: Number,
      min: 0,
      max: 6,
    }],
  },
}, {
  timestamps: true,
});

// Create indexes for efficient queries
HabitSchema.index({ userId: 1, isActive: 1 });
HabitSchema.index({ userId: 1, category: 1 });
HabitSchema.index({ userId: 1, startDate: -1 });

export default mongoose.models.Habit || mongoose.model<IHabit>('Habit', HabitSchema); 
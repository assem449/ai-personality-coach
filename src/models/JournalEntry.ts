import mongoose, { Schema, Document } from 'mongoose';

export interface IJournalEntry extends Document {
  userId: string; // Auth0 user ID
  title: string;
  content: string;
  mood: 'happy' | 'sad' | 'excited' | 'anxious' | 'calm' | 'frustrated' | 'grateful' | 'neutral';
  tags: string[];
  isPrivate: boolean;
  aiAnalysis?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    motivationLevel: number; // 1-5 scale
    summary: string;
    insights: string[];
    moodKeywords: string[];
    analyzedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const JournalEntrySchema = new Schema<IJournalEntry>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000,
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'excited', 'anxious', 'calm', 'frustrated', 'grateful', 'neutral'],
    required: true,
  },
  tags: [{
    type: String,
    maxlength: 50,
  }],
  isPrivate: {
    type: Boolean,
    default: false,
  },
  aiAnalysis: {
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
    },
    motivationLevel: {
      type: Number,
      min: 1,
      max: 5,
    },
    summary: {
      type: String,
      maxlength: 500,
    },
    insights: [{
      type: String,
      maxlength: 200,
    }],
    moodKeywords: [{
      type: String,
      maxlength: 50,
    }],
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
}, {
  timestamps: true,
});

// Create indexes for efficient queries
JournalEntrySchema.index({ userId: 1, createdAt: -1 });
JournalEntrySchema.index({ userId: 1, mood: 1 });
JournalEntrySchema.index({ userId: 1, 'aiAnalysis.sentiment': 1 });
JournalEntrySchema.index({ userId: 1, isPrivate: 1 });

export default mongoose.models.JournalEntry || mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema); 
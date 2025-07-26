import mongoose, { Document, Schema } from 'mongoose';

export interface IJournalEntry extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  title: string;
  content: string;
  mood: {
    rating: number; // 1-10 scale
    description: string;
  };
  tags: string[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JournalEntrySchema = new Schema<IJournalEntry>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    description: {
      type: String,
      maxlength: 100,
    },
  },
  tags: [{
    type: String,
    maxlength: 50,
  }],
  isPrivate: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Create compound index for efficient queries
JournalEntrySchema.index({ userId: 1, date: -1 });
JournalEntrySchema.index({ userId: 1, tags: 1 });

export default mongoose.models.JournalEntry || mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema); 
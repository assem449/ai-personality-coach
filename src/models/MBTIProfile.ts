import mongoose, { Schema, Document } from 'mongoose';

export interface IMBTIProfile extends Document {
  userId: string; // Auth0 user ID
  mbtiType: string;
  confidence: number;
  assessmentDate: Date;
  answers: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const MBTIProfileSchema = new Schema<IMBTIProfile>({
  userId: {
    type: String,
    required: true,
  },
  mbtiType: {
    type: String,
    required: true,
    enum: [
      'INTJ', 'INTP', 'ENTJ', 'ENTP',
      'INFJ', 'INFP', 'ENFJ', 'ENFP',
      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
      'ISTP', 'ISFP', 'ESTP', 'ESFP'
    ],
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  assessmentDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  answers: {
    type: Schema.Types.Mixed,
    required: true,
  },
}, {
  timestamps: true,
});

// Ensure unique user profile (one MBTI profile per user)
MBTIProfileSchema.index({ userId: 1 }, { unique: true });

export default mongoose.models.MBTIProfile || mongoose.model<IMBTIProfile>('MBTIProfile', MBTIProfileSchema); 
import mongoose, { Document, Schema } from 'mongoose';

export interface IMBTIProfile extends Document {
  userId: mongoose.Types.ObjectId;
  mbtiType: string;
  assessmentDate: Date;
  scores: {
    E: number; // Extraversion
    I: number; // Introversion
    S: number; // Sensing
    N: number; // Intuition
    T: number; // Thinking
    F: number; // Feeling
    J: number; // Judging
    P: number; // Perceiving
  };
  confidence: number; // 0-100 percentage
  questionsAnswered: number;
  totalQuestions: number;
  insights: {
    strengths: string[];
    weaknesses: string[];
    careerSuggestions: string[];
    relationshipAdvice: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const MBTIProfileSchema = new Schema<IMBTIProfile>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
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
  assessmentDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  scores: {
    E: { type: Number, required: true, min: 0, max: 100 },
    I: { type: Number, required: true, min: 0, max: 100 },
    S: { type: Number, required: true, min: 0, max: 100 },
    N: { type: Number, required: true, min: 0, max: 100 },
    T: { type: Number, required: true, min: 0, max: 100 },
    F: { type: Number, required: true, min: 0, max: 100 },
    J: { type: Number, required: true, min: 0, max: 100 },
    P: { type: Number, required: true, min: 0, max: 100 },
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  questionsAnswered: {
    type: Number,
    required: true,
    min: 0,
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1,
  },
  insights: {
    strengths: [{
      type: String,
      maxlength: 200,
    }],
    weaknesses: [{
      type: String,
      maxlength: 200,
    }],
    careerSuggestions: [{
      type: String,
      maxlength: 200,
    }],
    relationshipAdvice: [{
      type: String,
      maxlength: 200,
    }],
  },
}, {
  timestamps: true,
});

// Create indexes for efficient queries
MBTIProfileSchema.index({ userId: 1 });
MBTIProfileSchema.index({ mbtiType: 1 });

export default mongoose.models.MBTIProfile || mongoose.model<IMBTIProfile>('MBTIProfile', MBTIProfileSchema); 
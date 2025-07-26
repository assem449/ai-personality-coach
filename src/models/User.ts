import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  auth0Id: string; // Auth0's 'sub' field
  email: string;
  name: string;
  picture?: string;
  emailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  auth0Id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Ensure unique indexes
UserSchema.index({ auth0Id: 1 });
UserSchema.index({ email: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 
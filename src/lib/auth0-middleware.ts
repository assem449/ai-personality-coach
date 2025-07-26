import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

export interface AuthenticatedUser {
  auth0Id: string;
  email: string;
  name: string;
  picture?: string;
  emailVerified?: boolean;
}

/**
 * For now, we'll use a simplified approach since Auth0 SDK isn't fully integrated
 * This can be extended later with proper Auth0 session handling
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // For development/testing, we'll use a test user
    // In production, this would extract user info from Auth0 session/token
    const testUser: AuthenticatedUser = {
      auth0Id: 'test-auth0-id',
      email: 'test@example.com',
      name: 'Test User',
      emailVerified: true,
    };
    
    return testUser;
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

/**
 * Middleware to ensure user exists in database and return user data
 */
export async function ensureUserInDatabase(authUser: AuthenticatedUser): Promise<any> {
  try {
    await connectDB();
    
    // Check if user exists
    let user = await User.findOne({ auth0Id: authUser.auth0Id });
    
    if (!user) {
      // Create new user
      user = await User.create({
        auth0Id: authUser.auth0Id,
        email: authUser.email,
        name: authUser.name,
        picture: authUser.picture,
        emailVerified: authUser.emailVerified,
      });
      console.log('Created new user:', user.email);
    } else {
      // Update existing user info
      user.email = authUser.email;
      user.name = authUser.name;
      user.picture = authUser.picture;
      user.emailVerified = authUser.emailVerified;
      await user.save();
    }
    
    return user;
  } catch (error) {
    console.error('Error ensuring user in database:', error);
    throw error;
  }
}

/**
 * Middleware to protect API routes - requires authentication
 */
export async function requireAuth(request: NextRequest): Promise<{ user: any; authUser: AuthenticatedUser }> {
  const authUser = await getAuthenticatedUser(request);
  
  if (!authUser) {
    throw new Error('Authentication required');
  }
  
  const user = await ensureUserInDatabase(authUser);
  
  return { user, authUser };
}

/**
 * Helper to create error response for authentication failures
 */
export function createAuthErrorResponse(message: string = 'Authentication required', status: number = 401) {
  return NextResponse.json(
    { 
      success: false, 
      error: message,
      code: 'AUTH_REQUIRED'
    },
    { status }
  );
}

/**
 * Helper to create error response for authorization failures
 */
export function createForbiddenResponse(message: string = 'Access forbidden') {
  return NextResponse.json(
    { 
      success: false, 
      error: message,
      code: 'FORBIDDEN'
    },
    { status: 403 }
  );
} 
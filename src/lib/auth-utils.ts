import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export interface AuthUser {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export async function getSessionUser(request?: NextRequest): Promise<AuthUser | null> {
  try {
    let userCookie;
    
    if (request) {
      userCookie = request.cookies.get('auth0_user');
    } else {
      const cookieStore = await cookies();
      userCookie = cookieStore.get('auth0_user');
    }
    
    if (!userCookie?.value) {
      // For development, return a test user if no Auth0 session
      if (process.env.NODE_ENV === 'development') {
        return {
          sub: 'test-auth0-id',
          email: 'test@example.com',
          name: 'Test User',
        };
      }
      return null;
    }

    const user = JSON.parse(userCookie.value) as AuthUser;
    return user;
  } catch (error) {
    console.error('Error parsing session user:', error);
    return null;
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await getSessionUser(request);
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

export function createAuthErrorResponse(message: string = 'Authentication required') {
  return new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function createForbiddenResponse(message: string = 'Access forbidden') {
  return new Response(JSON.stringify({ error: message }), {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  });
} 
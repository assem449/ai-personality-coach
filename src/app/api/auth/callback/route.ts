import { NextRequest } from 'next/server';
import { ensureUser } from '@/lib/db-utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  
  if (error) {
    return Response.redirect(`${process.env.AUTH0_BASE_URL}?error=${error}`);
  }
  
  if (!code) {
    return Response.redirect(`${process.env.AUTH0_BASE_URL}?error=no_code`);
  }
  
  try {
    // Exchange code for tokens (simplified - in production you'd use Auth0 SDK)
    // For now, we'll redirect to dashboard and handle user creation there
    return Response.redirect(`${process.env.AUTH0_BASE_URL}/dashboard`);
  } catch (error) {
    console.error('Auth callback error:', error);
    return Response.redirect(`${process.env.AUTH0_BASE_URL}?error=auth_failed`);
  }
} 
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const returnTo = `${process.env.AUTH0_BASE_URL}`;
  
  const logoutUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout?` +
    `client_id=${process.env.AUTH0_CLIENT_ID}&` +
    `returnTo=${encodeURIComponent(returnTo)}`;

  const response = NextResponse.redirect(logoutUrl);
  
  // Clear the session cookie
  response.cookies.set('auth0_user', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  });

  return response;
} 
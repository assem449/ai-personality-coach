import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const redirectUri = `${process.env.AUTH0_BASE_URL}/api/auth/callback`;
  
  if (!auth0Domain || !clientId) {
    return new Response('Auth0 not configured', { status: 500 });
  }
  
  const loginUrl = `${auth0Domain}/authorize?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=openid profile email`;
  
  return Response.redirect(loginUrl);
} 
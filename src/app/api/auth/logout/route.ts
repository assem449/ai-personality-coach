import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const returnTo = process.env.AUTH0_BASE_URL;
  
  if (!auth0Domain || !clientId) {
    return new Response('Auth0 not configured', { status: 500 });
  }
  
  const logoutUrl = `${auth0Domain}/v2/logout?` +
    `client_id=${clientId}&` +
    `returnTo=${encodeURIComponent(returnTo || 'http://localhost:3000')}`;
  
  return Response.redirect(logoutUrl);
} 
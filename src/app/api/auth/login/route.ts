import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const redirectUri = `${process.env.AUTH0_BASE_URL}/api/auth/callback`;
  const scope = 'openid profile email';

  const authUrl = `${auth0Domain}/authorize?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${encodeURIComponent(scope)}&` +
    `state=${Math.random().toString(36).substring(7)}`;

  return NextResponse.redirect(authUrl);
} 
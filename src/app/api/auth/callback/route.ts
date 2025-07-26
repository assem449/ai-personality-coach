import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { createOrUpdateUser } from '@/lib/db-utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${process.env.AUTH0_BASE_URL}/?error=${error}`);
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.AUTH0_BASE_URL}/?error=no_code`);
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.AUTH0_BASE_URL}/api/auth/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return NextResponse.redirect(`${process.env.AUTH0_BASE_URL}/?error=token_exchange_failed`);
    }

    // Get user info
    const userResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error('User info fetch failed:', userData);
      return NextResponse.redirect(`${process.env.AUTH0_BASE_URL}/?error=user_info_failed`);
    }

    // Connect to MongoDB and create/update user
    await connectDB();
    
    const user = await createOrUpdateUser({
      auth0Id: userData.sub,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      emailVerified: userData.email_verified,
    });

    // Set session cookie (simplified - in production, use proper session management)
    const response = NextResponse.redirect(`${process.env.AUTH0_BASE_URL}/dashboard`);
    
    // Set a simple session cookie with user info
    response.cookies.set('auth0_user', JSON.stringify({
      sub: userData.sub,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(`${process.env.AUTH0_BASE_URL}/?error=callback_failed`);
  }
} 
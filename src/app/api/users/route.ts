import { NextRequest, NextResponse } from 'next/server';
import { ensureUser, getUserByAuth0Id } from '@/lib/db-utils';

export async function POST(request: NextRequest) {
  try {
    const { auth0Id, email, name, picture } = await request.json();
    
    if (!auth0Id || !email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const user = await ensureUser(auth0Id, { email, name, picture });
    
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        auth0Id: user.auth0Id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        mbtiType: user.mbtiType,
        preferences: user.preferences,
      }
    });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const auth0Id = searchParams.get('auth0Id');
    
    if (!auth0Id) {
      return NextResponse.json(
        { error: 'auth0Id is required' },
        { status: 400 }
      );
    }

    const user = await getUserByAuth0Id(auth0Id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        auth0Id: user.auth0Id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        mbtiType: user.mbtiType,
        preferences: user.preferences,
      }
    });
  } catch (error) {
    console.error('User retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve user' },
      { status: 500 }
    );
  }
} 
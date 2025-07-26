import { NextRequest } from 'next/server';

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
  
  // For now, just redirect back to home page
  // In a full implementation, you would exchange the code for tokens here
  return Response.redirect(`${process.env.AUTH0_BASE_URL}/dashboard`);
} 
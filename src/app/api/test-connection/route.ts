import { NextResponse } from 'next/server';

export async function GET() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    return NextResponse.json({
      success: false,
      error: 'MONGODB_URI not found in environment variables'
    });
  }

  // Check if URI has the correct format
  const isValidFormat = uri.includes('mongodb+srv://') && 
                       uri.includes('@') && 
                       uri.includes('.mongodb.net/');

  // Extract parts for debugging (without exposing credentials)
  const parts = uri.split('@');
  const hasCredentials = parts.length === 2;
  const hasCluster = uri.includes('.mongodb.net');

  return NextResponse.json({
    success: true,
    connectionInfo: {
      hasUri: !!uri,
      isValidFormat,
      hasCredentials,
      hasCluster,
      uriLength: uri.length,
      // Show first and last few characters for debugging
      uriStart: uri.substring(0, 20) + '...',
      uriEnd: '...' + uri.substring(uri.length - 30)
    }
  });
} 
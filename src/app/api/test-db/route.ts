import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    // Test the connection
    await connectDB();
    
    console.log('MongoDB connection successful!');
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connection successful!' 
    });
  } catch (error: any) {
    console.error('MongoDB connection error details:', {
      message: error.message,
      code: error.code,
      codeName: error.codeName,
      name: error.name,
      stack: error.stack
    });
    
    // Provide specific guidance based on error type
    let guidance = 'Unknown error occurred';
    
    if (error.code === 8000) {
      guidance = 'Authentication failed. Please check your username and password in the connection string.';
    } else if (error.code === 18) {
      guidance = 'Authentication failed. Please verify your database user credentials.';
    } else if (error.message.includes('ENOTFOUND')) {
      guidance = 'Could not resolve hostname. Please check your cluster URL.';
    } else if (error.message.includes('ECONNREFUSED')) {
      guidance = 'Connection refused. Please check your network access settings in MongoDB Atlas.';
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to connect to MongoDB',
        guidance,
        details: {
          message: error.message,
          code: error.code,
          codeName: error.codeName
        }
      },
      { status: 500 }
    );
  }
} 
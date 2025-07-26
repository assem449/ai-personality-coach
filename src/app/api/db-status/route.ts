import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    
    // Get database info
    const db = mongoose.connection.db;
    
    if (!db) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection not established'
        },
        { status: 500 }
      );
    }
    
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    return NextResponse.json({
      success: true,
      database: {
        name: db.databaseName,
        collections: collectionNames,
        connectionState: mongoose.connection.readyState
      },
      message: 'Database is ready for development!'
    });
  } catch (error: any) {
    console.error('Database status error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get database status',
        message: error.message
      },
      { status: 500 }
    );
  }
} 
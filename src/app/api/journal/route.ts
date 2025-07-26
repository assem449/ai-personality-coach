import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { createJournalEntry, getJournalEntries } from '@/lib/db-utils';
import { requireAuth, createAuthErrorResponse } from '@/lib/auth-utils';
import { analyzeJournalEntry } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    const { title, content, mood, tags, isPrivate } = await request.json();
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Journal content is required'
      }, { status: 400 });
    }

    await connectDB();

    // Analyze journal entry with AI
    let aiAnalysis;
    try {
      aiAnalysis = await analyzeJournalEntry(content);
    } catch (error) {
      console.error('AI analysis failed:', error);
      // Provide fallback analysis
      aiAnalysis = {
        sentiment: 'neutral' as const,
        motivationLevel: 3,
        summary: 'Journal entry recorded successfully.',
        insights: ['Your entry has been saved for future reflection.'],
        moodKeywords: ['reflection']
      };
    }

    // Create journal entry
    const entry = await createJournalEntry(authUser.sub, {
      title: title || 'Daily Reflection',
      content,
      mood: mood || 'neutral',
      tags: tags || [],
      isPrivate: isPrivate || false,
      aiAnalysis,
    });

    return NextResponse.json({
      success: true,
      entry: {
        _id: entry._id,
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        aiAnalysis: entry.aiAnalysis,
        createdAt: entry.createdAt,
      }
    });

  } catch (error) {
    console.error('Journal creation error:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthErrorResponse();
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create journal entry'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const isPrivate = searchParams.get('isPrivate') === 'true';
    
    await connectDB();
    
    const entries = await getJournalEntries(authUser.sub, limit, page, isPrivate);
    
    return NextResponse.json({
      success: true,
      entries: entries.map(entry => ({
        _id: entry._id,
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        tags: entry.tags,
        isPrivate: entry.isPrivate,
        aiAnalysis: entry.aiAnalysis,
        createdAt: entry.createdAt,
      }))
    });

  } catch (error) {
    console.error('Journal fetch error:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthErrorResponse();
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch journal entries'
    }, { status: 500 });
  }
} 
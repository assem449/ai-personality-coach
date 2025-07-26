import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createAuthErrorResponse } from '@/lib/auth0-middleware';
import { createJournalEntry, getJournalEntries } from '@/lib/db-utils';
import { analyzeJournalEntry } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { authUser } = await requireAuth(request);
    const { title, content, mood, tags, isPrivate } = await request.json();

    if (!title || !content || !mood) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Analyze journal entry with AI
    let aiAnalysis;
    try {
      aiAnalysis = await analyzeJournalEntry(content);
    } catch (aiError) {
      console.error('AI analysis failed:', aiError);
      // Continue without AI analysis
      aiAnalysis = {
        sentiment: 'neutral' as const,
        motivationLevel: 3,
        summary: 'Analysis unavailable',
        insights: ['Consider reflecting on your day'],
        moodKeywords: ['reflective'],
      };
    }

    // Create journal entry
    const journalEntry = await createJournalEntry(authUser.auth0Id, {
      title,
      content,
      mood,
      tags: tags || [],
      isPrivate: isPrivate || false,
      aiAnalysis,
    });

    return NextResponse.json({
      success: true,
      entry: {
        id: journalEntry._id,
        title: journalEntry.title,
        content: journalEntry.content,
        mood: journalEntry.mood,
        aiAnalysis: journalEntry.aiAnalysis,
        createdAt: journalEntry.createdAt,
      },
    });

  } catch (error) {
    console.error('Journal creation error:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthErrorResponse();
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create journal entry' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { authUser } = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const isPrivate = searchParams.get('private') === 'true';

    const entries = await getJournalEntries(authUser.auth0Id, limit, page, isPrivate);

    return NextResponse.json({
      success: true,
      entries: entries.map(entry => ({
        id: entry._id,
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        tags: entry.tags,
        isPrivate: entry.isPrivate,
        aiAnalysis: entry.aiAnalysis,
        createdAt: entry.createdAt,
      })),
      pagination: {
        page,
        limit,
        total: entries.length,
      },
    });

  } catch (error) {
    console.error('Journal retrieval error:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthErrorResponse();
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve journal entries' },
      { status: 500 }
    );
  }
} 
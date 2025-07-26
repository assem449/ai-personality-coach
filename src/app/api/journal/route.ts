import { NextRequest, NextResponse } from 'next/server';
import { createJournalEntry, getJournalEntries, ensureUser } from '@/lib/db-utils';
import { analyzeJournalEntry } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { title, content, mood, tags, isPrivate } = await request.json();
    
    if (!title || !content || !mood) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, mood' },
        { status: 400 }
      );
    }

    // Create or get user (for demo purposes)
    const user = await ensureUser('test-auth0-id', {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://via.placeholder.com/150'
    });

    // Analyze the journal entry using Gemini AI
    console.log('Analyzing journal entry with AI...');
    const aiAnalysis = await analyzeJournalEntry(content);
    console.log('AI Analysis completed:', aiAnalysis);

    // Create the journal entry with AI analysis
    const journalEntry = await createJournalEntry(user._id.toString(), {
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
        tags: journalEntry.tags,
        isPrivate: journalEntry.isPrivate,
        date: journalEntry.date,
        aiAnalysis: journalEntry.aiAnalysis,
      }
    });
  } catch (error) {
    console.error('Journal creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create journal entry' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    // Create or get user (for demo purposes)
    const user = await ensureUser('test-auth0-id', {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://via.placeholder.com/150'
    });

    const entries = await getJournalEntries(user._id.toString(), limit, page);
    
    return NextResponse.json({
      success: true,
      entries: entries.map(entry => ({
        id: entry._id,
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        tags: entry.tags,
        isPrivate: entry.isPrivate,
        date: entry.date,
        aiAnalysis: entry.aiAnalysis,
      }))
    });
  } catch (error) {
    console.error('Journal retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve journal entries' },
      { status: 500 }
    );
  }
} 
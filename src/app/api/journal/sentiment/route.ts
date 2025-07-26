import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getJournalEntries } from '@/lib/db-utils';
import { requireAuth, createAuthErrorResponse } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    await connectDB();
    
    // Get journal entries for the last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    const entries = await getJournalEntries(authUser.sub, 50, 1);
    
    // Filter entries from the last 7 days and group by date
    const dailyData: Record<string, { sentiment: string; motivationLevel: number; entryCount: number }> = {};
    
    // Initialize all days in the range
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = { sentiment: 'neutral', motivationLevel: 0, entryCount: 0 };
    }
    
    // Process entries
    entries.forEach(entry => {
      const entryDate = new Date(entry.createdAt);
      const dateStr = entryDate.toISOString().split('T')[0];
      
      if (dailyData[dateStr]) {
        dailyData[dateStr].entryCount++;
        
        if (entry.aiAnalysis) {
          // Aggregate sentiment (use the most recent one for the day)
          dailyData[dateStr].sentiment = entry.aiAnalysis.sentiment;
          dailyData[dateStr].motivationLevel = entry.aiAnalysis.motivationLevel;
        }
      }
    });
    
    // Convert to array format for charting
    const chartData = Object.entries(dailyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date,
        sentiment: data.sentiment,
        motivationLevel: data.motivationLevel,
        entryCount: data.entryCount,
      }));
    
    return NextResponse.json({
      success: true,
      data: chartData
    });

  } catch (error) {
    console.error('Error fetching sentiment data:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthErrorResponse();
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch sentiment data'
    }, { status: 500 });
  }
} 
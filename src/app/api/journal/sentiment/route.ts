import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createAuthErrorResponse } from '@/lib/auth0-middleware';
import { getJournalEntries } from '@/lib/db-utils';

export async function GET(request: NextRequest) {
  try {
    const { authUser } = await requireAuth(request);

    // Get journal entries from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const entries = await getJournalEntries(authUser.auth0Id, 50, 1);
    
    // Filter entries from last 7 days and extract sentiment data
    const recentEntries = entries.filter(entry => 
      new Date(entry.createdAt) >= sevenDaysAgo
    );

    // Create daily sentiment data
    const dailySentiment: { [key: string]: { sentiment: string; count: number; avgMotivation: number } } = {};
    
    // Initialize last 7 days with default values
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      dailySentiment[dateKey] = { sentiment: 'neutral', count: 0, avgMotivation: 0 };
    }

    // Process entries and calculate daily averages
    recentEntries.forEach(entry => {
      if (entry.aiAnalysis) {
        const dateKey = new Date(entry.createdAt).toISOString().split('T')[0];
        
        if (dailySentiment[dateKey]) {
          dailySentiment[dateKey].count++;
          
          // Convert sentiment to numeric for averaging
          const sentimentValue = entry.aiAnalysis.sentiment === 'positive' ? 1 : 
                                entry.aiAnalysis.sentiment === 'negative' ? -1 : 0;
          
          // Calculate running average
          const currentAvg = dailySentiment[dateKey].avgMotivation;
          const newCount = dailySentiment[dateKey].count;
          dailySentiment[dateKey].avgMotivation = 
            (currentAvg * (newCount - 1) + entry.aiAnalysis.motivationLevel) / newCount;
          
          // Determine dominant sentiment for the day
          if (sentimentValue > 0) {
            dailySentiment[dateKey].sentiment = 'positive';
          } else if (sentimentValue < 0) {
            dailySentiment[dateKey].sentiment = 'negative';
          }
        }
      }
    });

    // Convert to chart format
    const chartData = Object.entries(dailySentiment).map(([date, data]) => ({
      date,
      sentiment: data.sentiment,
      motivationLevel: Math.round(data.avgMotivation * 10) / 10, // Round to 1 decimal
      entryCount: data.count
    }));

    return NextResponse.json({
      success: true,
      data: chartData,
      totalEntries: recentEntries.length
    });

  } catch (error) {
    console.error('Error fetching sentiment data:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthErrorResponse();
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sentiment data' },
      { status: 500 }
    );
  }
} 
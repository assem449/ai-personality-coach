import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createAuthErrorResponse } from '@/lib/auth-utils';
import connectDB from '@/lib/mongodb';
import { getMBTIProfile, getJournalEntries, getHabits } from '@/lib/db-utils';
import { generateJSON } from '@/lib/gemini';
import { getHardcodedRecommendations } from '@/lib/hardcoded-responses';

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    await connectDB();
    
    // Fetch user data
    const mbtiProfile = await getMBTIProfile(authUser.sub);
    const recentEntries = await getJournalEntries(authUser.sub);
    const currentHabits = await getHabits(authUser.sub, true);
    
    if (!mbtiProfile) {
      return NextResponse.json({
        success: false,
        error: 'MBTI profile not found. Please complete the personality assessment first.'
      }, { status: 404 });
    }

    // Prepare context for AI
    const habitStats = currentHabits.length > 0 ? {
      totalHabits: currentHabits.length,
      avgStreak: Math.round(currentHabits.reduce((sum, h) => sum + (h.streak || 0), 0) / currentHabits.length),
      longestStreak: Math.max(...currentHabits.map(h => h.longestStreak || 0))
    } : { totalHabits: 0, avgStreak: 0, longestStreak: 0 };

    const recentMood = recentEntries.length > 0 && recentEntries[0].aiAnalysis 
      ? recentEntries[0].aiAnalysis.sentiment 
      : 'neutral';

    const context = `
MBTI Type: ${mbtiProfile.mbtiType} (${mbtiProfile.confidence}% confidence)
Recent Mood: ${recentMood}
Current Habits: ${currentHabits.length} active habits
Average Streak: ${habitStats.avgStreak} days
Longest Streak: ${habitStats.longestStreak} days

Recent Journal Themes: ${recentEntries.slice(0, 3).map(entry => 
  entry.aiAnalysis?.summary || entry.content.substring(0, 100)
).join('; ')}

Current Habits: ${currentHabits.map(h => `${h.title} (${h.streak || 0} day streak)`).join(', ')}
`;

    const prompt = `
Based on this user's MBTI personality type and current patterns, provide personalized recommendations.

User Context:
${context}

Please provide 3 specific habit recommendations and 3 career path suggestions that would be particularly well-suited for this personality type and current situation.

Focus on:
- Habits that align with their MBTI strengths
- Career paths that leverage their natural preferences
- Practical, actionable suggestions
- Consider their current mood and habit patterns

Return the response as JSON with this exact structure:
{
  "habits": [
    {
      "title": "Habit name",
      "description": "Why this habit would work well for this personality type"
    }
  ],
  "careerPaths": [
    {
      "title": "Career path name", 
      "description": "Why this career path aligns with their MBTI type"
    }
  ]
}
`;

    try {
      const aiResponse = await generateJSON(prompt);
      
      return NextResponse.json({
        success: true,
        recommendations: aiResponse,
        context: {
          mbtiType: mbtiProfile.mbtiType,
          confidence: mbtiProfile.confidence,
          recentMood,
          habitStats
        }
      });

    } catch (aiError) {
      console.error('AI recommendation generation failed:', aiError);
      
      // Immediately use hardcoded recommendations when AI fails
      const hardcodedRecommendations = getHardcodedRecommendations(mbtiProfile.mbtiType);
      
      // Determine the type of error for better user feedback
      let note = 'AI recommendations temporarily unavailable. Showing personality-based suggestions.';
      if (aiError instanceof Error) {
        if (aiError.message.includes('rate limit') || aiError.message.includes('429')) {
          note = 'AI service is currently busy. Showing personality-based recommendations instead.';
        } else if (aiError.message.includes('API key') || aiError.message.includes('not configured')) {
          note = 'AI service not configured. Showing personality-based recommendations.';
        } else if (aiError.message.includes('quota')) {
          note = 'AI service quota exceeded. Showing personality-based recommendations.';
        } else if (aiError.message.includes('hardcoded fallback')) {
          note = 'Using personality-based recommendations for optimal performance.';
        }
      }
      
      return NextResponse.json({
        success: true,
        recommendations: hardcodedRecommendations,
        context: {
          mbtiType: mbtiProfile.mbtiType,
          confidence: mbtiProfile.confidence,
          recentMood,
          habitStats
        },
        note
      });
    }

  } catch (error) {
    console.error('Recommendations error:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthErrorResponse();
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate recommendations'
    }, { status: 500 });
  }
} 
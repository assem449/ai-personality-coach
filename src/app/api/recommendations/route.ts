import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createAuthErrorResponse } from '@/lib/auth0-middleware';
import { getMBTIProfile, getJournalEntries, getHabits } from '@/lib/db-utils';
import { generateText } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { authUser } = await requireAuth(request);
    const { limit = 5 } = await request.json();

    // Get user's MBTI profile
    const mbtiProfile = await getMBTIProfile(authUser.auth0Id);
    if (!mbtiProfile) {
      return NextResponse.json(
        { success: false, error: 'MBTI profile not found. Please complete the quiz first.' },
        { status: 404 }
      );
    }

    // Get recent journal entries
    const recentEntries = await getJournalEntries(authUser.auth0Id, limit, 1);
    
    // Get current habits
    const currentHabits = await getHabits(authUser.auth0Id, true);
    
    // Calculate habit statistics
    const activeHabits = currentHabits.filter(habit => habit.isActive);
    const totalCompletions = activeHabits.reduce((sum, habit) => sum + habit.completed, 0);
    const averageStreak = activeHabits.length > 0 
      ? activeHabits.reduce((sum, habit) => sum + habit.streak, 0) / activeHabits.length 
      : 0;

    // Prepare context for AI
    const journalContext = recentEntries.map(entry => ({
      title: entry.title,
      content: entry.content.substring(0, 200) + '...',
      mood: entry.mood,
      sentiment: entry.aiAnalysis?.sentiment || 'neutral',
      motivation: entry.aiAnalysis?.motivationLevel || 3,
    }));

    const habitContext = activeHabits.map(habit => ({
      title: habit.title,
      category: habit.category,
      streak: habit.streak,
      completed: habit.completed,
    }));

    // Generate AI recommendations
    const prompt = `
Based on the following user profile and data, provide personalized recommendations for habits and career paths.

MBTI Profile:
- Type: ${mbtiProfile.mbtiType}
- Assessment Date: ${mbtiProfile.assessmentDate}
- Confidence: ${mbtiProfile.confidence}%

Current Habits (${activeHabits.length} active):
${habitContext.map(h => `- ${h.title} (${h.category}): ${h.completed} completions, ${h.streak} day streak`).join('\n')}

Recent Journal Entries (${recentEntries.length} entries):
${journalContext.map(j => `- "${j.title}": ${j.sentiment} sentiment, motivation level ${j.motivation}`).join('\n')}

Statistics:
- Total habit completions: ${totalCompletions}
- Average streak: ${averageStreak.toFixed(1)} days

Please provide recommendations in the following JSON format:
{
  "habits": [
    {
      "title": "Habit name",
      "description": "Why this habit would be beneficial for this MBTI type and current patterns"
    }
  ],
  "careerPaths": [
    {
      "title": "Career path name", 
      "description": "Why this career path aligns with their personality and current habits"
    }
  ]
}

Guidelines:
- Suggest 3 habits that complement their current patterns or address gaps
- Consider their MBTI type's strengths and preferences
- Suggest 3 career paths that leverage their personality type
- Make recommendations specific to their current habit patterns and journal sentiment
- If they have few habits, suggest foundational habits
- If they have good habits, suggest optimization habits
`;

    try {
      const aiResponse = await generateText(prompt, { 
        model: 'gemini-1.5-pro',
        temperature: 0.7,
        maxTokens: 1500,
        retries: 1
      });

      // Parse AI response
      const recommendations = JSON.parse(aiResponse);

      return NextResponse.json({
        success: true,
        habits: recommendations.habits || [],
        careerPaths: recommendations.careerPaths || [],
        context: {
          mbtiType: mbtiProfile.mbtiType,
          mbtiConfidence: mbtiProfile.confidence,
          activeHabitsCount: activeHabits.length,
          totalCompletions,
          averageStreak,
        },
      });

    } catch (aiError) {
      console.error('AI recommendation generation failed:', aiError);
      
      // Fallback recommendations
      const fallbackRecommendations = {
        habits: [
          {
            title: "Morning Reflection",
            description: "Start your day with 10 minutes of quiet reflection to align with your ${mbtiProfile.mbtiType} preferences."
          },
          {
            title: "Weekly Planning",
            description: "Set aside time each week to plan and organize, leveraging your natural strengths."
          },
          {
            title: "Mindful Movement",
            description: "Incorporate gentle physical activity to balance your mental and physical well-being."
          }
        ],
        careerPaths: [
          {
            title: "Analytical Roles",
            description: "Consider careers that leverage your ${mbtiProfile.mbtiType} analytical and systematic thinking."
          },
          {
            title: "Creative Problem Solving",
            description: "Explore roles that allow you to use your unique perspective and innovative thinking."
          },
          {
            title: "Strategic Planning",
            description: "Look into positions that require long-term thinking and strategic decision-making."
          }
        ]
      };

      return NextResponse.json({
        success: true,
        ...fallbackRecommendations,
        context: {
          mbtiType: mbtiProfile.mbtiType,
          mbtiConfidence: mbtiProfile.confidence,
          activeHabitsCount: activeHabits.length,
          totalCompletions,
          averageStreak,
        },
        note: "AI recommendations temporarily unavailable. Showing fallback recommendations."
      });
    }

  } catch (error) {
    console.error('Recommendations error:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthErrorResponse();
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
} 
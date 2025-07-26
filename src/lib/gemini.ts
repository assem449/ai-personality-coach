import { GoogleGenerativeAI } from '@google/generative-ai';
import { getHardcodedMBTIInsights } from './hardcoded-responses';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface JournalAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  motivationLevel: number; // 1-5 scale
  summary: string;
  insights: string[];
  moodKeywords: string[];
}

/**
 * Check if Gemini API is properly configured
 */
function isGeminiConfigured(): boolean {
  return !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');
}

/**
 * Check if error is a rate limit error
 */
function isRateLimitError(error: any): boolean {
  return error?.status === 429 || 
         error?.message?.includes('Too Many Requests') ||
         error?.message?.includes('rate limit') ||
         error?.message?.includes('quota');
}

/**
 * Wait for a specified number of milliseconds
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * General-purpose function to generate text using Gemini AI with retry logic
 * @param prompt - The prompt string to send to Gemini
 * @param options - Optional configuration
 * @returns Generated text response
 */
export async function generateText(
  prompt: string, 
  options: {
    model?: 'gemini-1.5-pro' | 'gemini-1.5-flash' | 'gemini-pro';
    temperature?: number;
    maxTokens?: number;
    retries?: number;
    useHardcodedFallback?: boolean;
  } = {}
): Promise<string> {
  const { 
    model = 'gemini-1.5-pro', 
    temperature = 0.7, 
    maxTokens = 1000,
    retries = 1, // Reduced retries since we have hardcoded fallback
    useHardcodedFallback = true
  } = options;

  try {
    // Check if Gemini is configured
    if (!isGeminiConfigured()) {
      throw new Error('Gemini API key not configured');
    }

    const geminiModel = genAI.getGenerativeModel({ 
      model,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      }
    });

    let lastError: any;
    
    // Retry logic with exponential backoff (reduced retries)
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
      } catch (error) {
        lastError = error;
        
        // If it's a rate limit error and we have retries left, wait and retry
        if (isRateLimitError(error) && attempt < retries) {
          const waitTime = Math.pow(2, attempt + 1) * 1000; // Exponential backoff: 2s, 4s
          console.log(`Rate limit hit, waiting ${waitTime}ms before retry ${attempt + 1}/${retries}`);
          await delay(waitTime);
          continue;
        }
        
        // If it's a rate limit error and we're out of retries, throw immediately
        if (isRateLimitError(error)) {
          throw new Error('Gemini API rate limit exceeded. Using hardcoded fallback.');
        }
        
        // If it's not a rate limit error, break immediately
        break;
      }
    }
    
    // If we get here, all retries failed
    throw lastError;
    
  } catch (error) {
    console.error('Gemini AI text generation error:', error);
    
    // If it's a configuration error, provide helpful message
    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error('Gemini API not configured. Please add GEMINI_API_KEY to your environment variables.');
    }
    
    // If it's a rate limit error, provide helpful message
    if (isRateLimitError(error)) {
      throw new Error('Gemini API rate limit exceeded. Using hardcoded fallback.');
    }
    
    throw new Error(`Failed to generate text: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate a response with structured JSON output
 * @param prompt - The prompt string
 * @param jsonSchema - Optional JSON schema description
 * @returns Parsed JSON response
 */
export async function generateJSON(
  prompt: string, 
  jsonSchema?: string
): Promise<any> {
  try {
    const fullPrompt = jsonSchema 
      ? `${prompt}\n\nReturn ONLY a valid JSON object${jsonSchema ? ` following this schema: ${jsonSchema}` : ''}.`
      : `${prompt}\n\nReturn ONLY a valid JSON object, no additional text.`;

    const response = await generateText(fullPrompt, { temperature: 0.3, retries: 1 });
    
    // Clean the response and parse JSON
    const cleanedText = response.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Raw response:', cleanedText);
      throw new Error('Failed to parse AI response as JSON');
    }
  } catch (error) {
    console.error('Gemini AI JSON generation error:', error);
    
    // If it's a configuration error, provide helpful message
    if (error instanceof Error && error.message.includes('not configured')) {
      throw new Error('Gemini API not configured. Please add GEMINI_API_KEY to your environment variables.');
    }
    
    // If it's a rate limit error, provide helpful message
    if (isRateLimitError(error)) {
      throw new Error('Gemini API rate limit exceeded. Using hardcoded fallback.');
    }
    
    throw new Error(`Failed to generate JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate creative content with higher temperature
 * @param prompt - The creative prompt
 * @returns Creative text response
 */
export async function generateCreativeText(prompt: string): Promise<string> {
  return generateText(prompt, { temperature: 0.9, maxTokens: 1500 });
}

/**
 * Generate factual/analytical content with lower temperature
 * @param prompt - The analytical prompt
 * @returns Factual text response
 */
export async function generateAnalyticalText(prompt: string): Promise<string> {
  return generateText(prompt, { temperature: 0.2, maxTokens: 800 });
}

export async function analyzeJournalEntry(journalText: string): Promise<JournalAnalysis> {
  try {
    const prompt = `
Analyze the following journal entry and provide insights in JSON format:

Journal Entry:
"${journalText}"

Please analyze this journal entry and return a JSON object with the following structure:
{
  "sentiment": "positive|neutral|negative",
  "motivationLevel": 1-5,
  "summary": "A brief 2-3 sentence summary of the main themes",
  "insights": ["insight 1", "insight 2", "insight 3"],
  "moodKeywords": ["keyword1", "keyword2", "keyword3"]
}

Guidelines:
- Sentiment: Determine overall emotional tone (positive, neutral, negative)
- Motivation Level: Rate from 1 (very low) to 5 (very high) based on energy and drive expressed
- Summary: Capture main themes and emotional state
- Insights: Provide 3 actionable or reflective insights
- Mood Keywords: Extract 3-5 words that capture the emotional state

Return ONLY the JSON object, no additional text.
`;

    const analysis = await generateJSON(prompt);
    
    // Validate the response
    if (!analysis.sentiment || !analysis.motivationLevel || !analysis.summary) {
      throw new Error('Invalid analysis response structure');
    }
    
    // Ensure motivation level is within bounds
    analysis.motivationLevel = Math.max(1, Math.min(5, analysis.motivationLevel));
    
    return analysis as JournalAnalysis;
  } catch (error) {
    console.error('Gemini AI analysis error:', error);
    
    // Fallback analysis
    return {
      sentiment: 'neutral',
      motivationLevel: 3,
      summary: 'Unable to analyze entry at this time.',
      insights: ['Consider reflecting on your day', 'Focus on positive moments', 'Practice gratitude'],
      moodKeywords: ['reflective', 'neutral', 'contemplative']
    };
  }
}

export async function generateJournalPrompt(mood: string, previousEntry?: string): Promise<string> {
  try {
    const prompt = `
Based on the user's current mood (${mood}) and their previous journal entry, suggest a thoughtful journaling prompt.

Previous entry: ${previousEntry || 'No previous entry'}

Generate a single, engaging journaling prompt that encourages reflection and self-discovery. 
The prompt should be 1-2 sentences and feel personal and supportive.

Return ONLY the prompt text, no additional formatting.
`;

    return await generateText(prompt, { temperature: 0.8 });
  } catch (error) {
    console.error('Error generating journal prompt:', error);
    return 'How are you feeling today? What would you like to reflect on?';
  }
}

export interface MBTIInsights {
  careers: string[];
  habits: string[];
  motivationTip: string;
  strengths: string[];
  challenges: string[];
  learningStyle: string;
}

export async function generateMBTIInsights(mbtiType: string): Promise<MBTIInsights> {
  try {
    const prompt = `
Generate personalized insights for MBTI type ${mbtiType}. Return a JSON object with the following structure:

{
  "careers": ["career 1", "career 2", "career 3"],
  "habits": ["habit 1", "habit 2", "habit 3"],
  "motivationTip": "A personalized motivation tip for this MBTI type",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "challenges": ["challenge 1", "challenge 2", "challenge 3"],
  "learningStyle": "A brief description of the optimal learning style for this MBTI type"
}

Guidelines:
- Careers: Suggest 3 specific career paths that align with this personality type's strengths
- Habits: Recommend 3 daily habits that would benefit this personality type
- Motivation Tip: Provide one actionable motivation tip tailored to this type
- Strengths: List 3 key strengths commonly associated with this MBTI type
- Challenges: List 3 common challenges this type might face
- Learning Style: Describe the optimal learning approach for this personality type

Make the insights practical, actionable, and encouraging. Return ONLY the JSON object.
`;

    const insights = await generateJSON(prompt);
    
    // Validate the response
    if (!insights.careers || !insights.habits || !insights.motivationTip) {
      throw new Error('Invalid MBTI insights response structure');
    }
    
    return insights as MBTIInsights;
  } catch (error) {
    console.error('Error generating MBTI insights:', error);
    
    // Use hardcoded responses as final fallback
    return getHardcodedMBTIInsights(mbtiType);
  }
} 
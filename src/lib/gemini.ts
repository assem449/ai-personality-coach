import { GoogleGenerativeAI } from '@google/generative-ai';

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
 * General-purpose function to generate text using Gemini AI
 * @param prompt - The prompt string to send to Gemini
 * @param options - Optional configuration
 * @returns Generated text response
 */
export async function generateText(
  prompt: string, 
  options: {
    model?: 'gemini-pro' | 'gemini-pro-vision';
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  try {
    const { 
      model = 'gemini-pro', 
      temperature = 0.7, 
      maxTokens = 1000 
    } = options;

    const geminiModel = genAI.getGenerativeModel({ 
      model,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      }
    });

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini AI text generation error:', error);
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

    const response = await generateText(fullPrompt, { temperature: 0.3 });
    
    // Clean the response and parse JSON
    const cleanedText = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Gemini AI JSON generation error:', error);
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
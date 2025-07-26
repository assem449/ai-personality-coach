import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/gemini';

export async function GET(request: NextRequest) {
  try {
    // Check if API key is configured
    const hasApiKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');
    
    if (!hasApiKey) {
      return NextResponse.json({
        success: false,
        status: 'not_configured',
        message: 'GEMINI_API_KEY not found in environment variables',
        instructions: [
          '1. Go to https://makersuite.google.com/app/apikey',
          '2. Create a new API key',
          '3. Add GEMINI_API_KEY=your-key-here to your .env.local file',
          '4. Restart your development server'
        ]
      });
    }

    // Test the API with a simple prompt
    try {
      const testResponse = await generateText('Say "Hello" in one word.', { 
        model: 'gemini-1.5-pro',
        maxTokens: 10,
        retries: 1 // Only retry once for status check
      });
      
      return NextResponse.json({
        success: true,
        status: 'working',
        message: 'Gemini API is working correctly',
        testResponse: testResponse,
        apiKeyConfigured: true
      });
    } catch (apiError) {
      const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error';
      
      // Check if it's a rate limit error
      if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        return NextResponse.json({
          success: false,
          status: 'rate_limited',
          message: 'Gemini API rate limit exceeded',
          error: errorMessage,
          apiKeyConfigured: true,
          troubleshooting: [
            '1. Wait a few minutes before trying again',
            '2. Check your API quota in Google Cloud Console',
            '3. Consider upgrading your API quota if needed',
            '4. Reduce the frequency of API calls'
          ],
          note: 'The API key is working, but you have hit the rate limit. This is normal for free tier accounts.'
        });
      }
      
      return NextResponse.json({
        success: false,
        status: 'api_error',
        message: 'Gemini API key is configured but API call failed',
        error: errorMessage,
        apiKeyConfigured: true,
        troubleshooting: [
          '1. Verify your API key is correct',
          '2. Check if you have billing enabled in Google Cloud Console',
          '3. Ensure Gemini API is enabled in your project',
          '4. Check your API quota and limits'
        ]
      });
    }
  } catch (error) {
    console.error('Gemini status check error:', error);
    return NextResponse.json({
      success: false,
      status: 'error',
      message: 'Failed to check Gemini API status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { 
  generateText, 
  generateJSON, 
  generateCreativeText, 
  generateAnalyticalText 
} from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { prompt, type = 'general' } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let response: string;

    switch (type) {
      case 'creative':
        response = await generateCreativeText(prompt);
        break;
      case 'analytical':
        response = await generateAnalyticalText(prompt);
        break;
      case 'json':
        const jsonResponse = await generateJSON(prompt);
        return NextResponse.json({
          success: true,
          type: 'json',
          response: jsonResponse
        });
      default:
        response = await generateText(prompt);
    }

    return NextResponse.json({
      success: true,
      type,
      response
    });
  } catch (error) {
    console.error('Gemini test error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
} 
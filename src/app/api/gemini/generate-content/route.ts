import { NextRequest, NextResponse } from 'next/server';
import { generateJSON } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { prompt, type = 'json' } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let response: any;

    if (type === 'json') {
      response = await generateJSON(prompt);
    } else {
      // For non-JSON responses, you could use generateText here
      return NextResponse.json(
        { error: 'Only JSON type is supported for content generation' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      response
    });
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
} 
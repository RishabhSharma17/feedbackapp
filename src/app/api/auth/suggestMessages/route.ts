import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const runtime = 'edge'; // Use Edge runtime for streaming

export async function POST(req: Request) {
  const prompt = `
    Create a list of three open-ended and engaging questions formatted as a single string. 
    Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, 
    and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes 
    that encourage friendly interaction. For example, your output should be structured like this: 
    'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. 
    Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: prompt }],
      max_tokens: 400,
      stream: true,
    });

    // Create a streaming response using ReadableStream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices?.[0]?.delta?.content || '';
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    });
  } catch (error) {
    console.error('Error during OpenAI API call:', error);
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        {
          name: error.name,
          status: error.status,
          headers: error.headers,
          message: error.message,
        },
        { status: error.status }
      );
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

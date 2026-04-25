/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { bio } = await request.json();

    if (!bio || bio.trim().length < 10) {
      return NextResponse.json({ error: 'Bio is too short to analyze.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Analyze the following motivation letter from a job seeker. Rate how authentic, original, and human-written it feels versus how robotic or AI-generated it feels.
Return exactly one JSON object with a single key "humanity_score" containing an integer from 0 to 100.
Do not return any markdown formatting, backticks, or other text. Just the JSON object.

Motivation letter:
"${bio}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response from Gemini");
    }

    const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanedText);
    
    if (typeof data.humanity_score !== 'number') {
      throw new Error("Invalid response format from Gemini");
    }

    return NextResponse.json({ humanity_score: data.humanity_score });
  } catch (error: any) {
    console.error("Error analyzing humanity:", error);
    return NextResponse.json({ error: 'Failed to analyze humanity.', details: error.message }, { status: 500 });
  }
}

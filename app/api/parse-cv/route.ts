import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('cv_file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No CV file provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Convert the uploaded file to Base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    const mimeType = file.type || 'application/pdf';

    const prompt = `You are an expert HR assistant. Extract the following information from the provided CV/Resume document.
If you cannot find a specific piece of information, make a reasonable guess based on the context, or leave it blank if impossible.

Return EXACTLY ONE JSON object with the following keys and string values:
- "full_name": The candidate's full name.
- "title": Their current or desired job title/role.
- "skills": A comma-separated list of their top 3-5 professional skills.
- "bio": A short, professional 2-3 sentence summary of their experience and motivation.

Do NOT wrap the output in markdown code blocks like \`\`\`json. Return ONLY the raw JSON object.`;

    // Call Gemini 2.5 Flash with the inline file data
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        },
        prompt
      ],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response from Gemini");
    }

    // Parse the JSON string returned by Gemini (handling potential markdown)
    const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const extractedData = JSON.parse(cleanedText);

    return NextResponse.json(extractedData);

  } catch (error: any) {
    console.error("Error parsing CV with Gemini:", error);

    if (error?.message?.includes('body size limit') || error?.message?.includes('length')) {
      return NextResponse.json({ error: 'File is too large.' }, { status: 413 });
    }

    return NextResponse.json({ error: 'Internal server error while processing the CV file.', details: error.message }, { status: 500 });
  }
}

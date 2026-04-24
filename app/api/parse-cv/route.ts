import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // We use request.formData() to extract the file safely.
    // In Next.js App Router, this will read into memory, so for very large files it might throw.
    // If it throws, we catch it and return a 413 or 500.
    const formData = await request.formData();
    const file = formData.get('cv_file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No CV file provided' }, { status: 400 });
    }

    // Proxy the request to Ferhad's backend
    const backendUrl = "https://raven-companion-starboard.ngrok-free.dev/parse-cv";
    
    // Create new FormData to send to backend
    const backendFormData = new FormData();
    backendFormData.append('cv_file', file);

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        // ngrok headers
        'ngrok-skip-browser-warning': 'true'
      },
      body: backendFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend Error Response:", errorText);
      // Return a proper error instead of crashing the Next.js process
      return NextResponse.json({ 
        error: `Backend failed to parse CV: ${response.status}`, 
        details: errorText 
      }, { status: response.status === 413 ? 413 : 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Error parsing CV:", error);
    
    // Handle Next.js buffer size limit errors (usually throws a TypeError or specific error)
    if (error?.message?.includes('body size limit') || error?.message?.includes('length')) {
       return NextResponse.json({ error: 'File is too large.' }, { status: 413 });
    }

    return NextResponse.json({ error: 'Internal server error while processing the CV file.', details: error.message }, { status: 500 });
  }
}

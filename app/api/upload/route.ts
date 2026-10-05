import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files allowed' },
        { status: 400 }
      );
    }

    // Convert to base64 or upload to storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-z0-9.-]/gi, '')}`;
    
    // Upload to backend API
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';
    const uploadFormData = new FormData();
    uploadFormData.append('file', new Blob([buffer], { type: file.type }), filename);

    const backendResponse = await fetch(`${backendUrl}/api/upload`, {
      method: 'POST',
      body: uploadFormData,
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN || ''}`,
      },
    });

    if (!backendResponse.ok) {
      throw new Error(`Backend upload failed: ${backendResponse.status}`);
    }

    const result = await backendResponse.json();
    
    return NextResponse.json({
      success: true,
      url: result.url || result.path || `/uploads/${filename}`,
      filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

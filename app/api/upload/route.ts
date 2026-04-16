import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const content = body?.content;

    if (typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Missing CSV content.' }, { status: 400 });
    }

    const uploadsDirectory = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDirectory, { recursive: true });

    const targetFileName = 'product_reviews.csv';
    const targetFilePath = path.join(uploadsDirectory, targetFileName);
    await writeFile(targetFilePath, content, 'utf8');

    return NextResponse.json({
      ok: true,
      path: `/public/uploads/${targetFileName}`,
    });
  } catch (error) {
    console.error('Upload error', error);
    return NextResponse.json({ error: 'Failed to save uploaded CSV.' }, { status: 500 });
  }
};

import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { GenerateResponse } from '../../../types';

export const runtime = 'nodejs';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'uploads', 'json');

export const POST = async (request: Request) => {
  try {
    const payload = (await request.json()) as GenerateResponse;

    if (!payload || !Array.isArray(payload.insights) || !payload.website) {
      return NextResponse.json({ error: 'Invalid response payload.' }, { status: 400 });
    }

    await mkdir(OUTPUT_DIR, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `dashboard-${timestamp}.result.json`;

    await Promise.all([
      writeFile(path.join(OUTPUT_DIR, fileName), JSON.stringify(payload, null, 2), 'utf8'),
      writeFile(path.join(OUTPUT_DIR, 'latest.dashboard.result.json'), JSON.stringify(payload, null, 2), 'utf8'),
    ]);

    return NextResponse.json({ ok: true, fileName });
  } catch (error) {
    console.error('Save response error', error);
    return NextResponse.json({ error: 'Failed to save response.' }, { status: 500 });
  }
};

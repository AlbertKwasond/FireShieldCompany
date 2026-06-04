import { NextResponse } from 'next/server';
import { getPublicSettings } from '@/app/actions/settingsActions';

// This must run on Node.js runtime, not Edge, because it uses Prisma
export const runtime = 'nodejs';

export async function GET() {
  try {
    const settings = await getPublicSettings();
    return NextResponse.json({
      maintenanceMode: settings?.maintenanceMode || false,
      siteName: settings?.siteName || 'Fire Shield Company Limited',
    });
  } catch (error) {
    console.error('API Error fetching maintenance mode:', error);
    return NextResponse.json({ maintenanceMode: false }, { status: 500 });
  }
}

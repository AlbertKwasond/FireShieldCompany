import { NextResponse } from 'next/server';
import { getSettings } from '@/app/actions/settingsActions';

// This must run on Node.js runtime, not Edge, because it uses Prisma
export const runtime = 'nodejs';

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({
      maintenanceMode: settings?.maintenanceMode || false,
      siteName: settings?.siteName || 'Fire Shield Company Limited',
      contactEmail: settings?.contactEmail || '',
      phoneNumber: settings?.phoneNumber || '',
      address: settings?.address || '',
    });
  } catch (error) {
    console.error('API Error fetching maintenance mode:', error);
    return NextResponse.json({ maintenanceMode: false }, { status: 500 });
  }
}

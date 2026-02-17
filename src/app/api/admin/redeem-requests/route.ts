import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    const requests = await db.redeemRequests.getAll(status);

    return NextResponse.json({
      success: true,
      requests
    });

  } catch (error) {
    console.error('Get redeem requests error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch redeem requests' },
      { status: 500 }
    );
  }
}

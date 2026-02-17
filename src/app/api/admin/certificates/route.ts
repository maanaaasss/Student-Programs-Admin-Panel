import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabase';

export async function GET(request: NextRequest) {
  try {
    const certificates = await db.certificates.getAll();

    return NextResponse.json({
      success: true,
      certificates
    });

  } catch (error) {
    console.error('Get certificates error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}

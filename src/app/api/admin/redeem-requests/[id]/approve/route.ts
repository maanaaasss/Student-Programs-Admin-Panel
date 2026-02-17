import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { adminId, notes } = await request.json();

    if (!adminId || adminId === 'undefined' || typeof adminId !== 'string' || adminId.trim() === '') {
      return NextResponse.json(
        { error: 'Valid Admin ID is required' },
        { status: 400 }
      );
    }

    // Approve redeem request
    const updatedRequest = await db.redeemRequests.approve(id, adminId, notes);

    return NextResponse.json({
      success: true,
      request: updatedRequest
    });

  } catch (error) {
    console.error('Approve redeem request error:', error);
    return NextResponse.json(
      { error: 'Failed to approve redeem request' },
      { status: 500 }
    );
  }
}

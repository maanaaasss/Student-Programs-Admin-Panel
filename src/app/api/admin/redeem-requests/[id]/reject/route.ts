import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { adminId, reason } = await request.json();

    if (!adminId || adminId === 'undefined' || typeof adminId !== 'string' || adminId.trim() === '') {
      return NextResponse.json(
        { error: 'Valid Admin ID is required' },
        { status: 400 }
      );
    }

    if (!reason) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    // Reject redeem request
    const updatedRequest = await db.redeemRequests.reject(id, adminId, reason);

    return NextResponse.json({
      success: true,
      request: updatedRequest
    });

  } catch (error) {
    console.error('Reject redeem request error:', error);
    return NextResponse.json(
      { error: 'Failed to reject redeem request' },
      { status: 500 }
    );
  }
}

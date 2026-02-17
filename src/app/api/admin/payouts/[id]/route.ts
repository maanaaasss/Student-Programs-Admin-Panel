import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();

    // Update payout
    const updatedPayout = await db.payouts.update(id, updates);

    return NextResponse.json({
      success: true,
      payout: updatedPayout
    });

  } catch (error) {
    console.error('Update payout error:', error);
    return NextResponse.json(
      { error: 'Failed to update payout' },
      { status: 500 }
    );
  }
}

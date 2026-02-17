import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get user details
    const user = await db.users.getById(id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get referral information
    const referrals = await db.referrals.getByUserId(id);

    // Get who referred this user
    let referredBy = null;
    if (user.referred_by) {
      referredBy = await db.users.getById(user.referred_by);
    }

    // Get users this user referred
    const referredUsers = referrals
      .filter((r: any) => r.referrer_id === id)
      .map((r: any) => r.referred);

    return NextResponse.json({
      success: true,
      user,
      referredBy,
      referredUsers,
      totalReferrals: referredUsers.length
    });

  } catch (error) {
    console.error('Get user referrals error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user referrals' },
      { status: 500 }
    );
  }
}

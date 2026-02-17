import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabase';

// GET /api/admin/users - Get all users
export async function GET(request: NextRequest) {
  try {
    const users = await db.users.getAll();

    return NextResponse.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, phone, referralCode, referredBy } = body;

    // Validation
    if (!email || !name || !referralCode) {
      return NextResponse.json(
        { error: 'Email, name, and referral code are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create user
    const user = await db.users.create({
      email,
      name,
      phone,
      referral_code: referralCode,
      referred_by: referredBy
    });

    return NextResponse.json({
      success: true,
      user
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create user error:', error);
    
    // Handle unique constraint violations
    if (error.code === '23505') {
      if (error.message.includes('email')) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
      if (error.message.includes('referral_code')) {
        return NextResponse.json(
          { error: 'Referral code already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabase';

// GET /api/admin/tasks - Get all tasks
export async function GET(request: NextRequest) {
  try {
    const tasks = await db.tasks.getAll();

    return NextResponse.json({
      success: true,
      tasks
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

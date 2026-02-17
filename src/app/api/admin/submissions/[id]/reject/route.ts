import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabase';

const isValidUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { adminId, reason } = body;

    console.log('Reject submission request:', { id, adminId, reason });

    if (!id || typeof id !== 'string' || !isValidUuid(id)) {
      return NextResponse.json(
        { error: 'Valid Submission ID is required' },
        { status: 400 }
      );
    }

    if (!adminId || adminId === 'undefined' || typeof adminId !== 'string' || adminId.trim() === '') {
      return NextResponse.json(
        { error: 'Valid Admin ID is required' },
        { status: 400 }
      );
    }

    if (!reason || typeof reason !== 'string' || reason.trim() === '') {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    // Reject submission (will fail if submission doesn't exist)
    const updatedSubmission = await db.submissions.reject(id, adminId, reason);

    console.log('Submission rejected successfully:', updatedSubmission);

    return NextResponse.json({
      success: true,
      submission: updatedSubmission
    });

  } catch (error: any) {
    console.error('Reject submission error:', error);
    console.error('Error details:', error.message, error.stack);
    if (error?.code === 'PGRST116') {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    if (error?.message?.includes('invalid input syntax for type uuid')) {
      return NextResponse.json(
        { error: 'Invalid ID format provided' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to reject submission' },
      { status: 500 }
    );
  }
}

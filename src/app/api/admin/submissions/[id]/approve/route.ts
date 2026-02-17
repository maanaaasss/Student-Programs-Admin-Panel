import { NextRequest, NextResponse } from 'next/server';
import { db, supabase } from '@/lib/db/supabase';
import { sendCertificateEmail } from '@/lib/email';

const isValidUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { adminId } = body;
    
    // Await params in Next.js 15+
    const { id } = await params;

    console.log('Approve submission request:', { id, adminId });

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

    // First, try to get the submission with a simpler query (no joins)
    const { data: submissionData, error: fetchError } = await supabase
      .from('task_submissions')
      .select('id, user_id, task_id')
      .eq('id', id)
      .single();

    if (fetchError || !submissionData) {
      if (fetchError?.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Submission not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: fetchError?.message || 'Failed to fetch submission' },
        { status: 500 }
      );
    }

    console.log('Found submission:', submissionData);

    // Validate submission has required data
    if (!submissionData.user_id) {
      console.error('Submission missing user_id:', submissionData);
      return NextResponse.json(
        { error: 'Submission data is invalid: missing user_id' },
        { status: 400 }
      );
    }

    if (!submissionData.task_id) {
      console.error('Submission missing task_id:', submissionData);
      return NextResponse.json(
        { error: 'Submission data is invalid: missing task_id' },
        { status: 400 }
      );
    }

    // Approve submission
    const updatedSubmission = await db.submissions.approve(id, adminId);
    console.log('Submission approved:', updatedSubmission);

    // Credit points to user
    const user = await db.users.getById(submissionData.user_id);
    const task = await db.tasks.getAll().then(tasks => tasks.find(t => t.id === submissionData.task_id));
    if (user && task) {
      const newPoints = user.total_points + task.points;
      await db.users.updatePoints(user.id, newPoints);
      console.log('Updated user points:', { userId: user.id, newPoints });
    }

    // Create certificate (don't pass issued_at as it has a default)
    const certificate = await db.certificates.create({
      user_id: submissionData.user_id,
      task_submission_id: id,
      certificate_url: `https://example.com/certificates/${id}.pdf`
    });
    console.log('Certificate created:', certificate);

    // Validate certificate was created with an ID
    if (!certificate || !certificate.id) {
      console.error('Certificate creation failed or returned no ID:', certificate);
      throw new Error('Certificate creation failed');
    }

    // Send certificate email
    if (user && task) {
      try {
        await sendCertificateEmail({
          to: user.email,
          studentName: user.name,
          taskTitle: task.title,
          certificateUrl: certificate.certificate_url,
        });
        // Update email status
        await db.certificates.updateEmailStatus(certificate.id, true);
        console.log('Certificate email sent');
      } catch (emailError) {
        console.error('Failed to send certificate email:', emailError);
        // Don't fail the entire approval if email fails
      }
    }

    return NextResponse.json({
      success: true,
      submission: updatedSubmission,
      certificate
    });

  } catch (error: any) {
    console.error('Approve submission error:', error);
    console.error('Error details:', error.message, error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to approve submission' },
      { status: 500 }
    );
  }
}

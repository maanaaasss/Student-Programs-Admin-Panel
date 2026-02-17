import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabase';
import { sendCertificateEmail } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15+
    const { id } = await params;

    console.log('Resend certificate request for ID:', id);

    // Get certificate details with user and task information
    const certificates = await db.certificates.getAll();
    const certificate = certificates.find(cert => cert.id === id);

    if (!certificate) {
      console.error('Certificate not found:', id);
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    console.log('Certificate found:', {
      id: certificate.id,
      userEmail: certificate.user.email,
      userName: certificate.user.name,
      taskTitle: certificate.task_submission?.task?.title
    });

    // Send email
    console.log('Attempting to send email to:', certificate.user.email);
    const emailResult = await sendCertificateEmail({
      to: certificate.user.email,
      studentName: certificate.user.name,
      taskTitle: certificate.task_submission?.task?.title || 'Task',
      certificateUrl: certificate.certificate_url,
    });

    console.log('Email sent successfully:', emailResult);

    // Update email status
    await db.certificates.updateEmailStatus(id, true);

    return NextResponse.json({
      success: true,
      message: 'Certificate email sent successfully'
    });

  } catch (error: any) {
    console.error('Resend certificate error:', error);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    return NextResponse.json(
      { error: error?.message || 'Failed to resend certificate' },
      { status: 500 }
    );
  }
}

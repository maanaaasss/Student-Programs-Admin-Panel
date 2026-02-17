import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

// POST /api/admin/users/demo - Create demo user with all related data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      // User basic info
      email,
      name,
      phone,
      referralCode,
      referredBy,
      totalPoints = 0,
      availablePoints = 0,
      
      // Task submissions
      taskSubmissions = [],
      
      // Certificates
      generateCertificates = false,
      
      // Redemption requests
      redemptionRequests = [],
      
      // Payouts
      payouts = [],
      
      // Referrals (users this student referred)
      referredUsers = []
    } = body;

    // Validation
    if (!email || !name || !referralCode) {
      return NextResponse.json(
        { error: 'Email, name, and referral code are required' },
        { status: 400 }
      );
    }

    // 1. Create the user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        email,
        name,
        phone: phone || null,
        referral_code: referralCode,
        referred_by: referredBy || null,
        total_points: totalPoints,
        available_points: availablePoints
      }])
      .select()
      .single();

    if (userError) {
      console.error('User creation error:', userError);
      if (userError.code === '23505') {
        if (userError.message.includes('email')) {
          return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
        }
        if (userError.message.includes('referral_code')) {
          return NextResponse.json({ error: 'Referral code already exists' }, { status: 409 });
        }
      }
      throw userError;
    }

    const createdData: any = {
      user,
      submissions: [],
      certificates: [],
      redemptionRequests: [],
      payouts: [],
      referrals: []
    };

    // 2. Create task submissions
    if (taskSubmissions && taskSubmissions.length > 0) {
      const submissionsToInsert = taskSubmissions.map((sub: any) => ({
        user_id: user.id,
        task_id: sub.taskId,
        proof_url: sub.proofUrl || null,
        proof_text: sub.proofText || null,
        status: sub.status || 'pending',
        rejection_reason: sub.rejectionReason || null,
        validated_by: sub.validatedBy || null,
        validated_at: sub.validatedAt ? new Date(sub.validatedAt).toISOString() : null
      }));

      const { data: submissions, error: submissionsError } = await supabase
        .from('task_submissions')
        .insert(submissionsToInsert)
        .select();

      if (submissionsError) {
        console.error('Submissions creation error:', submissionsError);
      } else {
        createdData.submissions = submissions || [];

        // 3. Create certificates for approved submissions if requested
        if (generateCertificates && submissions) {
          const approvedSubmissions = submissions.filter((sub: any) => sub.status === 'approved');
          
          if (approvedSubmissions.length > 0) {
            const certificatesToInsert = approvedSubmissions.map((sub: any) => ({
              user_id: user.id,
              task_submission_id: sub.id,
              certificate_url: `https://example.com/certificates/${user.id}-${sub.id}.pdf`,
              email_sent: false
            }));

            const { data: certificates, error: certificatesError } = await supabase
              .from('certificates')
              .insert(certificatesToInsert)
              .select();

            if (certificatesError) {
              console.error('Certificates creation error:', certificatesError);
            } else {
              createdData.certificates = certificates || [];
            }
          }
        }
      }
    }

    // 4. Create redemption requests
    if (redemptionRequests && redemptionRequests.length > 0) {
      const requestsToInsert = redemptionRequests.map((req: any) => ({
        user_id: user.id,
        points_requested: req.pointsRequested,
        status: req.status || 'pending',
        admin_notes: req.adminNotes || null,
        processed_by: req.processedBy || null,
        processed_at: req.processedAt ? new Date(req.processedAt).toISOString() : null
      }));

      const { data: requests, error: requestsError } = await supabase
        .from('redeem_requests')
        .insert(requestsToInsert)
        .select();

      if (requestsError) {
        console.error('Redemption requests creation error:', requestsError);
      } else {
        createdData.redemptionRequests = requests || [];
      }
    }

    // 5. Create payouts
    if (payouts && payouts.length > 0) {
      const payoutsToInsert = payouts.map((payout: any) => ({
        user_id: user.id,
        redeem_request_id: payout.redeemRequestId || null,
        amount: payout.amount,
        points_redeemed: payout.pointsRedeemed,
        payment_method: payout.paymentMethod || 'bank_transfer',
        transaction_reference: payout.transactionReference || null,
        status: payout.status || 'pending',
        admin_notes: payout.adminNotes || null,
        processed_by: payout.processedBy || null,
        completed_at: payout.completedAt ? new Date(payout.completedAt).toISOString() : null
      }));

      const { data: payoutData, error: payoutsError } = await supabase
        .from('payouts')
        .insert(payoutsToInsert)
        .select();

      if (payoutsError) {
        console.error('Payouts creation error:', payoutsError);
      } else {
        createdData.payouts = payoutData || [];
      }
    }

    // 6. Create referrals (if this user referred others)
    if (referredUsers && referredUsers.length > 0) {
      const referralsToInsert = referredUsers.map((refUserId: string) => ({
        referrer_id: user.id,
        referred_id: refUserId,
        points_awarded: 100 // Default referral points
      }));

      const { data: referrals, error: referralsError } = await supabase
        .from('referrals')
        .insert(referralsToInsert)
        .select();

      if (referralsError) {
        console.error('Referrals creation error:', referralsError);
      } else {
        createdData.referrals = referrals || [];
      }
    }

    // 7. If this user was referred by someone, create that referral relationship
    if (referredBy) {
      const { data: referral, error: referralError } = await supabase
        .from('referrals')
        .insert([{
          referrer_id: referredBy,
          referred_id: user.id,
          points_awarded: 100
        }])
        .select();

      if (referralError) {
        console.error('Referral relationship creation error:', referralError);
      } else if (referral) {
        createdData.referrals.push(referral[0]);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Demo user created successfully with all related data',
      data: createdData
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create demo user error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create demo user' },
      { status: 500 }
    );
  }
}

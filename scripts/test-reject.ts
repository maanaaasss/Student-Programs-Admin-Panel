// Test script to check submission rejection
// Run with: npx tsx scripts/test-reject.ts

import { db } from '../src/lib/db/supabase';

async function testReject() {
  try {
    console.log('Fetching submissions...');
    const submissions = await db.submissions.getAll();
    console.log(`Found ${submissions.length} submissions`);
    
    if (submissions.length === 0) {
      console.log('No submissions to test with');
      return;
    }

    const testSubmission = submissions[0];
    console.log('Testing with submission:', {
      id: testSubmission.id,
      status: testSubmission.status,
      user_id: testSubmission.user_id
    });

    // Try to reject
    console.log('\nAttempting to reject submission...');
    const result = await db.submissions.reject(
      testSubmission.id,
      'test-admin-id',
      'Test rejection reason'
    );
    
    console.log('Rejection successful:', result);
  } catch (error: any) {
    console.error('Error occurred:', error.message);
    console.error('Full error:', error);
  }
}

testReject();

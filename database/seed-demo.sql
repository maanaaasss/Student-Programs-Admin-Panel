-- ============================================================================
-- COMPREHENSIVE DEMO SEED DATA FOR STUDENT PROGRAMS ADMIN PANEL
-- ============================================================================
-- This seed file creates complete demo data to showcase all admin panel features
-- 
-- ⚠️  WARNING: This will DELETE all existing data!
-- ⚠️  Use this ONLY for demo/development environments
-- ============================================================================

-- Clear all existing data (in correct order to respect foreign keys)
TRUNCATE TABLE 
    certificates,
    payouts,
    redeem_requests,
    referrals,
    task_submissions,
    tasks,
    users,
    admins
CASCADE;

-- ============================================================================
-- 👤 ADMINS (At least 1 admin)
-- ============================================================================
-- Password: admin123 (hashed with bcrypt)
-- Use this to login to the admin panel

INSERT INTO admins (id, email, password_hash, name, role, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@studentprograms.com', '$2b$10$c6bgyc.EMm6oJFHkRriVjelGdCaWRa/XVB3RaVuyUKAMFuKRR1C42', 'Admin User', 'super_admin', NOW() - INTERVAL '90 days');

-- ============================================================================
-- 👥 USERS (At least 6 students with different scenarios)
-- ============================================================================

-- User 1: Alice (High points, has referred 2 people, active user)
INSERT INTO users (id, email, name, phone, total_points, available_points, referral_code, referred_by, created_at) VALUES
('10000000-0000-0000-0000-000000000001', 'alice.johnson@example.com', 'Alice Johnson', '+1-555-0101', 2500, 2000, 'ALICE2024', NULL, NOW() - INTERVAL '60 days');

-- User 2: Bob (Moderate points, referred by Alice, has 1 referral)
INSERT INTO users (id, email, name, phone, total_points, available_points, referral_code, referred_by, created_at) VALUES
('10000000-0000-0000-0000-000000000002', 'bob.smith@example.com', 'Bob Smith', '+1-555-0102', 1200, 950, 'BOB2024', '10000000-0000-0000-0000-000000000001', NOW() - INTERVAL '50 days');

-- User 3: Charlie (Moderate points, referred by Alice, has 1 referral)
INSERT INTO users (id, email, name, phone, total_points, available_points, referral_code, referred_by, created_at) VALUES
('10000000-0000-0000-0000-000000000003', 'charlie.brown@example.com', 'Charlie Brown', '+1-555-0103', 1500, 1200, 'CHARLIE24', '10000000-0000-0000-0000-000000000001', NOW() - INTERVAL '45 days');

-- User 4: Diana (Low points, referred by Bob)
INSERT INTO users (id, email, name, phone, total_points, available_points, referral_code, referred_by, created_at) VALUES
('10000000-0000-0000-0000-000000000004', 'diana.prince@example.com', 'Diana Prince', '+1-555-0104', 650, 650, 'DIANA2024', '10000000-0000-0000-0000-000000000002', NOW() - INTERVAL '35 days');

-- User 5: Eve (ZERO points, referred by Charlie, new user with no activity)
INSERT INTO users (id, email, name, phone, total_points, available_points, referral_code, referred_by, created_at) VALUES
('10000000-0000-0000-0000-000000000005', 'eve.wilson@example.com', 'Eve Wilson', '+1-555-0105', 0, 0, 'EVE2024', '10000000-0000-0000-0000-000000000003', NOW() - INTERVAL '15 days');

-- User 6: Frank (No referrals, no referred by, independent high-point user)
INSERT INTO users (id, email, name, phone, total_points, available_points, referral_code, referred_by, created_at) VALUES
('10000000-0000-0000-0000-000000000006', 'frank.miller@example.com', 'Frank Miller', '+1-555-0106', 1800, 1800, 'FRANK2024', NULL, NOW() - INTERVAL '40 days');

-- User 7: Grace (No phone, minimal data, has some points)
INSERT INTO users (id, email, name, phone, total_points, available_points, referral_code, referred_by, created_at) VALUES
('10000000-0000-0000-0000-000000000007', 'grace.lee@example.com', 'Grace Lee', NULL, 400, 400, 'GRACE2024', NULL, NOW() - INTERVAL '25 days');

-- ============================================================================
-- 📌 TASKS (At least 3 different tasks with different point values)
-- ============================================================================

INSERT INTO tasks (id, title, description, points, requires_validation, created_at) VALUES
('20000000-0000-0000-0000-000000000001', 'Refer a Friend', 'Refer a new student to the program and earn 100 points when they complete signup with your referral code.', 100, true, NOW() - INTERVAL '90 days'),
('20000000-0000-0000-0000-000000000002', 'Complete Profile Setup', 'Fill in all your profile details including phone number, address, and profile picture.', 50, true, NOW() - INTERVAL '90 days'),
('20000000-0000-0000-0000-000000000003', 'Submit Academic Assignment', 'Submit a valid academic assignment or project work for review and earn points.', 200, true, NOW() - INTERVAL '90 days'),
('20000000-0000-0000-0000-000000000004', 'Attend Workshop', 'Attend an official workshop and submit proof of attendance (photo or certificate).', 150, true, NOW() - INTERVAL '85 days'),
('20000000-0000-0000-0000-000000000005', 'Write Blog Post', 'Write and publish a blog post about your learning experience (minimum 500 words).', 250, true, NOW() - INTERVAL '80 days'),
('20000000-0000-0000-0000-000000000006', 'Community Contribution', 'Contribute to the student community by helping others, organizing events, or creating resources.', 300, true, NOW() - INTERVAL '75 days');

-- ============================================================================
-- 🧾 TASK SUBMISSIONS (Mix of pending, approved, and rejected)
-- ============================================================================

-- PENDING SUBMISSION 1: Bob's profile completion (pending validation)
INSERT INTO task_submissions (id, user_id, task_id, proof_url, proof_text, status, rejection_reason, validated_by, validated_at, created_at) VALUES
('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1633332755192-727a05c4013d', 'I have completed my profile with all required information including phone number and address.', 'pending', NULL, NULL, NULL, NOW() - INTERVAL '2 days');

-- PENDING SUBMISSION 2: Diana's assignment submission (pending validation)
INSERT INTO task_submissions (id, user_id, task_id, proof_url, proof_text, status, rejection_reason, validated_by, validated_at, created_at) VALUES
('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8', 'Submitted my Data Structures and Algorithms project with complete documentation and test cases.', 'pending', NULL, NULL, NULL, NOW() - INTERVAL '1 day');

-- APPROVED SUBMISSION 1: Alice's referral (approved, awarded points)
INSERT INTO task_submissions (id, user_id, task_id, proof_url, proof_text, status, rejection_reason, validated_by, validated_at, created_at) VALUES
('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f', 'I referred Bob Smith who successfully signed up using my referral code ALICE2024.', 'approved', NULL, '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '48 days', NOW() - INTERVAL '50 days');

-- APPROVED SUBMISSION 2: Charlie's workshop attendance (approved, certificate issued)
INSERT INTO task_submissions (id, user_id, task_id, proof_url, proof_text, status, rejection_reason, validated_by, validated_at, created_at) VALUES
('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87', 'Attended the React Advanced Patterns workshop on March 15, 2024. Certificate and attendance photo attached.', 'approved', NULL, '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '30 days', NOW() - INTERVAL '32 days');

-- APPROVED SUBMISSION 3: Frank's blog post (approved, certificate issued)
INSERT INTO task_submissions (id, user_id, task_id, proof_url, proof_text, status, rejection_reason, validated_by, validated_at, created_at) VALUES
('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000005', 'https://medium.com/@frank/my-learning-journey', 'Published a comprehensive blog post titled "My Journey Learning Full-Stack Development" with 1200+ words.', 'approved', NULL, '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '20 days', NOW() - INTERVAL '22 days');

-- REJECTED SUBMISSION 1: Eve's incomplete referral (rejected with reason)
INSERT INTO task_submissions (id, user_id, task_id, proof_url, proof_text, status, rejection_reason, validated_by, validated_at, created_at) VALUES
('30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e', 'I shared my referral code with a friend via email.', 'rejected', 'The referred person has not completed their signup yet. Please resubmit once they have successfully registered using your referral code.', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '10 days', NOW() - INTERVAL '12 days');

-- Additional approved submissions for point accumulation
INSERT INTO task_submissions (id, user_id, task_id, proof_url, proof_text, status, rejection_reason, validated_by, validated_at, created_at) VALUES
('30000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97', 'Submitted my capstone project on Machine Learning applications.', 'approved', NULL, '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '40 days', NOW() - INTERVAL '42 days'),
('30000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1591115765373-5207764f72e7', 'Attended Node.js workshop on February 28, 2024.', 'approved', NULL, '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '25 days', NOW() - INTERVAL '27 days'),
('30000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94', 'Organized a study group for 15 students and created comprehensive study materials.', 'approved', NULL, '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '38 days', NOW() - INTERVAL '40 days');

-- ============================================================================
-- 🔗 REFERRALS (Track who referred whom)
-- ============================================================================

-- Alice referred Bob and Charlie (Alice is a top referrer)
INSERT INTO referrals (id, referrer_id, referred_id, points_awarded, created_at) VALUES
('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 100, NOW() - INTERVAL '50 days'),
('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 100, NOW() - INTERVAL '45 days');

-- Bob referred Diana
INSERT INTO referrals (id, referrer_id, referred_id, points_awarded, created_at) VALUES
('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004', 100, NOW() - INTERVAL '35 days');

-- Charlie referred Eve
INSERT INTO referrals (id, referrer_id, referred_id, points_awarded, created_at) VALUES
('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000005', 100, NOW() - INTERVAL '15 days');

-- ============================================================================
-- 🎓 CERTIFICATES (Only for approved tasks)
-- ============================================================================

-- Certificate 1: Alice's referral certificate (SENT)
INSERT INTO certificates (id, user_id, task_submission_id, certificate_url, issued_at, email_sent, email_sent_at, created_at) VALUES
('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', 'https://certificates.studentprograms.com/alice-referral-2024.pdf', NOW() - INTERVAL '48 days', true, NOW() - INTERVAL '48 days', NOW() - INTERVAL '48 days');

-- Certificate 2: Charlie's workshop certificate (SENT and RESENT)
INSERT INTO certificates (id, user_id, task_submission_id, certificate_url, issued_at, email_sent, email_sent_at, created_at) VALUES
('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000004', 'https://certificates.studentprograms.com/charlie-workshop-2024.pdf', NOW() - INTERVAL '30 days', true, NOW() - INTERVAL '25 days', NOW() - INTERVAL '30 days');
-- Note: The email_sent_at is more recent than issued_at, indicating it was RESENT

-- Certificate 3: Frank's blog post certificate (SENT)
INSERT INTO certificates (id, user_id, task_submission_id, certificate_url, issued_at, email_sent, email_sent_at, created_at) VALUES
('50000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000005', 'https://certificates.studentprograms.com/frank-blog-2024.pdf', NOW() - INTERVAL '20 days', true, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days');

-- Certificate 4: Alice's assignment certificate (NOT YET SENT)
INSERT INTO certificates (id, user_id, task_submission_id, certificate_url, issued_at, email_sent, email_sent_at, created_at) VALUES
('50000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000007', 'https://certificates.studentprograms.com/alice-assignment-2024.pdf', NOW() - INTERVAL '40 days', false, NULL, NOW() - INTERVAL '40 days');

-- Certificate 5: Bob's workshop certificate (SENT)
INSERT INTO certificates (id, user_id, task_submission_id, certificate_url, issued_at, email_sent, email_sent_at, created_at) VALUES
('50000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000008', 'https://certificates.studentprograms.com/bob-workshop-2024.pdf', NOW() - INTERVAL '25 days', true, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days');

-- Certificate 6: Charlie's community contribution certificate (SENT)
INSERT INTO certificates (id, user_id, task_submission_id, certificate_url, issued_at, email_sent, email_sent_at, created_at) VALUES
('50000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000009', 'https://certificates.studentprograms.com/charlie-community-2024.pdf', NOW() - INTERVAL '38 days', true, NOW() - INTERVAL '38 days', NOW() - INTERVAL '38 days');

-- ============================================================================
-- 💰 REDEEM REQUESTS (Mix of pending, approved, and rejected)
-- ============================================================================

-- PENDING REQUEST: Alice wants to redeem 500 points
INSERT INTO redeem_requests (id, user_id, points_requested, status, admin_notes, processed_by, processed_at, created_at) VALUES
('60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 500, 'pending', NULL, NULL, NULL, NOW() - INTERVAL '3 days');

-- APPROVED REQUEST: Charlie's 300 points redemption (approved and paid)
INSERT INTO redeem_requests (id, user_id, points_requested, status, admin_notes, processed_by, processed_at, created_at) VALUES
('60000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 300, 'approved', 'Verified account details. Approved for bank transfer payout.', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '8 days', NOW() - INTERVAL '10 days');

-- REJECTED REQUEST: Bob tried to redeem more points than available
INSERT INTO redeem_requests (id, user_id, points_requested, status, admin_notes, processed_by, processed_at, created_at) VALUES
('60000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 1500, 'rejected', 'Insufficient available points. User has 950 available points but requested 1500. Please request an amount within your available balance.', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '15 days', NOW() - INTERVAL '16 days');

-- Additional pending request for demo
INSERT INTO redeem_requests (id, user_id, points_requested, status, admin_notes, processed_by, processed_at, created_at) VALUES
('60000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000006', 800, 'pending', NULL, NULL, NULL, NOW() - INTERVAL '1 day');

-- ============================================================================
-- 🏦 PAYOUTS (Mix of pending and completed)
-- ============================================================================

-- PENDING PAYOUT: Alice's redemption awaiting payment processing
INSERT INTO payouts (id, redeem_request_id, user_id, amount, points_redeemed, payment_method, transaction_reference, status, admin_notes, processed_by, completed_at, created_at) VALUES
('70000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 50.00, 500, 'bank_transfer', NULL, 'pending', NULL, NULL, NULL, NOW() - INTERVAL '3 days');

-- COMPLETED PAYOUT: Charlie's successful payout with transaction reference
INSERT INTO payouts (id, redeem_request_id, user_id, amount, points_redeemed, payment_method, transaction_reference, status, admin_notes, processed_by, completed_at, created_at) VALUES
('70000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 30.00, 300, 'bank_transfer', 'TXN-20240315-CH001', 'completed', 'Payment successfully transferred to Bank of America account ending in 4532. Confirmed by recipient.', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '7 days', NOW() - INTERVAL '8 days');

-- Additional pending payout
INSERT INTO payouts (id, redeem_request_id, user_id, amount, points_redeemed, payment_method, transaction_reference, status, admin_notes, processed_by, completed_at, created_at) VALUES
('70000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000006', 80.00, 800, 'paypal', NULL, 'pending', NULL, NULL, NULL, NOW() - INTERVAL '1 day');

-- ============================================================================
-- DEMO SCENARIOS VERIFICATION
-- ============================================================================
-- 
-- ✅ 👤 USERS: 7 students created
--    - Alice: High points (2500 total, 2000 available), has 2 referrals
--    - Bob: Moderate points (1200 total, 950 available), was referred by Alice, has 1 referral
--    - Charlie: Moderate points (1500 total, 1200 available), was referred by Alice, has 1 referral
--    - Diana: Low points (650 total, 650 available), was referred by Bob
--    - Eve: ZERO points (0 total, 0 available), was referred by Charlie
--    - Frank: High points (1800 total, 1800 available), NO referral relationships
--    - Grace: Low points (400 total, 400 available), NO referral relationships, missing phone
-- 
-- ✅ 📌 TASKS: 6 different tasks
--    - Point values: 50, 100, 150, 200, 250, 300
-- 
-- ✅ 🧾 TASK SUBMISSIONS:
--    - 2 PENDING: Bob's profile, Diana's assignment
--    - 4 APPROVED: Alice's referral, Charlie's workshop, Frank's blog, Alice's assignment, Bob's workshop, Charlie's community
--    - 1 REJECTED: Eve's incomplete referral (with rejection reason)
-- 
-- ✅ 🎓 CERTIFICATES: 6 certificates (only for approved tasks)
--    - 5 certificates SENT
--    - 1 certificate RESENT (Charlie's workshop - note the email_sent_at is later than issued_at)
--    - 1 certificate NOT SENT (Alice's assignment)
-- 
-- ✅ 💰 REDEEM REQUESTS:
--    - 2 PENDING: Alice (500 points), Frank (800 points)
--    - 1 APPROVED: Charlie (300 points) with admin notes
--    - 1 REJECTED: Bob (1500 points) with detailed admin notes explaining insufficient balance
-- 
-- ✅ 🏦 PAYOUTS:
--    - 2 PENDING: Alice ($50 for 500 points), Frank ($80 for 800 points)
--    - 1 COMPLETED: Charlie ($30 for 300 points) with transaction reference and completion timestamp
-- 
-- ✅ 🔗 REFERRALS:
--    - Alice referred 2 users (Bob, Charlie) - top referrer
--    - Bob referred 1 user (Diana) - was also referred
--    - Charlie referred 1 user (Eve) - was also referred
--    - Frank: NO referral relationships
--    - Grace: NO referral relationships
--    - Eve: Only referred by someone, has not referred anyone
-- 
-- ============================================================================
-- LOGIN CREDENTIALS
-- ============================================================================
-- Admin Login:
--   Email: admin@studentprograms.com
--   Password: admin123
-- ============================================================================

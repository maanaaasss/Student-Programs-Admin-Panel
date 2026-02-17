-- Seed data for Student Programs Admin Panel

-- Insert default admin user (password: admin123)
-- Password hash generated with bcrypt for 'admin123'
INSERT INTO admins (email, password_hash, name, role) VALUES
('admin@studentprograms.com', '$2b$10$c6bgyc.EMm6oJFHkRriVjelGdCaWRa/XVB3RaVuyUKAMFuKRR1C42', 'Admin User', 'super_admin');

-- Insert sample users
INSERT INTO users (email, name, phone, total_points, available_points, referral_code, referred_by) VALUES
('alice@example.com', 'Alice Smith', '+1234567890', 1500, 1500, 'ALICE123', NULL),
('bob@example.com', 'Bob Johnson', '+1234567891', 800, 800, 'BOB456', (SELECT id FROM users WHERE email = 'alice@example.com')),
('charlie@example.com', 'Charlie Brown', '+1234567892', 1200, 1200, 'CHARLIE789', (SELECT id FROM users WHERE email = 'alice@example.com')),
('diana@example.com', 'Diana Prince', '+1234567893', 500, 500, 'DIANA012', (SELECT id FROM users WHERE email = 'bob@example.com')),
('eve@example.com', 'Eve Wilson', '+1234567894', 300, 300, 'EVE345', (SELECT id FROM users WHERE email = 'charlie@example.com'));

-- Insert sample tasks
INSERT INTO tasks (title, description, points, requires_validation) VALUES
('Refer a Friend', 'Refer a new student to the program and earn points when they sign up.', 100, true),
('Complete Profile', 'Fill in all your profile details including phone number and address.', 50, true),
('Submit Assignment', 'Submit a valid academic assignment for review.', 200, true),
('Attend Workshop', 'Attend a workshop and submit proof of attendance.', 150, true),
('Write Blog Post', 'Write and publish a blog post about your learning experience.', 250, true);

-- Insert sample task submissions
INSERT INTO task_submissions (user_id, task_id, proof_url, proof_text, status, validated_by, validated_at) VALUES
(
    (SELECT id FROM users WHERE email = 'alice@example.com'),
    (SELECT id FROM tasks WHERE title = 'Refer a Friend'),
    'https://example.com/proof/alice-referral.png',
    'I referred Bob Johnson who signed up on 2024-03-10',
    'approved',
    (SELECT id FROM admins WHERE email = 'admin@studentprograms.com'),
    NOW() - INTERVAL '2 days'
),
(
    (SELECT id FROM users WHERE email = 'bob@example.com'),
    (SELECT id FROM tasks WHERE title = 'Complete Profile'),
    NULL,
    'Profile completed with all required information',
    'pending',
    NULL,
    NULL
),
(
    (SELECT id FROM users WHERE email = 'charlie@example.com'),
    (SELECT id FROM tasks WHERE title = 'Submit Assignment'),
    'https://example.com/proof/charlie-assignment.pdf',
    'Assignment on Data Structures submitted',
    'pending',
    NULL,
    NULL
),
(
    (SELECT id FROM users WHERE email = 'diana@example.com'),
    (SELECT id FROM tasks WHERE title = 'Attend Workshop'),
    'https://example.com/proof/diana-workshop.jpg',
    'Attended React Workshop on 2024-03-15',
    'approved',
    (SELECT id FROM admins WHERE email = 'admin@studentprograms.com'),
    NOW() - INTERVAL '1 day'
),
(
    (SELECT id FROM users WHERE email = 'eve@example.com'),
    (SELECT id FROM tasks WHERE title = 'Refer a Friend'),
    'https://example.com/proof/eve-referral.png',
    'Referred a friend but they haven''t signed up yet',
    'rejected',
    (SELECT id FROM admins WHERE email = 'admin@studentprograms.com'),
    NOW() - INTERVAL '3 days'
);

-- Insert referrals
INSERT INTO referrals (referrer_id, referred_id, points_awarded) VALUES
(
    (SELECT id FROM users WHERE email = 'alice@example.com'),
    (SELECT id FROM users WHERE email = 'bob@example.com'),
    100
),
(
    (SELECT id FROM users WHERE email = 'alice@example.com'),
    (SELECT id FROM users WHERE email = 'charlie@example.com'),
    100
),
(
    (SELECT id FROM users WHERE email = 'bob@example.com'),
    (SELECT id FROM users WHERE email = 'diana@example.com'),
    100
),
(
    (SELECT id FROM users WHERE email = 'charlie@example.com'),
    (SELECT id FROM users WHERE email = 'eve@example.com'),
    100
);

-- Insert sample certificates
INSERT INTO certificates (user_id, task_submission_id, certificate_url, issued_at, email_sent, email_sent_at) VALUES
(
    (SELECT id FROM users WHERE email = 'alice@example.com'),
    (SELECT id FROM task_submissions WHERE user_id = (SELECT id FROM users WHERE email = 'alice@example.com') AND task_id = (SELECT id FROM tasks WHERE title = 'Refer a Friend')),
    'https://example.com/certificates/alice-referral-cert.pdf',
    NOW() - INTERVAL '2 days',
    true,
    NOW() - INTERVAL '2 days'
),
(
    (SELECT id FROM users WHERE email = 'diana@example.com'),
    (SELECT id FROM task_submissions WHERE user_id = (SELECT id FROM users WHERE email = 'diana@example.com') AND task_id = (SELECT id FROM tasks WHERE title = 'Attend Workshop')),
    'https://example.com/certificates/diana-workshop-cert.pdf',
    NOW() - INTERVAL '1 day',
    true,
    NOW() - INTERVAL '1 day'
);

-- Insert sample redeem requests
INSERT INTO redeem_requests (user_id, points_requested, status, admin_notes, processed_by, processed_at) VALUES
(
    (SELECT id FROM users WHERE email = 'alice@example.com'),
    500,
    'pending',
    NULL,
    NULL,
    NULL
),
(
    (SELECT id FROM users WHERE email = 'charlie@example.com'),
    300,
    'approved',
    'Approved for payout',
    (SELECT id FROM admins WHERE email = 'admin@studentprograms.com'),
    NOW() - INTERVAL '1 day'
),
(
    (SELECT id FROM users WHERE email = 'bob@example.com'),
    200,
    'rejected',
    'Insufficient points available',
    (SELECT id FROM admins WHERE email = 'admin@studentprograms.com'),
    NOW() - INTERVAL '2 days'
);

-- Insert sample payouts
INSERT INTO payouts (redeem_request_id, user_id, amount, points_redeemed, payment_method, transaction_reference, status, admin_notes, processed_by, completed_at) VALUES
(
    (SELECT id FROM redeem_requests WHERE user_id = (SELECT id FROM users WHERE email = 'charlie@example.com') AND status = 'approved'),
    (SELECT id FROM users WHERE email = 'charlie@example.com'),
    30.00,
    300,
    'bank_transfer',
    'TXN123456789',
    'completed',
    'Payment processed successfully',
    (SELECT id FROM admins WHERE email = 'admin@studentprograms.com'),
    NOW() - INTERVAL '1 day'
),
(
    (SELECT id FROM redeem_requests WHERE user_id = (SELECT id FROM users WHERE email = 'alice@example.com') AND status = 'pending'),
    (SELECT id FROM users WHERE email = 'alice@example.com'),
    50.00,
    500,
    'paypal',
    NULL,
    'pending',
    NULL,
    NULL,
    NULL
);

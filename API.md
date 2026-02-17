# API Documentation

Complete API reference for the Student Programs Admin Panel.

---

## Table of Contents

- [Authentication](#authentication)
- [Admin Endpoints](#admin-endpoints)
  - [Dashboard](#dashboard)
  - [Users (Students)](#users-students)
  - [Tasks](#tasks)
  - [Task Submissions](#task-submissions)
  - [Certificates](#certificates)
  - [Redeem Requests](#redeem-requests)
  - [Payouts](#payouts)
- [Response Formats](#response-formats)
- [Error Handling](#error-handling)

---

## Authentication

All admin API endpoints require authentication via JWT tokens.

### Login

**POST** `/api/auth/login`

Authenticate an admin user and receive a JWT token.

**Request Body:**
```json
{
  "email": "admin@studentprograms.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "uuid",
    "email": "admin@studentprograms.com",
    "name": "Admin User",
    "role": "super_admin"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### Logout

**POST** `/api/auth/logout`

Invalidate the current session.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Admin Endpoints

All endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-token-here>
```

---

## Dashboard

### Get Dashboard Statistics

**GET** `/api/admin/dashboard/stats`

Retrieve overview statistics for the admin dashboard.

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalStudents": 150,
    "totalPoints": 45000,
    "pendingSubmissions": 12,
    "pendingRedemptions": 5,
    "totalCertificates": 89,
    "activeTasks": 8
  },
  "recentActivity": [
    {
      "id": "uuid",
      "type": "submission",
      "user": "John Doe",
      "action": "submitted task",
      "timestamp": "2024-02-17T10:30:00Z"
    }
  ]
}
```

---

## Users (Students)

### List All Students

**GET** `/api/admin/users`

Get a list of all registered students.

**Query Parameters:**
- `search` (optional) - Search by name, email, or referral code
- `limit` (optional) - Number of results (default: 50)
- `offset` (optional) - Pagination offset (default: 0)

**Example Request:**
```
GET /api/admin/users?search=john&limit=20&offset=0
```

**Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "id": "uuid",
      "email": "john.doe@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "total_points": 1500,
      "available_points": 1200,
      "referral_code": "JOHN2024",
      "referred_by": "uuid-of-referrer",
      "created_at": "2024-01-15T08:00:00Z",
      "updated_at": "2024-02-17T10:00:00Z"
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0
}
```

---

### Get Single Student

**GET** `/api/admin/users/:id`

Get details of a specific student.

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "total_points": 1500,
    "available_points": 1200,
    "referral_code": "JOHN2024",
    "referred_by": null,
    "created_at": "2024-01-15T08:00:00Z",
    "updated_at": "2024-02-17T10:00:00Z"
  }
}
```

---

### Create Student

**POST** `/api/admin/users`

Create a new student account.

**Request Body:**
```json
{
  "email": "jane.doe@example.com",
  "name": "Jane Doe",
  "phone": "+1987654321",
  "referralCode": "JANE2024"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "new-uuid",
    "email": "jane.doe@example.com",
    "name": "Jane Doe",
    "phone": "+1987654321",
    "total_points": 0,
    "available_points": 0,
    "referral_code": "JANE2024",
    "created_at": "2024-02-17T10:30:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Email already exists"
}
```

---

### Update Student

**PUT** `/api/admin/users/:id`

Update student information.

**Request Body:**
```json
{
  "email": "updated.email@example.com",
  "name": "Updated Name",
  "phone": "+1111111111"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "updated.email@example.com",
    "name": "Updated Name",
    "phone": "+1111111111",
    "updated_at": "2024-02-17T10:35:00Z"
  }
}
```

---

### Delete Student

**DELETE** `/api/admin/users/:id`

Delete a student account and all associated data.

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Warning:** This action is irreversible and will also delete:
- Task submissions
- Certificates
- Redeem requests
- Payouts
- Referrals

---

### Get Student Referrals

**GET** `/api/admin/users/:id/referrals`

Get all users referred by a specific student.

**Response (200):**
```json
{
  "success": true,
  "referrals": [
    {
      "id": "uuid",
      "name": "Referred User 1",
      "email": "user1@example.com",
      "referral_code": "USER1CODE",
      "created_at": "2024-02-01T08:00:00Z",
      "points_awarded": 100
    }
  ],
  "total": 3
}
```

---

### Create Demo Student

**POST** `/api/admin/users/demo`

Create a demo student with complete profile and sample data.

**Request Body:**
```json
{
  "name": "Demo Student",
  "email": "demo@example.com",
  "phone": "+1234567890",
  "referralCode": "DEMO2024"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Demo student created successfully",
  "user": { /* user object */ },
  "tasks": [ /* task submissions */ ],
  "certificates": [ /* certificates */ ]
}
```

---

### Search Users

**GET** `/api/admin/users/search`

Search for users by name, email, or referral code.

**Query Parameters:**
- `q` (required) - Search query

**Example:**
```
GET /api/admin/users/search?q=john
```

**Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "referral_code": "JOHN2024"
    }
  ]
}
```

---

## Tasks

### List All Tasks

**GET** `/api/admin/tasks`

Get all available tasks.

**Response (200):**
```json
{
  "success": true,
  "tasks": [
    {
      "id": "uuid",
      "title": "Refer a Friend",
      "description": "Refer a new student and earn points",
      "points": 100,
      "requires_validation": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## Task Submissions

### List Submissions

**GET** `/api/admin/submissions`

Get all task submissions with optional filtering.

**Query Parameters:**
- `status` (optional) - Filter by status: `pending`, `approved`, `rejected`
- `userId` (optional) - Filter by user ID
- `taskId` (optional) - Filter by task ID

**Example:**
```
GET /api/admin/submissions?status=pending
```

**Response (200):**
```json
{
  "success": true,
  "submissions": [
    {
      "id": "uuid",
      "user_id": "user-uuid",
      "task_id": "task-uuid",
      "proof_url": "https://example.com/proof.jpg",
      "proof_text": "Completed the task successfully",
      "status": "pending",
      "rejection_reason": null,
      "created_at": "2024-02-15T10:00:00Z",
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "task": {
        "title": "Complete Profile",
        "points": 50
      }
    }
  ]
}
```

---

### Get Single Submission

**GET** `/api/admin/submissions/:id`

Get details of a specific submission.

**Response (200):**
```json
{
  "success": true,
  "submission": {
    "id": "uuid",
    "user_id": "user-uuid",
    "task_id": "task-uuid",
    "proof_url": "https://example.com/proof.jpg",
    "proof_text": "Completed the task",
    "status": "pending",
    "created_at": "2024-02-15T10:00:00Z",
    "user": { /* user details */ },
    "task": { /* task details */ }
  }
}
```

---

### Approve Submission

**POST** `/api/admin/submissions/:id/approve`

Approve a pending task submission.

**Request Body (optional):**
```json
{
  "admin_notes": "Great work!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Submission approved successfully",
  "submission": {
    "id": "uuid",
    "status": "approved",
    "validated_by": "admin-uuid",
    "validated_at": "2024-02-17T10:40:00Z"
  },
  "certificate": {
    "id": "certificate-uuid",
    "certificate_url": "https://certificates.example.com/cert.pdf",
    "email_sent": true
  }
}
```

**Actions performed:**
- Updates submission status to `approved`
- Awards points to student
- Generates certificate
- Sends certificate email (if configured)

---

### Reject Submission

**POST** `/api/admin/submissions/:id/reject`

Reject a pending task submission.

**Request Body:**
```json
{
  "rejection_reason": "Proof is not clear enough. Please resubmit with better quality."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Submission rejected",
  "submission": {
    "id": "uuid",
    "status": "rejected",
    "rejection_reason": "Proof is not clear enough...",
    "validated_by": "admin-uuid",
    "validated_at": "2024-02-17T10:45:00Z"
  }
}
```

---

### Update Submission

**PATCH** `/api/admin/submissions/:id`

Update submission details (admin use).

**Request Body:**
```json
{
  "status": "pending",
  "admin_notes": "Need more information"
}
```

**Response (200):**
```json
{
  "success": true,
  "submission": { /* updated submission */ }
}
```

---

## Certificates

### List Certificates

**GET** `/api/admin/certificates`

Get all issued certificates.

**Query Parameters:**
- `userId` (optional) - Filter by user
- `taskId` (optional) - Filter by task
- `email_sent` (optional) - Filter by email status (`true`/`false`)

**Response (200):**
```json
{
  "success": true,
  "certificates": [
    {
      "id": "uuid",
      "user_id": "user-uuid",
      "task_submission_id": "submission-uuid",
      "certificate_url": "https://certificates.example.com/cert.pdf",
      "issued_at": "2024-02-15T12:00:00Z",
      "email_sent": true,
      "email_sent_at": "2024-02-15T12:05:00Z",
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "task_submission": {
        "task": {
          "title": "Complete Profile"
        }
      }
    }
  ]
}
```

---

### Resend Certificate Email

**POST** `/api/admin/certificates/:id/resend`

Resend certificate email to student.

**Response (200):**
```json
{
  "success": true,
  "message": "Certificate email sent successfully",
  "email_sent_at": "2024-02-17T10:50:00Z"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Failed to send email"
}
```

---

## Redeem Requests

### List Redeem Requests

**GET** `/api/admin/redeem-requests`

Get all redemption requests.

**Query Parameters:**
- `status` (optional) - Filter by status: `pending`, `approved`, `rejected`
- `userId` (optional) - Filter by user

**Example:**
```
GET /api/admin/redeem-requests?status=pending
```

**Response (200):**
```json
{
  "success": true,
  "requests": [
    {
      "id": "uuid",
      "user_id": "user-uuid",
      "points_requested": 500,
      "status": "pending",
      "admin_notes": null,
      "created_at": "2024-02-16T09:00:00Z",
      "user": {
        "name": "John Doe",
        "email": "john@example.com",
        "available_points": 1200
      }
    }
  ]
}
```

---

### Approve Redeem Request

**POST** `/api/admin/redeem-requests/:id/approve`

Approve a redemption request and create a payout.

**Request Body:**
```json
{
  "admin_notes": "Verified account details. Approved for payout.",
  "payment_method": "bank_transfer"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Redemption request approved",
  "request": {
    "id": "uuid",
    "status": "approved",
    "processed_by": "admin-uuid",
    "processed_at": "2024-02-17T11:00:00Z"
  },
  "payout": {
    "id": "payout-uuid",
    "amount": 50.00,
    "points_redeemed": 500,
    "payment_method": "bank_transfer",
    "status": "pending"
  }
}
```

**Actions performed:**
- Updates request status to `approved`
- Deducts points from user's available balance
- Creates a pending payout record

---

### Reject Redeem Request

**POST** `/api/admin/redeem-requests/:id/reject`

Reject a redemption request.

**Request Body:**
```json
{
  "admin_notes": "Insufficient available points. Current balance: 300 points."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Redemption request rejected",
  "request": {
    "id": "uuid",
    "status": "rejected",
    "admin_notes": "Insufficient available points...",
    "processed_by": "admin-uuid",
    "processed_at": "2024-02-17T11:05:00Z"
  }
}
```

---

## Payouts

### List Payouts

**GET** `/api/admin/payouts`

Get all payout records.

**Query Parameters:**
- `status` (optional) - Filter by status: `pending`, `processing`, `completed`, `failed`
- `userId` (optional) - Filter by user

**Example:**
```
GET /api/admin/payouts?status=pending
```

**Response (200):**
```json
{
  "success": true,
  "payouts": [
    {
      "id": "uuid",
      "redeem_request_id": "request-uuid",
      "user_id": "user-uuid",
      "amount": 50.00,
      "points_redeemed": 500,
      "payment_method": "bank_transfer",
      "transaction_reference": null,
      "status": "pending",
      "admin_notes": null,
      "created_at": "2024-02-16T10:00:00Z",
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

---

### Update Payout

**PATCH** `/api/admin/payouts/:id`

Update payout status and details.

**Request Body:**
```json
{
  "transaction_reference": "TXN-20240217-001",
  "status": "completed",
  "admin_notes": "Payment processed via Bank of America. Confirmed by recipient."
}
```

**Response (200):**
```json
{
  "success": true,
  "payout": {
    "id": "uuid",
    "transaction_reference": "TXN-20240217-001",
    "status": "completed",
    "admin_notes": "Payment processed...",
    "processed_by": "admin-uuid",
    "completed_at": "2024-02-17T11:15:00Z",
    "updated_at": "2024-02-17T11:15:00Z"
  }
}
```

---

## Response Formats

### Success Response

All successful API calls return this format:

```json
{
  "success": true,
  "data": { /* response data */ }
}
```

### Error Response

All errors return this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required or failed |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server-side error |

### Common Error Messages

**Authentication Errors:**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

```json
{
  "success": false,
  "error": "Unauthorized - Admin access required"
}
```

**Validation Errors:**
```json
{
  "success": false,
  "error": "Email already exists"
}
```

```json
{
  "success": false,
  "error": "Invalid email format"
}
```

**Not Found Errors:**
```json
{
  "success": false,
  "error": "User not found"
}
```

**Server Errors:**
```json
{
  "success": false,
  "error": "An unexpected error occurred"
}
```

---

## Rate Limiting

Currently, there are no rate limits on API endpoints. However, implement rate limiting in production to prevent abuse.

**Recommended limits:**
- Authentication: 5 requests per minute
- Read operations: 100 requests per minute
- Write operations: 30 requests per minute

---

## Best Practices

### 1. Always Include Authorization Header

```javascript
const response = await fetch('/api/admin/users', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 2. Handle Errors Gracefully

```javascript
try {
  const response = await fetch('/api/admin/submissions/123/approve');
  const data = await response.json();
  
  if (!data.success) {
    console.error('Error:', data.error);
  }
} catch (error) {
  console.error('Network error:', error);
}
```

### 3. Use Query Parameters for Filtering

```javascript
// Good
fetch('/api/admin/submissions?status=pending&limit=20')

// Avoid
fetch('/api/admin/submissions/pending/20')
```

### 4. Validate Data Before Sending

```javascript
const createStudent = async (data) => {
  // Validate email format
  if (!data.email.includes('@')) {
    throw new Error('Invalid email format');
  }
  
  return fetch('/api/admin/users', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};
```

---

## Example Usage

### Complete Workflow Example

Here's a complete example of approving a submission and sending a certificate:

```javascript
// 1. Get pending submissions
const getPendingSubmissions = async () => {
  const response = await fetch('/api/admin/submissions?status=pending', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

// 2. Approve a submission
const approveSubmission = async (submissionId) => {
  const response = await fetch(`/api/admin/submissions/${submissionId}/approve`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      admin_notes: 'Excellent work!'
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('✅ Submission approved');
    console.log('📧 Certificate sent to:', data.certificate.email_sent);
    console.log('🎓 Certificate URL:', data.certificate.certificate_url);
  }
  
  return data;
};

// Usage
const submissions = await getPendingSubmissions();
if (submissions.success && submissions.submissions.length > 0) {
  await approveSubmission(submissions.submissions[0].id);
}
```

---

## Support

For issues or questions about the API:

1. Check this documentation first
2. Review error messages carefully
3. Check server logs for detailed error information
4. Create an issue on GitHub with:
   - API endpoint
   - Request payload
   - Error response
   - Expected behavior

---

**Last Updated:** February 17, 2024  
**API Version:** 1.0  
**Base URL:** `http://localhost:3000` (development) or your production domain

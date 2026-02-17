# API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

All admin endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### Authentication

#### POST `/auth/login`

Login with admin credentials.

**Request Body:**

```json
{
  "email": "admin@studentprograms.com",
  "password": "admin123"
}
```

**Response:**

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

#### POST `/auth/logout`

Logout (clears session).

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Task Submissions

#### GET `/admin/submissions?status=all`

Get all task submissions.

**Query Parameters:**

- `status` (optional): `all`, `pending`, `approved`, `rejected`

**Response:**

```json
{
  "success": true,
  "submissions": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "task_id": "uuid",
      "proof_url": "https://...",
      "proof_text": "...",
      "status": "pending",
      "created_at": "2024-03-16T...",
      "user": { "id": "uuid", "name": "Alice", "email": "alice@example.com" },
      "task": { "id": "uuid", "title": "Refer a Friend", "points": 100 }
    }
  ]
}
```

#### GET `/admin/submissions/:id`

Get a single submission by ID.

**Response:**

```json
{
  "success": true,
  "submission": {
    /* submission object */
  }
}
```

#### POST `/admin/submissions/:id/approve`

Approve a task submission.

**Request Body:**

```json
{
  "adminId": "uuid"
}
```

**Response:**

```json
{
  "success": true,
  "submission": {
    /* updated submission */
  },
  "certificate": {
    /* generated certificate */
  }
}
```

#### POST `/admin/submissions/:id/reject`

Reject a task submission.

**Request Body:**

```json
{
  "adminId": "uuid",
  "reason": "Proof is not valid"
}
```

**Response:**

```json
{
  "success": true,
  "submission": {
    /* updated submission */
  }
}
```

---

### Certificates

#### GET `/admin/certificates`

Get all certificates.

**Response:**

```json
{
  "success": true,
  "certificates": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "task_submission_id": "uuid",
      "certificate_url": "https://...",
      "issued_at": "2024-03-16T...",
      "email_sent": true,
      "user": {
        /* user object */
      },
      "task_submission": {
        /* submission object */
      }
    }
  ]
}
```

#### POST `/admin/certificates/:id/resend`

Resend certificate email.

**Response:**

```json
{
  "success": true,
  "certificate": {
    /* updated certificate */
  },
  "message": "Certificate email sent successfully"
}
```

---

### Redeem Requests

#### GET `/admin/redeem-requests?status=all`

Get all redeem requests.

**Query Parameters:**

- `status` (optional): `all`, `pending`, `approved`, `rejected`, `completed`

**Response:**

```json
{
  "success": true,
  "requests": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "points_requested": 500,
      "status": "pending",
      "created_at": "2024-03-16T...",
      "user": {
        /* user object */
      }
    }
  ]
}
```

#### POST `/admin/redeem-requests/:id/approve`

Approve a redeem request.

**Request Body:**

```json
{
  "adminId": "uuid",
  "notes": "Approved for payout"
}
```

**Response:**

```json
{
  "success": true,
  "request": {
    /* updated request */
  }
}
```

#### POST `/admin/redeem-requests/:id/reject`

Reject a redeem request.

**Request Body:**

```json
{
  "adminId": "uuid",
  "reason": "Insufficient points"
}
```

**Response:**

```json
{
  "success": true,
  "request": {
    /* updated request */
  }
}
```

---

### Payouts

#### GET `/admin/payouts?status=all`

Get all payouts.

**Query Parameters:**

- `status` (optional): `all`, `pending`, `processing`, `completed`, `failed`

**Response:**

```json
{
  "success": true,
  "payouts": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "amount": 50.0,
      "points_redeemed": 500,
      "status": "pending",
      "transaction_reference": null,
      "created_at": "2024-03-16T...",
      "user": {
        /* user object */
      }
    }
  ]
}
```

#### PATCH `/admin/payouts/:id`

Update payout details.

**Request Body:**

```json
{
  "transaction_reference": "TXN123456",
  "status": "completed",
  "admin_notes": "Payment processed"
}
```

**Response:**

```json
{
  "success": true,
  "payout": {
    /* updated payout */
  }
}
```

---

### Users & Referrals

#### GET `/admin/users/search?q=alice`

Search users by name or email.

**Query Parameters:**

- `q` (required): Search query

**Response:**

```json
{
  "success": true,
  "users": [
    {
      "id": "uuid",
      "name": "Alice Smith",
      "email": "alice@example.com",
      "points": 1500,
      "referral_code": "ALICE123"
    }
  ]
}
```

#### GET `/admin/users/:id/referrals`

Get user's referral information.

**Response:**

```json
{
  "success": true,
  "user": {
    /* user object */
  },
  "referredBy": {
    /* user who referred them */
  },
  "referredUsers": [
    /* users they referred */
  ],
  "totalReferrals": 5
}
```

---

### Dashboard

#### GET `/admin/dashboard/stats`

Get dashboard statistics.

**Response:**

```json
{
  "success": true,
  "stats": {
    "totalUsers": 150,
    "totalReferrals": 75,
    "pendingValidations": 12,
    "pendingRedemptions": 5,
    "totalPointsAwarded": 45000,
    "completedPayouts": 20
  }
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**

- `200` - Success
- `400` - Bad Request (missing or invalid parameters)
- `401` - Unauthorized (invalid credentials or token)
- `404` - Not Found
- `500` - Internal Server Error

---

## Testing with cURL

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@studentprograms.com","password":"admin123"}'
```

### Get Submissions

```bash
curl http://localhost:3000/api/admin/submissions?status=pending \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Approve Submission

```bash
curl -X POST http://localhost:3000/api/admin/submissions/SUBMISSION_ID/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"adminId":"ADMIN_ID"}'
```

---

## Next Steps

1. Set up Supabase database (see `database/README.md`)
2. Configure environment variables (`.env.local`)
3. Test API endpoints
4. Integrate with frontend pages

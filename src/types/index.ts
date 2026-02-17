// User Types
export interface User {
  id: string
  email: string
  name: string
  phone: string
  totalPoints: number
  availablePoints: number
  referredBy: string | null
  createdAt: string
  updatedAt: string
}

// Admin Types
export interface Admin {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin'
  createdAt: string
}

// Task Types
export interface Task {
  id: string
  title: string
  description: string
  points: number
  requiresValidation: boolean
  createdAt: string
  updatedAt: string
}

// Task Submission Types
export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface TaskSubmission {
  id: string
  userId: string
  taskId: string
  proofUrl: string | null
  proofText: string | null
  status: SubmissionStatus
  rejectionReason: string | null
  validatedBy: string | null
  validatedAt: string | null
  createdAt: string
  updatedAt: string
  // Populated fields
  user?: User
  task?: Task
  validator?: Admin
}

// Certificate Types
export interface Certificate {
  id: string
  userId: string
  taskSubmissionId: string
  certificateUrl: string
  issuedAt: string
  emailSent: boolean
  emailSentAt: string | null
  createdAt: string
  // Populated fields
  user?: User
  taskSubmission?: TaskSubmission
}

// Redeem Request Types
export type RedeemStatus = 'pending' | 'approved' | 'rejected' | 'completed'

export interface RedeemRequest {
  id: string
  userId: string
  pointsRequested: number
  status: RedeemStatus
  adminNotes: string | null
  processedBy: string | null
  processedAt: string | null
  createdAt: string
  updatedAt: string
  // Populated fields
  user?: User
  processor?: Admin
}

// Payout Types
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Payout {
  id: string
  redeemRequestId: string
  userId: string
  amount: number
  pointsRedeemed: number
  paymentMethod: string
  transactionReference: string | null
  status: PayoutStatus
  adminNotes: string | null
  processedBy: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
  // Populated fields
  user?: User
  redeemRequest?: RedeemRequest
  processor?: Admin
}

// Referral Types
export interface Referral {
  id: string
  referrerId: string
  referredId: string
  pointsAwarded: number
  createdAt: string
  // Populated fields
  referrer?: User
  referred?: User
}

// Dashboard Stats Types
export interface DashboardStats {
  totalUsers: number
  totalReferrals: number
  pendingValidations: number
  pendingRedeemRequests: number
  totalPointsAwarded: number
  totalPayouts: number
}

// Referral Info Types
export interface ReferralInfo {
  user: User
  referredBy: User | null
  referredUsers: User[]
  totalReferrals: number
}

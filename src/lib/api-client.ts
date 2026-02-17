// API Client for Admin Panel
// This file handles all API calls to the backend

const API_BASE_URL = '/api'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Helper function to make API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// Authentication
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiCall<{
      success: boolean
      token: string
      admin: any
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    if (response.token) {
      localStorage.setItem('adminToken', response.token)
      localStorage.setItem('admin', JSON.stringify(response.admin))
    }
    
    return response
  },

  logout: async () => {
    await apiCall('/auth/logout', { method: 'POST' })
    localStorage.removeItem('adminToken')
    localStorage.removeItem('admin')
  },
}

// Dashboard
export const dashboardApi = {
  getStats: async () => {
    const response = await apiCall<{ success: boolean; stats: any }>('/admin/dashboard/stats')
    return response.stats
  },
}

// Submissions
export const submissionsApi = {
  getAll: async (status?: string) => {
    const query = status ? `?status=${status}` : ''
    const response = await apiCall<{ success: boolean; submissions: any[] }>(
      `/admin/submissions${query}`
    )
    return response.submissions
  },

  getById: async (id: string) => {
    const response = await apiCall<{ success: boolean; submission: any }>(
      `/admin/submissions/${id}`
    )
    return response.submission
  },

  approve: async (id: string, adminId: string) => {
    const response = await apiCall<{
      success: boolean
      submission: any
      certificate: any
    }>(`/admin/submissions/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ adminId }),
    })
    return response
  },

  reject: async (id: string, adminId: string, reason: string) => {
    const response = await apiCall<{ success: boolean; submission: any }>(
      `/admin/submissions/${id}/reject`,
      {
        method: 'POST',
        body: JSON.stringify({ adminId, reason }),
      }
    )
    return response.submission
  },
}

// Certificates
export const certificatesApi = {
  getAll: async () => {
    const response = await apiCall<{ success: boolean; certificates: any[] }>(
      '/admin/certificates'
    )
    return response.certificates
  },

  resend: async (id: string) => {
    const response = await apiCall<{
      success: boolean
      certificate: any
      message: string
    }>(`/admin/certificates/${id}/resend`, {
      method: 'POST',
    })
    return response
  },

  download: async (certificateUrl: string) => {
    // For now, just open the URL
    // TODO: Implement actual PDF download from storage
    window.open(certificateUrl, '_blank')
  },
}

// Redeem Requests
export const redeemRequestsApi = {
  getAll: async (status?: string) => {
    const query = status ? `?status=${status}` : ''
    const response = await apiCall<{ success: boolean; requests: any[] }>(
      `/admin/redeem-requests${query}`
    )
    return response.requests
  },

  approve: async (id: string, adminId: string, notes?: string) => {
    const response = await apiCall<{ success: boolean; request: any }>(
      `/admin/redeem-requests/${id}/approve`,
      {
        method: 'POST',
        body: JSON.stringify({ adminId, notes }),
      }
    )
    return response.request
  },

  reject: async (id: string, adminId: string, reason: string) => {
    const response = await apiCall<{ success: boolean; request: any }>(
      `/admin/redeem-requests/${id}/reject`,
      {
        method: 'POST',
        body: JSON.stringify({ adminId, reason }),
      }
    )
    return response.request
  },
}

// Payouts
export const payoutsApi = {
  getAll: async (status?: string) => {
    const query = status ? `?status=${status}` : ''
    const response = await apiCall<{ success: boolean; payouts: any[] }>(
      `/admin/payouts${query}`
    )
    return response.payouts
  },

  update: async (id: string, updates: any) => {
    const response = await apiCall<{ success: boolean; payout: any }>(
      `/admin/payouts/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }
    )
    return response.payout
  },
}

// Users & Referrals
export const usersApi = {
  getAll: async () => {
    const response = await apiCall<{ success: boolean; users: any[] }>(
      '/admin/users'
    )
    return response.users
  },

  getById: async (userId: string) => {
    const response = await apiCall<{ success: boolean; user: any }>(
      `/admin/users/${userId}`
    )
    return response.user
  },

  create: async (userData: {
    email: string
    name: string
    phone?: string
    referralCode: string
    referredBy?: string
  }) => {
    const response = await apiCall<{ success: boolean; user: any }>(
      '/admin/users',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    )
    return response.user
  },

  update: async (userId: string, userData: {
    email?: string
    name?: string
    phone?: string
    totalPoints?: number
    availablePoints?: number
  }) => {
    const response = await apiCall<{ success: boolean; user: any }>(
      `/admin/users/${userId}`,
      {
        method: 'PUT',
        body: JSON.stringify(userData),
      }
    )
    return response.user
  },

  delete: async (userId: string) => {
    const response = await apiCall<{ success: boolean; message: string }>(
      `/admin/users/${userId}`,
      {
        method: 'DELETE',
      }
    )
    return response
  },

  search: async (query: string) => {
    const response = await apiCall<{ success: boolean; users: any[] }>(
      `/admin/users/search?q=${encodeURIComponent(query)}`
    )
    return response.users
  },

  getReferrals: async (userId: string) => {
    const response = await apiCall<{
      success: boolean
      user: any
      referredBy: any
      referredUsers: any[]
      totalReferrals: number
    }>(`/admin/users/${userId}/referrals`)
    return response
  },
}

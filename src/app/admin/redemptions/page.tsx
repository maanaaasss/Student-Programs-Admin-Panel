'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/utils'
import { CheckCircle, XCircle } from 'lucide-react'

export default function RedemptionsPage() {
  const [redeemRequests, setRedeemRequests] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRedeemRequests()
  }, [filter])

  const fetchRedeemRequests = async () => {
    try {
      const query = filter !== 'all' ? `?status=${filter}` : ''
      const response = await fetch(`/api/admin/redeem-requests${query}`)
      const data = await response.json()
      if (data.success) {
        setRedeemRequests(data.requests)
      }
    } catch (error) {
      console.error('Failed to fetch redeem requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (requestId: string) => {
    const notes = prompt('Add admin notes (optional):')
    try {
      const admin = JSON.parse(localStorage.getItem('admin') || '{}')
      
      if (!admin || !admin.id || admin.id === 'undefined' || typeof admin.id !== 'string' || admin.id.trim() === '') {
        alert('Admin session invalid. Please log out and log in again.')
        localStorage.removeItem('admin')
        localStorage.removeItem('adminToken')
        window.location.href = '/admin/login'
        return
      }
      
      const response = await fetch(`/api/admin/redeem-requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: admin.id, notes: notes || 'Approved for payout' }),
      })

      const data = await response.json()
      if (data.success) {
        alert('Redemption request approved!')
        fetchRedeemRequests()
      }
    } catch (error) {
      console.error('Failed to approve request:', error)
      alert('Failed to approve request')
    }
  }

  const handleReject = async (requestId: string) => {
    const reason = prompt('Enter rejection reason:')
    if (!reason) return

    try {
      const admin = JSON.parse(localStorage.getItem('admin') || '{}')
      
      if (!admin || !admin.id || admin.id === 'undefined' || typeof admin.id !== 'string' || admin.id.trim() === '') {
        alert('Admin session invalid. Please log out and log in again.')
        localStorage.removeItem('admin')
        localStorage.removeItem('adminToken')
        window.location.href = '/admin/login'
        return
      }
      
      const response = await fetch(`/api/admin/redeem-requests/${requestId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: admin.id, reason }),
      })

      const data = await response.json()
      if (data.success) {
        alert('Redemption request rejected!')
        fetchRedeemRequests()
      }
    } catch (error) {
      console.error('Failed to reject request:', error)
      alert('Failed to reject request')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading redemption requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Redemption Requests</h1>
        <p className="text-gray-600 mt-1">Manage student point redemption requests</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'rejected', 'completed'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status)}
            size="sm"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requests ({redeemRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Points Requested</TableHead>
                <TableHead>Available Points</TableHead>
                <TableHead>Requested Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {redeemRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.user?.name}</p>
                      <p className="text-xs text-gray-500">{request.user?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{request.points_requested}</TableCell>
                  <TableCell>{request.user?.available_points}</TableCell>
                  <TableCell>{formatDateTime(request.created_at)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === 'approved' || request.status === 'completed'
                          ? 'success'
                          : request.status === 'rejected'
                          ? 'destructive'
                          : 'warning'
                      }
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(request.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(request.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                    {request.admin_notes && (
                      <p className="text-xs text-gray-600 mt-1">{request.admin_notes}</p>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

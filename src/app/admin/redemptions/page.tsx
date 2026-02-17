'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { formatDateTime } from '@/lib/utils'
import { CheckCircle, XCircle, ShoppingCart, Coins, MoreVertical } from 'lucide-react'
import { MobileCard } from '@/components/ui/mobile-card'
import { TableSkeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/toast'

export default function RedemptionsPage() {
  const { addToast } = useToast()
  const [redeemRequests, setRedeemRequests] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('all')
  const [loading, setLoading] = useState(true)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null)
  const [approvalNotes, setApprovalNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchRedeemRequests()
  }, [filter])

  const fetchRedeemRequests = async () => {
    try {
      setLoading(true)
      const query = filter !== 'all' ? `?status=${filter}` : ''
      const response = await fetch(`/api/admin/redeem-requests${query}`)
      const data = await response.json()
      if (data.success) {
        setRedeemRequests(data.requests)
      } else {
        addToast({
          type: 'error',
          title: 'Failed to fetch redemption requests',
          description: data.error || 'Please try again',
        })
      }
    } catch (error) {
      console.error('Failed to fetch redeem requests:', error)
      addToast({
        type: 'error',
        title: 'Failed to fetch redemption requests',
        description: 'An unexpected error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  const openApproveDialog = (request: any) => {
    setSelectedRequest(request)
    setApprovalNotes('')
    setIsApproveDialogOpen(true)
  }

  const openRejectDialog = (request: any) => {
    setSelectedRequest(request)
    setRejectionReason('')
    setIsRejectDialogOpen(true)
  }

  const handleApprove = async () => {
    if (!selectedRequest) return

    try {
      setIsSubmitting(true)
      const admin = JSON.parse(localStorage.getItem('admin') || '{}')
      
      if (!admin || !admin.id || admin.id === 'undefined' || typeof admin.id !== 'string' || admin.id.trim() === '') {
        addToast({
          type: 'error',
          title: 'Session expired',
          description: 'Please log out and log in again',
        })
        localStorage.removeItem('admin')
        localStorage.removeItem('adminToken')
        window.location.href = '/admin/login'
        return
      }
      
      const response = await fetch(`/api/admin/redeem-requests/${selectedRequest.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: admin.id, notes: approvalNotes || 'Approved for payout' }),
      })

      const data = await response.json()
      if (data.success) {
        addToast({
          type: 'success',
          title: 'Request approved',
          description: 'Redemption request has been approved',
        })
        fetchRedeemRequests()
        setIsApproveDialogOpen(false)
        setSelectedRequest(null)
        setApprovalNotes('')
      } else {
        addToast({
          type: 'error',
          title: 'Failed to approve request',
          description: data.error || 'Please try again',
        })
      }
    } catch (error) {
      console.error('Failed to approve request:', error)
      addToast({
        type: 'error',
        title: 'Failed to approve request',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!selectedRequest) return
    
    if (!rejectionReason.trim()) {
      addToast({
        type: 'warning',
        title: 'Rejection reason required',
        description: 'Please provide a reason for rejection',
      })
      return
    }

    try {
      setIsSubmitting(true)
      const admin = JSON.parse(localStorage.getItem('admin') || '{}')
      
      if (!admin || !admin.id || admin.id === 'undefined' || typeof admin.id !== 'string' || admin.id.trim() === '') {
        addToast({
          type: 'error',
          title: 'Session expired',
          description: 'Please log out and log in again',
        })
        localStorage.removeItem('admin')
        localStorage.removeItem('adminToken')
        window.location.href = '/admin/login'
        return
      }
      
      const response = await fetch(`/api/admin/redeem-requests/${selectedRequest.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: admin.id, reason: rejectionReason }),
      })

      const data = await response.json()
      if (data.success) {
        addToast({
          type: 'success',
          title: 'Request rejected',
          description: 'Student has been notified',
        })
        fetchRedeemRequests()
        setIsRejectDialogOpen(false)
        setSelectedRequest(null)
        setRejectionReason('')
      } else {
        addToast({
          type: 'error',
          title: 'Failed to reject request',
          description: data.error || 'Please try again',
        })
      }
    } catch (error) {
      console.error('Failed to reject request:', error)
      addToast({
        type: 'error',
        title: 'Failed to reject request',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Redemption Requests</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Manage student point redemption requests</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'pending', 'approved', 'rejected', 'completed'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status)}
            size="sm"
            className="whitespace-nowrap"
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
          {loading ? (
            <TableSkeleton rows={5} />
          ) : redeemRequests.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title={filter === 'all' ? 'No redemption requests yet' : `No ${filter} requests`}
              description={
                filter === 'all'
                  ? 'Redemption requests will appear here'
                  : 'Try selecting a different filter'
              }
            />
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
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
                        <TableCell className="font-semibold">
                          <div className="flex items-center gap-1">
                            <Coins className="h-4 w-4 text-amber-600" />
                            {request.points_requested}
                          </div>
                        </TableCell>
                        <TableCell>{request.user?.available_points}</TableCell>
                        <TableCell>{formatDateTime(request.created_at)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === 'approved' || request.status === 'completed'
                                ? 'approved'
                                : request.status === 'rejected'
                                ? 'rejected'
                                : 'pending'
                            }
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.status === 'pending' ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <MoreVertical className="h-5 w-5 text-slate-600" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => openApproveDialog(request)}>
                                  <CheckCircle className="h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openRejectDialog(request)} destructive>
                                  <XCircle className="h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            request.admin_notes && (
                              <p className="text-xs text-gray-600">{request.admin_notes}</p>
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {redeemRequests.map((request) => (
                  <MobileCard
                    key={request.id}
                    title={request.user?.name || 'Unknown'}
                    subtitle={request.user?.email || 'No email'}
                    metadata={[
                      { label: 'Points Requested', value: request.points_requested.toString() },
                      { label: 'Available Points', value: request.user?.available_points?.toString() || '0' },
                      { label: 'Requested', value: formatDateTime(request.created_at) },
                    ]}
                    badges={[
                      {
                        label: request.status,
                        variant: request.status === 'approved' || request.status === 'completed'
                          ? 'approved'
                          : request.status === 'rejected'
                          ? 'rejected'
                          : 'pending',
                      },
                    ]}
                    actions={
                      request.status === 'pending'
                        ? [
                            {
                              label: 'Approve',
                              icon: CheckCircle,
                              onClick: () => openApproveDialog(request),
                            },
                            {
                              label: 'Reject',
                              icon: XCircle,
                              onClick: () => openRejectDialog(request),
                              variant: 'destructive',
                            },
                          ]
                        : []
                    }
                  />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="max-w-2xl p-0">
          {/* Header with Gradient */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 px-6 py-8">
            <div className="absolute inset-0 bg-grid-white/[0.05]" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">Approve Redemption</DialogTitle>
                  <DialogDescription className="text-green-50 mt-1">
                    Create payout entry for this request
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
          
          {selectedRequest && (
            <div className="p-6 space-y-6">
              {/* Student Information Card */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                    {selectedRequest.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-lg">{selectedRequest.user?.name}</h3>
                    <p className="text-sm text-slate-600 mt-0.5">{selectedRequest.user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Points Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-amber-700 text-xs font-medium uppercase tracking-wide mb-2">
                    <Coins className="h-4 w-4" />
                    Points Requested
                  </div>
                  <p className="text-2xl font-bold text-amber-900">{selectedRequest.points_requested}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-blue-700 text-xs font-medium uppercase tracking-wide mb-2">
                    Available Points
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{selectedRequest.user?.available_points}</p>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Admin Notes <span className="text-slate-400">(Optional)</span>
                </label>
                <Input
                  placeholder="Add notes about this approval..."
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsApproveDialogOpen(false)
                  setSelectedRequest(null)
                  setApprovalNotes('')
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleApprove} 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/30"
              >
                {isSubmitting ? 'Approving...' : 'Approve Request'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="max-w-2xl p-0">
          {/* Header with Gradient */}
          <div className="relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 px-6 py-8">
            <div className="absolute inset-0 bg-grid-white/[0.05]" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">Reject Redemption</DialogTitle>
                  <DialogDescription className="text-red-50 mt-1">
                    Provide a reason for rejection
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
          
          {selectedRequest && (
            <div className="p-6 space-y-6">
              {/* Student Information Card */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                    {selectedRequest.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-lg">{selectedRequest.user?.name}</h3>
                    <p className="text-sm text-slate-600 mt-0.5">{selectedRequest.user?.email}</p>
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                      <Coins className="h-4 w-4 text-amber-600" />
                      <span className="font-medium">{selectedRequest.points_requested} points requested</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rejection Reason */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-red-900 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Enter rejection reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full border border-red-300 rounded-md p-3 min-h-[120px] text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                />
                <p className="text-xs text-red-600 mt-2">This reason will be sent to the student</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsRejectDialogOpen(false)
                  setSelectedRequest(null)
                  setRejectionReason('')
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleReject} 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/30"
              >
                {isSubmitting ? 'Rejecting...' : 'Reject Request'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

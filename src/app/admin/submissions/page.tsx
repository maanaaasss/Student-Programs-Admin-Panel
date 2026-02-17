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
import { formatDateTime } from '@/lib/utils'
import { CheckCircle, XCircle, Eye, FileCheck, ExternalLink, Award } from 'lucide-react'
import { MobileCard } from '@/components/ui/mobile-card'
import { TableSkeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/toast'
import type { TaskSubmission } from '@/types'

const isValidUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)

export default function SubmissionsPage() {
  const { addToast } = useToast()
  const [submissions, setSubmissions] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubmissions()
  }, [filter])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const query = filter !== 'all' ? `?status=${filter}` : ''
      const response = await fetch(`/api/admin/submissions${query}`)
      const data = await response.json()
      if (data.success) {
        setSubmissions(data.submissions)
      } else {
        addToast({
          type: 'error',
          title: 'Failed to fetch submissions',
          description: data.error || 'Please try again',
        })
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
      addToast({
        type: 'error',
        title: 'Failed to fetch submissions',
        description: 'An unexpected error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (submissionId: string) => {
    try {
      if (!submissionId || typeof submissionId !== 'string' || !isValidUuid(submissionId)) {
        console.error('Invalid submission id for approve:', submissionId)
        addToast({
          type: 'error',
          title: 'Invalid submission ID',
          description: 'Please refresh and try again',
        })
        return
      }

      const adminStr = localStorage.getItem('admin')
      console.log('Admin from localStorage:', adminStr)
      
      const admin = JSON.parse(adminStr || '{}')
      console.log('Parsed admin:', admin)
      
      if (!admin || !admin.id || admin.id === 'undefined' || typeof admin.id !== 'string' || admin.id.trim() === '') {
        addToast({
          type: 'error',
          title: 'Session expired',
          description: 'Please log out and log in again',
        })
        console.error('Admin object is missing or has invalid id:', admin)
        localStorage.removeItem('admin')
        localStorage.removeItem('adminToken')
        window.location.href = '/admin/login'
        return
      }

      console.log('Sending approve request with adminId:', admin.id)

      const response = await fetch(`/api/admin/submissions/${submissionId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: admin.id }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.error('Approve failed:', data)
        addToast({
          type: 'error',
          title: 'Failed to approve submission',
          description: data.error || 'Please try again',
        })
        return
      }

      if (data.success) {
        addToast({
          type: 'success',
          title: 'Task approved!',
          description: 'Points credited and certificate generated',
        })
        fetchSubmissions()
        setSelectedSubmission(null)
      }
    } catch (error) {
      console.error('Failed to approve submission:', error)
      addToast({
        type: 'error',
        title: 'Failed to approve submission',
        description: 'An unexpected error occurred',
      })
    }
  }

  const handleReject = async (submissionId: string) => {
    if (!rejectionReason.trim()) {
      addToast({
        type: 'warning',
        title: 'Rejection reason required',
        description: 'Please provide a reason for rejection',
      })
      return
    }

    try {
      if (!submissionId || typeof submissionId !== 'string' || !isValidUuid(submissionId)) {
        console.error('Invalid submission id for reject:', submissionId)
        addToast({
          type: 'error',
          title: 'Invalid submission ID',
          description: 'Please refresh and try again',
        })
        return
      }

      const adminStr = localStorage.getItem('admin')
      console.log('Admin from localStorage:', adminStr)
      
      const admin = JSON.parse(adminStr || '{}')
      console.log('Parsed admin:', admin)
      
      if (!admin || !admin.id || admin.id === 'undefined' || typeof admin.id !== 'string' || admin.id.trim() === '') {
        addToast({
          type: 'error',
          title: 'Session expired',
          description: 'Please log out and log in again',
        })
        console.error('Admin object is missing or has invalid id:', admin)
        localStorage.removeItem('admin')
        localStorage.removeItem('adminToken')
        window.location.href = '/admin/login'
        return
      }

      console.log('Sending reject request with adminId:', admin.id)

      const response = await fetch(`/api/admin/submissions/${submissionId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: admin.id, reason: rejectionReason }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.error('Reject failed:', data)
        addToast({
          type: 'error',
          title: 'Failed to reject submission',
          description: data.error || 'Please try again',
        })
        return
      }

      if (data.success) {
        addToast({
          type: 'success',
          title: 'Task rejected',
          description: 'Student has been notified',
        })
        fetchSubmissions()
        setSelectedSubmission(null)
        setRejectionReason('')
      }
    } catch (error) {
      console.error('Failed to reject submission:', error)
      addToast({
        type: 'error',
        title: 'Failed to reject submission',
        description: 'An unexpected error occurred',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Task Validation</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Review and validate student task submissions</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
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

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions ({submissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton rows={5} />
          ) : submissions.length === 0 ? (
            <EmptyState
              icon={FileCheck}
              title={filter === 'all' ? 'No submissions yet' : `No ${filter} submissions`}
              description={
                filter === 'all'
                  ? 'Task submissions will appear here'
                  : `Try selecting a different filter`
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
                      <TableHead>Task</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{submission.user?.name}</p>
                            <p className="text-xs text-gray-500">{submission.user?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{submission.task?.title}</TableCell>
                        <TableCell>{submission.task?.points}</TableCell>
                        <TableCell>{formatDateTime(submission.created_at)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              submission.status === 'approved'
                                ? 'approved'
                                : submission.status === 'rejected'
                                ? 'rejected'
                                : 'pending'
                            }
                          >
                            {submission.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedSubmission(submission)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {submission.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleApprove(submission.id)}
                                  title="Approve"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedSubmission(submission)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                  title="Reject"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {submissions.map((submission) => (
                  <MobileCard
                    key={submission.id}
                    title={submission.user?.name || 'Unknown'}
                    subtitle={submission.task?.title || 'Unknown Task'}
                    metadata={[
                      { label: 'Email', value: submission.user?.email || 'N/A' },
                      { label: 'Points', value: submission.task?.points?.toString() || '0' },
                      { label: 'Submitted', value: formatDateTime(submission.created_at) },
                    ]}
                    badges={[
                      {
                        label: submission.status,
                        variant: submission.status === 'approved'
                          ? 'approved'
                          : submission.status === 'rejected'
                          ? 'rejected'
                          : 'pending',
                      },
                    ]}
                    actions={[
                      {
                        label: 'View',
                        icon: Eye,
                        onClick: () => setSelectedSubmission(submission),
                      },
                      ...(submission.status === 'pending'
                        ? [
                            {
                              label: 'Approve',
                              icon: CheckCircle,
                              onClick: () => handleApprove(submission.id),
                            },
                            {
                              label: 'Reject',
                              icon: XCircle,
                              onClick: () => setSelectedSubmission(submission),
                              variant: 'destructive' as const,
                            },
                          ]
                        : []),
                    ]}
                  />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Submission Details Modal */}
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => {
        if (!open) {
          setSelectedSubmission(null)
          setRejectionReason('')
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          {selectedSubmission && (
            <>
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {selectedSubmission.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {selectedSubmission.user?.name}
                      </h2>
                      <p className="text-sm text-slate-500">{selectedSubmission.user?.email}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      selectedSubmission.status === 'approved'
                        ? 'approved'
                        : selectedSubmission.status === 'rejected'
                        ? 'rejected'
                        : 'pending'
                    }
                    className="text-xs"
                  >
                    {selectedSubmission.status}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6 space-y-6">
                {/* Task Card */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-900 text-sm">Task Details</h3>
                  </div>
                  <div className="p-4 bg-white space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
                            Title
                          </p>
                          <p className="text-base font-semibold text-slate-900">
                            {selectedSubmission.task?.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg">
                          <Award className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm font-bold text-emerald-700">
                            {selectedSubmission.task?.points} pts
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {selectedSubmission.task?.description && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1.5">
                          Description
                        </p>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {selectedSubmission.task?.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submission Proof Card */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-900 text-sm">Submission Proof</h3>
                  </div>
                  <div className="p-4 bg-white space-y-4">
                    {selectedSubmission.proof_url && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">
                          Proof Link
                        </p>
                        <a
                          href={selectedSubmission.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md font-medium text-sm"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open Proof Link
                        </a>
                      </div>
                    )}
                    
                    {selectedSubmission.proof_text && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">
                          Proof Description
                        </p>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {selectedSubmission.proof_text}
                          </p>
                        </div>
                      </div>
                    )}

                    {!selectedSubmission.proof_url && !selectedSubmission.proof_text && (
                      <p className="text-sm text-slate-400 italic">No proof provided</p>
                    )}
                  </div>
                </div>

                {/* Rejection Reason Input */}
                {selectedSubmission.status === 'pending' && (
                  <div className="border border-amber-200 rounded-xl overflow-hidden bg-amber-50/50">
                    <div className="px-4 py-3 border-b border-amber-200 bg-amber-50">
                      <h3 className="font-semibold text-amber-900 text-sm">Rejection Reason</h3>
                      <p className="text-xs text-amber-700 mt-0.5">Only required if you choose to reject</p>
                    </div>
                    <div className="p-4 bg-white">
                      <textarea
                        placeholder="Explain why this submission doesn't meet requirements..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full border-2 border-slate-200 rounded-lg p-3 min-h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                )}

                {/* Already Rejected Reason */}
                {selectedSubmission.status === 'rejected' && selectedSubmission.rejection_reason && (
                  <div className="border border-red-200 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-red-50 to-red-100 px-4 py-3 border-b border-red-200">
                      <h3 className="font-semibold text-red-900 text-sm">Rejection Reason</h3>
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-sm text-red-700 leading-relaxed">
                        {selectedSubmission.rejection_reason}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4">
                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedSubmission(null)
                      setRejectionReason('')
                    }}
                    className="border-slate-300"
                  >
                    Close
                  </Button>
                  {selectedSubmission?.status === 'pending' && (
                    <>
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(selectedSubmission.id)}
                        className="gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleApprove(selectedSubmission.id)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-sm hover:shadow-md gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve Submission
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

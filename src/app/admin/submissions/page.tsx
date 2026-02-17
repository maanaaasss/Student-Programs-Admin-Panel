'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/utils'
import { CheckCircle, XCircle, Eye } from 'lucide-react'
import type { TaskSubmission } from '@/types'

const isValidUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)

export default function SubmissionsPage() {
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
      const query = filter !== 'all' ? `?status=${filter}` : ''
      const response = await fetch(`/api/admin/submissions${query}`)
      const data = await response.json()
      if (data.success) {
        setSubmissions(data.submissions)
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (submissionId: string) => {
    try {
      if (!submissionId || typeof submissionId !== 'string' || !isValidUuid(submissionId)) {
        console.error('Invalid submission id for approve:', submissionId)
        alert('Invalid submission ID. Please refresh and try again.')
        return
      }

      const adminStr = localStorage.getItem('admin')
      console.log('Admin from localStorage:', adminStr)
      
      const admin = JSON.parse(adminStr || '{}')
      console.log('Parsed admin:', admin)
      
      if (!admin || !admin.id || admin.id === 'undefined' || typeof admin.id !== 'string' || admin.id.trim() === '') {
        alert('Admin session invalid. Please log out and log in again.')
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
        alert(data.error || 'Failed to approve submission')
        return
      }

      if (data.success) {
        alert('Task approved! Points credited and certificate generated.')
        fetchSubmissions()
        setSelectedSubmission(null)
      }
    } catch (error) {
      console.error('Failed to approve submission:', error)
      alert('Failed to approve submission')
    }
  }

  const handleReject = async (submissionId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }

    try {
      if (!submissionId || typeof submissionId !== 'string' || !isValidUuid(submissionId)) {
        console.error('Invalid submission id for reject:', submissionId)
        alert('Invalid submission ID. Please refresh and try again.')
        return
      }

      const adminStr = localStorage.getItem('admin')
      console.log('Admin from localStorage:', adminStr)
      
      const admin = JSON.parse(adminStr || '{}')
      console.log('Parsed admin:', admin)
      
      if (!admin || !admin.id || admin.id === 'undefined' || typeof admin.id !== 'string' || admin.id.trim() === '') {
        alert('Admin session invalid. Please log out and log in again.')
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
        alert(data.error || 'Failed to reject submission')
        return
      }

      if (data.success) {
        alert('Task rejected')
        fetchSubmissions()
        setSelectedSubmission(null)
        setRejectionReason('')
      }
    } catch (error) {
      console.error('Failed to reject submission:', error)
      alert('Failed to reject submission')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Task Validation</h1>
        <p className="text-gray-600 mt-1">Review and validate student task submissions</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
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

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions ({submissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
                          ? 'success'
                          : submission.status === 'rejected'
                          ? 'destructive'
                          : 'warning'
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
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {submission.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(submission.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setSelectedSubmission(submission)}
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
        </CardContent>
      </Card>

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto bg-white">
            <CardHeader>
              <CardTitle>Submission Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Student Information</h3>
                <p><strong>Name:</strong> {selectedSubmission.user?.name}</p>
                <p><strong>Email:</strong> {selectedSubmission.user?.email}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Task Information</h3>
                <p><strong>Task:</strong> {selectedSubmission.task?.title}</p>
                <p><strong>Description:</strong> {selectedSubmission.task?.description}</p>
                <p><strong>Points:</strong> {selectedSubmission.task?.points}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Submission Proof</h3>
                {selectedSubmission.proof_url && (
                  <p><strong>Proof URL:</strong> <a href={selectedSubmission.proof_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedSubmission.proof_url}</a></p>
                )}
                {selectedSubmission.proof_text && (
                  <p><strong>Description:</strong> {selectedSubmission.proof_text}</p>
                )}
              </div>

              {selectedSubmission.status === 'pending' && (
                <div>
                  <h3 className="font-semibold mb-2">Rejection Reason (if rejecting)</h3>
                  <textarea
                    className="w-full border rounded-md p-2 min-h-[100px]"
                    placeholder="Enter rejection reason..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              )}

              {selectedSubmission.status === 'rejected' && selectedSubmission.rejection_reason && (
                <div>
                  <h3 className="font-semibold mb-2">Rejection Reason</h3>
                  <p className="text-red-600">{selectedSubmission.rejection_reason}</p>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => {
                  setSelectedSubmission(null)
                  setRejectionReason('')
                }}>
                  Close
                </Button>
                {selectedSubmission.status === 'pending' && (
                  <>
                    <Button
                      variant="default"
                      onClick={() => handleApprove(selectedSubmission.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(selectedSubmission.id)}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

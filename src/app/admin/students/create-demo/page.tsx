'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useToast } from '@/components/ui/toast'

interface Task {
  id: string
  title: string
  points: number
}

interface User {
  id: string
  name: string
  email: string
  referral_code: string
}

export default function CreateDemoStudentPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Basic user info
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [referredBy, setReferredBy] = useState('')
  const [totalPoints, setTotalPoints] = useState(0)
  const [availablePoints, setAvailablePoints] = useState(0)

  // Task submissions
  const [taskSubmissions, setTaskSubmissions] = useState<any[]>([])

  // Certificates
  const [generateCertificates, setGenerateCertificates] = useState(false)

  // Redemption requests
  const [redemptionRequests, setRedemptionRequests] = useState<any[]>([])

  // Payouts
  const [payouts, setPayouts] = useState<any[]>([])

  // Referrals
  const [referredUsers, setReferredUsers] = useState<string[]>([])

  useEffect(() => {
    fetchData()
    generateReferralCode()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [tasksRes, usersRes] = await Promise.all([
        fetch('/api/admin/tasks'),
        fetch('/api/admin/users')
      ])

      const tasksData = await tasksRes.json()
      const usersData = await usersRes.json()

      if (tasksData.success) setTasks(tasksData.tasks || [])
      if (usersData.success) setUsers(usersData.users || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setReferralCode(code)
  }

  const addTaskSubmission = () => {
    setTaskSubmissions([
      ...taskSubmissions,
      {
        taskId: tasks[0]?.id || '',
        proofUrl: '',
        proofText: '',
        status: 'pending',
        rejectionReason: '',
        validatedBy: null,
        validatedAt: null
      }
    ])
  }

  const removeTaskSubmission = (index: number) => {
    setTaskSubmissions(taskSubmissions.filter((_, i) => i !== index))
  }

  const updateTaskSubmission = (index: number, field: string, value: any) => {
    const updated = [...taskSubmissions]
    updated[index] = { ...updated[index], [field]: value }
    setTaskSubmissions(updated)
  }

  const addRedemptionRequest = () => {
    setRedemptionRequests([
      ...redemptionRequests,
      {
        pointsRequested: 100,
        status: 'pending',
        adminNotes: '',
        processedBy: null,
        processedAt: null
      }
    ])
  }

  const removeRedemptionRequest = (index: number) => {
    setRedemptionRequests(redemptionRequests.filter((_, i) => i !== index))
  }

  const updateRedemptionRequest = (index: number, field: string, value: any) => {
    const updated = [...redemptionRequests]
    updated[index] = { ...updated[index], [field]: value }
    setRedemptionRequests(updated)
  }

  const addPayout = () => {
    setPayouts([
      ...payouts,
      {
        amount: 10.00,
        pointsRedeemed: 100,
        paymentMethod: 'bank_transfer',
        transactionReference: '',
        status: 'pending',
        adminNotes: '',
        processedBy: null,
        completedAt: null
      }
    ])
  }

  const removePayout = (index: number) => {
    setPayouts(payouts.filter((_, i) => i !== index))
  }

  const updatePayout = (index: number, field: string, value: any) => {
    const updated = [...payouts]
    updated[index] = { ...updated[index], [field]: value }
    setPayouts(updated)
  }

  const toggleReferredUser = (userId: string) => {
    if (referredUsers.includes(userId)) {
      setReferredUsers(referredUsers.filter(id => id !== userId))
    } else {
      setReferredUsers([...referredUsers, userId])
    }
  }

  const handleSubmit = async () => {
    if (!name || !email || !referralCode) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        description: 'Name, email, and referral code are required'
      })
      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      const response = await fetch('/api/admin/users/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          phone,
          referralCode,
          referredBy: referredBy || null,
          totalPoints,
          availablePoints,
          taskSubmissions,
          generateCertificates,
          redemptionRequests,
          payouts,
          referredUsers
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        addToast({
          type: 'success',
          title: 'Demo Student Created',
          description: `Successfully created demo student: ${name}`
        })
        router.push('/admin/students')
      } else {
        addToast({
          type: 'error',
          title: 'Creation Failed',
          description: data.error || 'Failed to create demo student'
        })
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to create demo student'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 max-w-6xl">
        <div className="mb-8">
          <div className="h-10 w-32 bg-gray-200 rounded-md mb-4 animate-pulse" />
          <div className="h-9 w-64 bg-gray-200 rounded-md mb-2 animate-pulse" />
          <div className="h-5 w-96 bg-gray-200 rounded-md animate-pulse" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="h-6 w-48 bg-gray-200 rounded-md mb-4 animate-pulse" />
              <div className="space-y-3">
                <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
                <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <Button
          variant="outline"
          onClick={() => router.push('/admin/students')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Back to Students</span>
          <span className="sm:hidden">Back</span>
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Demo Student</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Create a fully configured test student with submissions, certificates, and more
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Accordion type="multiple" defaultValue={["basic", "tasks"]} className="space-y-4">
        {/* Basic Information */}
        <AccordionItem value="basic">
          <Card>
            <CardHeader>
              <AccordionTrigger className="hover:no-underline">
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Referral Code *
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                        placeholder="REFCODE123"
                      />
                      <Button type="button" variant="outline" onClick={generateReferralCode}>
                        <span className="hidden sm:inline">Generate</span>
                        <span className="sm:hidden">Gen</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Referred By
                    </label>
                    <Select
                      value={referredBy}
                      onChange={(e) => setReferredBy(e.target.value)}
                      options={[
                        { value: '', label: 'None' },
                        ...users.map(u => ({ value: u.id, label: `${u.name} (${u.referral_code})` }))
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Points
                    </label>
                    <Input
                      type="number"
                      value={totalPoints}
                      onChange={(e) => setTotalPoints(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Available Points
                    </label>
                    <Input
                      type="number"
                      value={availablePoints}
                      onChange={(e) => setAvailablePoints(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Task Submissions */}
        <AccordionItem value="tasks">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <AccordionTrigger className="hover:no-underline flex-1">
                <CardTitle className="text-lg">Task Submissions</CardTitle>
              </AccordionTrigger>
              <Button 
                onClick={addTaskSubmission} 
                size="sm"
                className="ml-2"
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add Submission</span>
              </Button>
            </CardHeader>
            <AccordionContent>
              <CardContent className="space-y-4 pt-2">
                {taskSubmissions.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No task submissions. Click "Add Submission" to create one.
                  </p>
                ) : (
                  taskSubmissions.map((sub, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-md space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">Submission {index + 1}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeTaskSubmission(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Task
                          </label>
                          <Select
                            value={sub.taskId}
                            onChange={(e) => updateTaskSubmission(index, 'taskId', e.target.value)}
                            options={tasks.map(t => ({ value: t.id, label: `${t.title} (${t.points} pts)` }))}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <Select
                            value={sub.status}
                            onChange={(e) => updateTaskSubmission(index, 'status', e.target.value)}
                            options={[
                              { value: 'pending', label: 'Pending' },
                              { value: 'approved', label: 'Approved' },
                              { value: 'rejected', label: 'Rejected' }
                            ]}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Proof URL
                        </label>
                        <Input
                          value={sub.proofUrl}
                          onChange={(e) => updateTaskSubmission(index, 'proofUrl', e.target.value)}
                          placeholder="https://example.com/proof.jpg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Proof Text
                        </label>
                        <Input
                          value={sub.proofText}
                          onChange={(e) => updateTaskSubmission(index, 'proofText', e.target.value)}
                          placeholder="Proof description"
                        />
                      </div>
                      {sub.status === 'rejected' && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Rejection Reason
                          </label>
                          <Input
                            value={sub.rejectionReason}
                            onChange={(e) => updateTaskSubmission(index, 'rejectionReason', e.target.value)}
                            placeholder="Reason for rejection"
                          />
                        </div>
                      )}
                    </div>
                  ))
                )}
                {taskSubmissions.length > 0 && (
                  <div className="pt-2">
                    <Checkbox
                      checked={generateCertificates}
                      onChange={(e) => setGenerateCertificates(e.target.checked)}
                      label="Auto-generate certificates for approved submissions"
                    />
                  </div>
                )}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Redemption Requests */}
        <AccordionItem value="redemptions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <AccordionTrigger className="hover:no-underline flex-1">
                <CardTitle className="text-lg">Redemption Requests</CardTitle>
              </AccordionTrigger>
              <Button 
                onClick={addRedemptionRequest} 
                size="sm"
                className="ml-2"
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add Request</span>
              </Button>
            </CardHeader>
            <AccordionContent>
              <CardContent className="space-y-4 pt-2">
                {redemptionRequests.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No redemption requests. Click "Add Request" to create one.
                  </p>
                ) : (
                  redemptionRequests.map((req, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-md space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">Request {index + 1}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeRedemptionRequest(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Points Requested
                          </label>
                          <Input
                            type="number"
                            value={req.pointsRequested}
                            onChange={(e) => updateRedemptionRequest(index, 'pointsRequested', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <Select
                            value={req.status}
                            onChange={(e) => updateRedemptionRequest(index, 'status', e.target.value)}
                            options={[
                              { value: 'pending', label: 'Pending' },
                              { value: 'approved', label: 'Approved' },
                              { value: 'rejected', label: 'Rejected' }
                            ]}
                          />
                        </div>
                      </div>
                      {req.status !== 'pending' && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Admin Notes
                          </label>
                          <Input
                            value={req.adminNotes}
                            onChange={(e) => updateRedemptionRequest(index, 'adminNotes', e.target.value)}
                            placeholder="Notes about this request"
                          />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Payouts */}
        <AccordionItem value="payouts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <AccordionTrigger className="hover:no-underline flex-1">
                <CardTitle className="text-lg">Payouts</CardTitle>
              </AccordionTrigger>
              <Button 
                onClick={addPayout} 
                size="sm"
                className="ml-2"
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add Payout</span>
              </Button>
            </CardHeader>
            <AccordionContent>
              <CardContent className="space-y-4 pt-2">
                {payouts.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No payouts. Click "Add Payout" to create one.
                  </p>
                ) : (
                  payouts.map((payout, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-md space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">Payout {index + 1}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removePayout(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Amount ($)
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={payout.amount}
                            onChange={(e) => updatePayout(index, 'amount', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Points Redeemed
                          </label>
                          <Input
                            type="number"
                            value={payout.pointsRedeemed}
                            onChange={(e) => updatePayout(index, 'pointsRedeemed', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <Select
                            value={payout.status}
                            onChange={(e) => updatePayout(index, 'status', e.target.value)}
                            options={[
                              { value: 'pending', label: 'Pending' },
                              { value: 'processing', label: 'Processing' },
                              { value: 'completed', label: 'Completed' },
                              { value: 'failed', label: 'Failed' }
                            ]}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Payment Method
                          </label>
                          <Select
                            value={payout.paymentMethod}
                            onChange={(e) => updatePayout(index, 'paymentMethod', e.target.value)}
                            options={[
                              { value: 'bank_transfer', label: 'Bank Transfer' },
                              { value: 'paypal', label: 'PayPal' },
                              { value: 'check', label: 'Check' },
                              { value: 'other', label: 'Other' }
                            ]}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Transaction Reference
                          </label>
                          <Input
                            value={payout.transactionReference}
                            onChange={(e) => updatePayout(index, 'transactionReference', e.target.value)}
                            placeholder="TXN123456"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Admin Notes
                        </label>
                        <Input
                          value={payout.adminNotes}
                          onChange={(e) => updatePayout(index, 'adminNotes', e.target.value)}
                          placeholder="Notes about this payout"
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Referrals */}
        <AccordionItem value="referrals">
          <Card>
            <CardHeader>
              <AccordionTrigger className="hover:no-underline">
                <CardTitle className="text-lg">Users Referred by This Student</CardTitle>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent className="pt-2">
                {users.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No existing users to select as referrals.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {users.map(user => (
                      <Checkbox
                        key={user.id}
                        checked={referredUsers.includes(user.id)}
                        onChange={() => toggleReferredUser(user.id)}
                        label={`${user.name} (${user.email}) - ${user.referral_code}`}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>

      {/* Submit */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => router.push('/admin/students')}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? 'Creating...' : 'Create Demo Student'}
        </Button>
      </div>
    </div>
  )
}

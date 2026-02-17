'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Search, TestTube, UserCog, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { MobileCard } from '@/components/ui/mobile-card'
import { TableSkeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/toast'

interface User {
  id: string
  email: string
  name: string
  phone: string | null
  total_points: number
  available_points: number
  referral_code: string
  referred_by: string | null
  created_at: string
}

export default function StudentsPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    referralCode: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.referral_code.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchQuery, users])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.users)
        setFilteredUsers(data.users)
      } else {
        addToast({
          type: 'error',
          title: 'Failed to fetch students',
          description: data.error || 'Please try again',
        })
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      addToast({
        type: 'error',
        title: 'Failed to fetch students',
        description: 'An unexpected error occurred',
      })
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
    return code
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format'
    }

    if (!formData.name) {
      errors.name = 'Name is required'
    }

    if (!formData.referralCode) {
      errors.referralCode = 'Referral code is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateUser = async () => {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        await fetchUsers()
        setIsCreateDialogOpen(false)
        resetForm()
        addToast({
          type: 'success',
          title: 'Student created successfully',
          description: `${formData.name} has been added`,
        })
      } else {
        setFormErrors({ submit: data.error || 'Failed to create user' })
      }
    } catch (error) {
      setFormErrors({ submit: 'Failed to create user' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone: formData.phone || null,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        await fetchUsers()
        setIsEditDialogOpen(false)
        setSelectedUser(null)
        resetForm()
        addToast({
          type: 'success',
          title: 'Student updated successfully',
          description: `${formData.name}'s information has been updated`,
        })
      } else {
        setFormErrors({ submit: data.error || 'Failed to update user' })
      }
    } catch (error) {
      setFormErrors({ submit: 'Failed to update user' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok && data.success) {
        await fetchUsers()
        setIsDeleteDialogOpen(false)
        const deletedUserName = selectedUser.name
        setSelectedUser(null)
        addToast({
          type: 'success',
          title: 'Student deleted',
          description: `${deletedUserName} has been removed`,
        })
      } else {
        addToast({
          type: 'error',
          title: 'Failed to delete student',
          description: data.error || 'Please try again',
        })
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to delete student',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      phone: '',
      referralCode: '',
    })
    setFormErrors({})
  }

  const openCreateDialog = () => {
    resetForm()
    setFormData((prev) => ({ ...prev, referralCode: generateReferralCode() }))
    setIsCreateDialogOpen(true)
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setFormData({
      email: user.email,
      name: user.name,
      phone: user.phone || '',
      referralCode: user.referral_code,
    })
    setFormErrors({})
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Students Management</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Add, edit, and manage student accounts</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <CardTitle>All Students</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin/students/create-demo')}
                  className="flex-1 sm:flex-none"
                >
                  <TestTube className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Create Demo Student</span>
                  <span className="sm:hidden">Demo</span>
                </Button>
                <Button onClick={openCreateDialog} className="flex-1 sm:flex-none">
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Add Student</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              icon={UserCog}
              title={searchQuery ? 'No students found' : 'No students yet'}
              description={
                searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'Get started by adding your first student'
              }
              action={
                searchQuery
                  ? undefined
                  : {
                      label: 'Add Student',
                      onClick: openCreateDialog,
                      icon: Plus,
                    }
              }
            />
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Referral Code</TableHead>
                      <TableHead className="text-right">Total Points</TableHead>
                      <TableHead className="text-right">Available Points</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone || '-'}</TableCell>
                        <TableCell>
                          <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                            {user.referral_code}
                          </code>
                        </TableCell>
                        <TableCell className="text-right">{user.total_points}</TableCell>
                        <TableCell className="text-right">{user.available_points}</TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <MoreVertical className="h-5 w-5 text-slate-600" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                <Pencil className="h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openDeleteDialog(user)} destructive>
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {filteredUsers.map((user) => (
                  <MobileCard
                    key={user.id}
                    title={user.name}
                    subtitle={user.email}
                    metadata={[
                      { label: 'Phone', value: user.phone || 'N/A' },
                      { label: 'Referral Code', value: user.referral_code },
                      { label: 'Total Points', value: user.total_points.toString() },
                      { label: 'Available', value: user.available_points.toString() },
                      { label: 'Joined', value: formatDate(user.created_at) },
                    ]}
                    actions={[
                      {
                        label: 'Edit',
                        icon: Pencil,
                        onClick: () => openEditDialog(user),
                      },
                      {
                        label: 'Delete',
                        icon: Trash2,
                        onClick: () => openDeleteDialog(user),
                        variant: 'destructive',
                      },
                    ]}
                  />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add New Student</DialogTitle>
            <DialogDescription className="text-base">
              Create a new student account with unique referral code
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5 px-6 py-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter student name"
              />
              {formErrors.name && (
                <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-600"></span>
                  {formErrors.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@example.com"
              />
              {formErrors.email && (
                <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-600"></span>
                  {formErrors.email}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Referral Code <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  value={formData.referralCode}
                  onChange={(e) =>
                    setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })
                  }
                  placeholder="REFCODE123"
                  className="font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData({ ...formData, referralCode: generateReferralCode() })
                  }
                  className="shrink-0"
                >
                  Generate
                </Button>
              </div>
              {formErrors.referralCode && (
                <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-600"></span>
                  {formErrors.referralCode}
                </p>
              )}
            </div>
            {formErrors.submit && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">{formErrors.submit}</p>
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false)
                resetForm()
              }}
              disabled={isSubmitting}
              className="min-w-24"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateUser} 
              disabled={isSubmitting}
              className="min-w-32 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? 'Creating...' : 'Create Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Student</DialogTitle>
            <DialogDescription className="text-base">
              Update student information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5 px-6 py-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter student name"
              />
              {formErrors.name && (
                <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-600"></span>
                  {formErrors.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@example.com"
              />
              {formErrors.email && (
                <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-600"></span>
                  {formErrors.email}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1234567890"
              />
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Referral Code
              </label>
              <Input
                value={formData.referralCode}
                disabled
                className="bg-white font-mono"
              />
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Referral code cannot be changed
              </p>
            </div>
            {formErrors.submit && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">{formErrors.submit}</p>
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setSelectedUser(null)
                resetForm()
              }}
              disabled={isSubmitting}
              className="min-w-24"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateUser} 
              disabled={isSubmitting}
              className="min-w-32 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? 'Updating...' : 'Update Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Delete Student</DialogTitle>
            <DialogDescription className="text-base">
              This action cannot be undone
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4 px-6 py-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold text-lg">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 text-lg">{selectedUser.name}</h3>
                    <p className="text-sm text-slate-600 mt-0.5">{selectedUser.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-amber-900">Warning</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      All associated data (submissions, referrals, certificates, etc.) will also be permanently deleted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setSelectedUser(null)
              }}
              disabled={isSubmitting}
              className="min-w-24"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteUser}
              disabled={isSubmitting}
              className="min-w-32 bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? 'Deleting...' : 'Delete Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

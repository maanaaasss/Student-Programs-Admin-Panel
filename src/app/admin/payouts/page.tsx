'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDateTime, formatCurrency } from '@/lib/utils'
import { DollarSign, Save, X, Edit, MoreVertical } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { MobileCard } from '@/components/ui/mobile-card'
import { TableSkeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/toast'
import type { Payout } from '@/types'

export default function PayoutsPage() {
  const { addToast } = useToast()
  const [payouts, setPayouts] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'failed'>('all')
  const [editingPayout, setEditingPayout] = useState<string | null>(null)
  const [transactionRef, setTransactionRef] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayouts()
  }, [filter])

  const fetchPayouts = async () => {
    try {
      setLoading(true)
      const query = filter !== 'all' ? `?status=${filter}` : ''
      const response = await fetch(`/api/admin/payouts${query}`)
      const data = await response.json()
      if (data.success) {
        setPayouts(data.payouts)
      } else {
        addToast({
          type: 'error',
          title: 'Failed to fetch payouts',
          description: data.error || 'Please try again',
        })
      }
    } catch (error) {
      console.error('Failed to fetch payouts:', error)
      addToast({
        type: 'error',
        title: 'Failed to fetch payouts',
        description: 'An unexpected error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePayout = async (payoutId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/payouts/${payoutId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction_reference: transactionRef,
          status,
          admin_notes: `Payment ${status}`,
        }),
      })

      const data = await response.json()
      if (data.success) {
        addToast({
          type: 'success',
          title: `Payout ${status}`,
          description: `The payout has been marked as ${status}`,
        })
        fetchPayouts()
        setEditingPayout(null)
        setTransactionRef('')
      } else {
        addToast({
          type: 'error',
          title: 'Failed to update payout',
          description: data.error || 'Please try again',
        })
      }
    } catch (error) {
      console.error('Failed to update payout:', error)
      addToast({
        type: 'error',
        title: 'Failed to update payout',
        description: 'An unexpected error occurred',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payouts</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Track and manage student payouts</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'pending', 'processing', 'completed', 'failed'] as const).map((status) => (
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
          <CardTitle>Payouts ({payouts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton rows={5} />
          ) : payouts.length === 0 ? (
            <EmptyState
              icon={DollarSign}
              title={filter === 'all' ? 'No payouts yet' : `No ${filter} payouts`}
              description={
                filter === 'all'
                  ? 'Payouts will appear here when redemption requests are approved'
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
                      <TableHead>Amount</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Transaction Ref</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payout.user?.name}</p>
                            <p className="text-xs text-gray-500">{payout.user?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {formatCurrency(payout.amount)}
                        </TableCell>
                        <TableCell>{payout.points_redeemed}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {payout.payment_method}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {editingPayout === payout.id ? (
                            <Input
                              value={transactionRef}
                              onChange={(e) => setTransactionRef(e.target.value)}
                              placeholder="Enter transaction ref"
                              className="w-40"
                            />
                          ) : (
                            <span className="text-sm">
                              {payout.transaction_reference || 'N/A'}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              payout.status === 'completed'
                                ? 'completed'
                                : payout.status === 'failed'
                                ? 'rejected'
                                : payout.status === 'processing'
                                ? 'processing'
                                : 'pending'
                            }
                          >
                            {payout.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {editingPayout === payout.id ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleUpdatePayout(payout.id, 'completed')}
                                title="Save"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingPayout(null)
                                  setTransactionRef('')
                                }}
                                title="Cancel"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : payout.status !== 'completed' ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <MoreVertical className="h-5 w-5 text-slate-600" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingPayout(payout.id)
                                    setTransactionRef(payout.transaction_reference || '')
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                  Update
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {payouts.map((payout) => (
                  <MobileCard
                    key={payout.id}
                    title={payout.user?.name || 'Unknown'}
                    subtitle={payout.user?.email || 'No email'}
                    metadata={[
                      { label: 'Amount', value: formatCurrency(payout.amount) },
                      { label: 'Points', value: payout.points_redeemed.toString() },
                      { label: 'Method', value: payout.payment_method },
                      { 
                        label: 'Transaction Ref', 
                        value: editingPayout === payout.id 
                          ? 'Editing...' 
                          : (payout.transaction_reference || 'N/A')
                      },
                    ]}
                    badges={[
                      {
                        label: payout.status,
                        variant: payout.status === 'completed'
                          ? 'completed'
                          : payout.status === 'failed'
                          ? 'rejected'
                          : payout.status === 'processing'
                          ? 'processing'
                          : 'pending',
                      },
                    ]}
                    actions={
                      editingPayout === payout.id
                        ? [
                            {
                              label: 'Save',
                              icon: Save,
                              onClick: () => handleUpdatePayout(payout.id, 'completed'),
                            },
                            {
                              label: 'Cancel',
                              icon: X,
                              onClick: () => {
                                setEditingPayout(null)
                                setTransactionRef('')
                              },
                              variant: 'outline' as const,
                            },
                          ]
                        : payout.status === 'completed'
                        ? []
                        : [
                            {
                              label: 'Update',
                              icon: Edit,
                              onClick: () => {
                                setEditingPayout(payout.id)
                                setTransactionRef(payout.transaction_reference || '')
                              },
                            },
                          ]
                    }
                  />
                ))}
              </div>

              {/* Transaction Ref Input for Mobile (when editing) */}
              {editingPayout && (
                <div className="block md:hidden mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Reference
                  </label>
                  <Input
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="Enter transaction reference"
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDateTime, formatCurrency } from '@/lib/utils'
import type { Payout } from '@/types'

export default function PayoutsPage() {
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
      const query = filter !== 'all' ? `?status=${filter}` : ''
      const response = await fetch(`/api/admin/payouts${query}`)
      const data = await response.json()
      if (data.success) {
        setPayouts(data.payouts)
      }
    } catch (error) {
      console.error('Failed to fetch payouts:', error)
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
        alert(`Payout marked as ${status}!`)
        fetchPayouts()
        setEditingPayout(null)
        setTransactionRef('')
      }
    } catch (error) {
      console.error('Failed to update payout:', error)
      alert('Failed to update payout')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payouts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payouts</h1>
        <p className="text-gray-600 mt-1">Track and manage student payouts</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'processing', 'completed', 'failed'] as const).map((status) => (
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
          <CardTitle>Payouts ({payouts.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <TableCell className="font-semibold">{formatCurrency(payout.amount)}</TableCell>
                  <TableCell>{payout.points_redeemed}</TableCell>
                  <TableCell>{payout.payment_method}</TableCell>
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
                          ? 'success'
                          : payout.status === 'failed'
                          ? 'destructive'
                          : payout.status === 'processing'
                          ? 'warning'
                          : 'secondary'
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
                          onClick={() => handleUpdatePayout(payout.id, 'completed')}
                        >
                          Save & Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingPayout(null)
                            setTransactionRef('')
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingPayout(payout.id)
                          setTransactionRef(payout.transaction_reference || '')
                        }}
                        disabled={payout.status === 'completed'}
                      >
                        Update
                      </Button>
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

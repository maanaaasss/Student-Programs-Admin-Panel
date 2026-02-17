'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, GitBranch, CheckSquare, DollarSign, Award, Wallet, FileCheck, ShoppingCart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'
import { StatCardSkeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([])
  const [recentRedeems, setRecentRedeems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats
      const statsResponse = await fetch('/api/admin/dashboard/stats')
      const statsData = await statsResponse.json()
      if (statsData.success) {
        setStats(statsData.stats)
      }

      // Fetch recent submissions
      const submissionsResponse = await fetch('/api/admin/submissions')
      const submissionsData = await submissionsResponse.json()
      if (submissionsData.success) {
        setRecentSubmissions(submissionsData.submissions.slice(0, 5))
      }

      // Fetch pending redemptions
      const redeemsResponse = await fetch('/api/admin/redeem-requests?status=pending')
      const redeemsData = await redeemsResponse.json()
      if (redeemsData.success) {
        setRecentRedeems(redeemsData.requests.slice(0, 3))
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Welcome to the Student Programs Admin Panel</p>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Recent Activity Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Submissions Skeleton */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="h-6 w-48 bg-slate-200 rounded-md mb-4 animate-pulse" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2 pb-3 border-b border-slate-100 last:border-0">
                  <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Pending Redemptions Skeleton */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="h-6 w-48 bg-slate-200 rounded-md mb-4 animate-pulse" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2 pb-3 border-b border-slate-100 last:border-0">
                  <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Referrals',
      value: stats?.totalReferrals || 0,
      icon: GitBranch,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Validations',
      value: stats?.pendingValidations || 0,
      icon: CheckSquare,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Pending Redemptions',
      value: stats?.pendingRedemptions || 0,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Points Awarded',
      value: stats?.totalPointsAwarded || 0,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Completed Payouts',
      value: stats?.completedPayouts || 0,
      icon: Wallet,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Welcome to the Student Programs Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm sm:text-base font-medium text-gray-700">
                  {stat.title}
                </CardTitle>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Task Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSubmissions.length === 0 ? (
                <EmptyState
                  icon={FileCheck}
                  title="No submissions yet"
                  description="Task submissions will appear here"
                />
              ) : (
                recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-base text-gray-900">{submission.user?.name}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{submission.task?.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateTime(submission.created_at)}
                      </p>
                    </div>
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
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Redemptions */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Redemptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRedeems.length === 0 ? (
                <EmptyState
                  icon={ShoppingCart}
                  title="No pending redemptions"
                  description="Redemption requests will appear here"
                />
              ) : (
                recentRedeems.map((redeem) => (
                  <div
                    key={redeem.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-base text-gray-900">{redeem.user?.name}</p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {redeem.points_requested} points
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateTime(redeem.created_at)}
                      </p>
                    </div>
                    <Badge variant="pending">Pending</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, GitBranch, CheckSquare, DollarSign, Award, Wallet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to the Student Programs Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Task Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{submission.user?.name}</p>
                    <p className="text-xs text-gray-600">{submission.task?.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDateTime(submission.created_at)}
                    </p>
                  </div>
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
                </div>
              ))}
              {recentSubmissions.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent submissions
                </p>
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
              {recentRedeems.map((redeem) => (
                <div
                  key={redeem.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{redeem.user?.name}</p>
                    <p className="text-xs text-gray-600">
                      {redeem.points_requested} points
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDateTime(redeem.created_at)}
                    </p>
                  </div>
                  <Badge variant="warning">Pending</Badge>
                </div>
              ))}
              {recentRedeems.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No pending redemptions
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

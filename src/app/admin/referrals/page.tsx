'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, GitBranch } from 'lucide-react'

export default function ReferralsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [referralInfo, setReferralInfo] = useState<any>(null)
  const [searching, setSearching] = useState(false)

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      const response = await fetch(`/api/admin/users/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      if (data.success) {
        setSearchResults(data.users)
      }
    } catch (error) {
      console.error('Failed to search users:', error)
    } finally {
      setSearching(false)
    }
  }

  const handleSelectUser = async (user: any) => {
    setSelectedUser(user)
    setSearchQuery('')
    setSearchResults([])

    try {
      const response = await fetch(`/api/admin/users/${user.id}/referrals`)
      const data = await response.json()
      if (data.success) {
        setReferralInfo(data)
      }
    } catch (error) {
      console.error('Failed to fetch referral info:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Referral Tracking</h1>
        <p className="text-gray-600 mt-1">Search users and view their referral information</p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 border rounded-lg divide-y max-h-60 overflow-auto">
              {searchResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="w-full p-3 hover:bg-gray-50 text-left transition-colors"
                >
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Referral Information */}
      {referralInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{referralInfo.user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{referralInfo.user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="font-medium">{referralInfo.user?.total_points}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Points</p>
                <p className="font-medium">{referralInfo.user?.available_points}</p>
              </div>
            </CardContent>
          </Card>

          {/* Referral Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Referral Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Referrals</p>
                <p className="text-3xl font-bold text-blue-600">{referralInfo.totalReferrals}</p>
              </div>

              {referralInfo.referredBy && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Referred By</p>
                  <div className="p-3 border rounded-lg bg-green-50">
                    <p className="font-medium">{referralInfo.referredBy.name}</p>
                    <p className="text-sm text-gray-600">{referralInfo.referredBy.email}</p>
                  </div>
                </div>
              )}

              {referralInfo.referredUsers && referralInfo.referredUsers.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Users Referred</p>
                  <div className="space-y-2 max-h-60 overflow-auto">
                    {referralInfo.referredUsers.map((user: any) => (
                      <div key={user.id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {!selectedUser && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Search for a user to view their referral information</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

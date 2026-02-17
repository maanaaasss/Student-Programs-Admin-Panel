'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getAdmin, clearAdmin } from '@/lib/auth'
import { LayoutDashboard, CheckSquare, Award, DollarSign, CreditCard, Users, UserCog, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Admin } from '@/types'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Students', href: '/admin/students', icon: UserCog },
  { name: 'Task Validation', href: '/admin/submissions', icon: CheckSquare },
  { name: 'Certificates', href: '/admin/certificates', icon: Award },
  { name: 'Redemptions', href: '/admin/redemptions', icon: DollarSign },
  { name: 'Payouts', href: '/admin/payouts', icon: CreditCard },
  { name: 'Referrals', href: '/admin/referrals', icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentAdmin = getAdmin()
    if (!currentAdmin && pathname !== '/admin/login') {
      router.push('/admin/login')
    } else {
      setAdmin(currentAdmin)
    }
    setIsLoading(false)
  }, [pathname, router])

  const handleLogout = () => {
    clearAdmin()
    router.push('/admin/login')
  }

  if (pathname === '/admin/login') {
    return children
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-sm text-gray-600 mt-1">Student Programs</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="mb-3 px-4">
            <p className="text-sm font-medium text-gray-900">{admin.name}</p>
            <p className="text-xs text-gray-500">{admin.email}</p>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

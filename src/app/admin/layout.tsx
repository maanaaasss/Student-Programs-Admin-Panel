'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getAdmin, clearAdmin } from '@/lib/auth'
import { LayoutDashboard, CheckSquare, Award, DollarSign, CreditCard, Users, UserCog, LogOut, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToastProvider } from '@/components/ui/toast'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const currentAdmin = getAdmin()
    if (!currentAdmin && pathname !== '/admin/login') {
      router.push('/admin/login')
    } else {
      setAdmin(currentAdmin)
    }
    setIsLoading(false)
  }, [pathname, router])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleLogout = () => {
    clearAdmin()
    router.push('/admin/login')
  }

  if (pathname === '/admin/login') {
    return <ToastProvider>{children}</ToastProvider>
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
    <ToastProvider>
      <div className="flex h-screen bg-slate-50">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center px-4 z-30">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-md hover:bg-slate-100 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-4">
            <h1 className="text-lg font-semibold text-slate-900">
              Admin Panel
            </h1>
          </div>
        </div>

        {/* Mobile Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-64 bg-white border-r border-slate-200 flex flex-col
            transform transition-transform duration-200 ease-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Admin Panel
              </h1>
              <p className="text-sm text-slate-600 mt-1">Student Programs</p>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {item.name}
                </button>
              )
            })}
          </nav>

          {/* Admin Info & Logout */}
          <div className="p-4 border-t border-slate-200">
            <div className="mb-3 px-4">
              <p className="text-sm font-medium text-slate-900">{admin.name}</p>
              <p className="text-xs text-slate-500 truncate">{admin.email}</p>
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
        <div className="flex-1 overflow-auto pt-16 lg:pt-0">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </ToastProvider>
  )
}


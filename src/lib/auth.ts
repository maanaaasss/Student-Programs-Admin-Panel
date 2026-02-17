import type { Admin } from '@/types'

export function getAdmin(): Admin | null {
  if (typeof window === 'undefined') return null
  
  const adminStr = localStorage.getItem('admin')
  if (!adminStr) return null
  
  try {
    return JSON.parse(adminStr) as Admin
  } catch {
    return null
  }
}

export function setAdmin(admin: Admin): void {
  localStorage.setItem('admin', JSON.stringify(admin))
}

export function clearAdmin(): void {
  localStorage.removeItem('admin')
}

export function isAuthenticated(): boolean {
  return getAdmin() !== null
}

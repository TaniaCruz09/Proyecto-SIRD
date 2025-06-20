'use client'

import NavbarAdmin from '@/components/navbarAdmin'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <div className="w-1/4">
      <NavbarAdmin/>
      </div>
      <div className="w-3/4 p-6 bg-gray-100">

      </div>
    </div>
  )
}

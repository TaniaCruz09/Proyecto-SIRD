// app/admin/layout.tsx
'use client'

import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold text-blue-600 mb-6">Panel Admin</h2>
        <nav className="space-y-2">
          <Link href="/admin/usuarios" className="block px-2 py-1 rounded hover:bg-blue-100">
            Usuarios
          </Link>
          <Link href="/admin/roles" className="block px-2 py-1 rounded hover:bg-blue-100">
            Roles
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}

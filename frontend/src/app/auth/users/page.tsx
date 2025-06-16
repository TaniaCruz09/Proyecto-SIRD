'use client'

import { useEffect, useState } from 'react'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [nuevoUsuario, setNuevoUsuario] = useState({ name: '', email: '', password: '' })

  useEffect(() => {
    fetchUsuarios()
    fetchRoles()
  }, [])

  const fetchUsuarios = async () => {
    const res = await fetch('http://localhost:5003/api/v1/users')
    const data = await res.json()
    setUsuarios(data)
  }

  const fetchRoles = async () => {
    const res = await fetch('http://localhost:5003/api/v1/roles')
    const data = await res.json()
    setRoles(data)
  }

  const crearUsuario = async () => {
    const res = await fetch('http://localhost:5003/api/v1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoUsuario),
    })

    if (res.ok) {
      setNuevoUsuario({ name: '', email: '', password: '' })
      fetchUsuarios()
    } else {
      alert('Error al crear usuario')
    }
  }

  const eliminarUsuario = async (id: string) => {
    if (!confirm('¿Eliminar este usuario?')) return
    const res = await fetch(`http://localhost:5003/api/v1/users/${id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      fetchUsuarios()
    } else {
      alert('No se pudo eliminar')
    }
  }

  // const asignarRol = async (userId: string, roleId: string) => {
  //   const res = await fetch('http://localhost:5003/api/v1/asignar-roles', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ userId, roleId }),
  //   })

  //   if (res.ok) {
  //     alert('Rol asignado')
  //     fetchUsuarios()
  //   } else {
  //     alert('Error al asignar rol')
  //   }
  // }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold text-lg mb-2">Nuevo Usuario</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input type="text" placeholder="Nombre" value={nuevoUsuario.name} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, name: e.target.value })} className="border p-2 rounded" />
          <input type="email" placeholder="Correo" value={nuevoUsuario.email} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })} className="border p-2 rounded" />
          <input type="password" placeholder="Contraseña" value={nuevoUsuario.password} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })} className="border p-2 rounded" />
        </div>
        <button onClick={crearUsuario} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Crear</button>
      </div>

      {/* <ul className="space-y-4">
        {usuarios.map((u: any) => (
          <li key={u.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <p><strong>Nombre:</strong> {u.name}</p>
                <p><strong>Correo:</strong> {u.email}</p>
                <p><strong>Rol:</strong> {u.roles?.map((r: any) => r.name).join(', ') || 'Ninguno'}</p>
              </div>
              <div className="flex gap-2">
                <select onChange={(e) => asignarRol(u.id, e.target.value)} className="border rounded px-2 py-1">
                  <option value="">Asignar rol</option>
                  {roles.map((r: any) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <button onClick={() => eliminarUsuario(u.id)} className="text-red-600 hover:underline">Eliminar</button>
              </div>
            </div>
          </li>
        ))}
      </ul> */}
    </div>
  )
}
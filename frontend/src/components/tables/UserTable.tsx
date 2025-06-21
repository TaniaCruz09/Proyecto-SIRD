import React, { useState } from 'react'
import UserRow from './UserRow';

interface User {
  id: number;
  name: string;
  email: string;
  roles?: { rol: string }[];
}

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
const [currentPage, setCurrentPage] = useState(1);
const usersPerPage = 6; // o 10, depende del tamaño que quieras

const indexOfLastUser = currentPage * usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage;
const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);


  return (
        <div className="bg-white shadow-md max-h-[400px] overflow-x-auto">
          <table className="w-full text-left bg-white overflow-y-auto text-gray-800">
            <thead className="bg-gray-200 uppercase text-sm font-semibold sticky top-0 z-10">
              <tr>
                <th className="p-3 border-b border-gray-300">Nombre</th>
                <th className="p-3 border-b border-gray-300">Correo</th>
                <th className="p-3 border-b border-gray-300">Rol</th>
                <th className="p-1 border-b border-gray-300 text-center">Editar</th>
                <th className="p-1 border-b border-gray-300 text-center">Eliminar</th>
              </tr>
            </thead>
            <tbody className="text-black text-sm">
              {users.length > 0 ? (
                currentUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-3">No hay usuarios registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
  <p className="text-sm text-gray-600">
    Mostrando {indexOfFirstUser + 1} - {Math.min(indexOfLastUser, users.length)} de {users.length} usuarios
  </p>

  <div className="space-x-2">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
      className="px-2 py-1 bg-gray-400 rounded hover:bg-gray-500 disabled:opacity-50 text-gray-900"
    >
      Anterior
    </button>
    <button
      disabled={indexOfLastUser >= users.length}
      onClick={() => setCurrentPage(currentPage + 1)}
      className="px-2 py-1 bg-gray-400 rounded hover:bg-gray-500 disabled:opacity-50 text-gray-900"
    >
      Siguiente
    </button>
  </div>
</div>

        </div>
  )
}

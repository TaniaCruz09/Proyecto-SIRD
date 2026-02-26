"use client";
import React, { useState } from "react";
import UserRow from "./UserRow";
import { User } from "@/interfaces/authInterface";

interface UserTableProps {
  users: User[];
  onDelete: (id: number) => void;
  onSuccess?: () => void;
  fetchUsers: () => Promise<void>;
}

export default function UserTable({
  users,
  onDelete,
  onSuccess,
  fetchUsers,
}: UserTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7; // o 10, depende del tamaño que quieras

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="bg-white">
      <div className="bg-white shadow-lg h-[calc(100vh-230px)] overflow-y-auto">
        <table className="w-full space-y-2 text-left bg-white text-gray-800">
          <thead className="bg-gray-200 uppercase text-sm font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-3 border-b border-gray-300">Id</th>
              <th className="p-3 border-b border-gray-300">Nombre</th>
              <th className="p-3 border-b border-gray-300">Correo</th>
              <th className="p-3 border-b border-gray-300">Rol</th>
              <th className="p-1 border-b border-gray-300 text-center">Editar</th>
              <th className="p-1 border-b border-gray-300 text-center">
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody className="text-black text-sm">
            {users.length > 0 ? (
              currentUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onDelete={onDelete}
                  onSuccess={() => onSuccess}
                  fetchUsers={fetchUsers}
                />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-3">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 bg-white">
        <p className="text-sm text-gray-600">
          Mostrando {indexOfFirstUser + 1} -{" "}
          {Math.min(indexOfLastUser, users.length)} de {users.length} usuarios
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
  );
}

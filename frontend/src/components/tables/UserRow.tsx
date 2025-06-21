"use client"

import { FaEdit, FaUserEdit } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdEdit, MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line, RiEditBoxFill, RiEditFill } from "react-icons/ri";

interface User {
  id: number;
  name: string;
  email: string;
  roles?: { rol: string }[];
}

interface UserRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export default function UserRow({ user, onEdit, onDelete }: UserRowProps) {
  return (
        <tr className="hover:bg-gray-100">
            <td className="p-3 border-b border-gray-200">{user.name}</td>
            <td className="p-3 border-b border-gray-200 text-blue-700">{user.email}</td>
            <td className="p-3 border-b border-gray-200">
             {user.roles?.[0]?.rol || "Sin rol"}
            </td>
            <td className="p-3 px-2 py-2 border-b border-gray-200 text-center">
                <button
                onClick={() => onEdit(user)}
                className="bg-yellow-500/70 hover:bg-yellow-300 text-white px-5 py-2 rounded-md text-sm"
                >
                <FaEdit />
                </button> 
            </td>
            <td className="p-3 px-2 py-3 border-b border-gray-200 text-center">
                <button
                onClick={() => onDelete(user.id)}
                className="bg-red-600/70 hover:bg-red-400 text-white px-5 py-2 rounded-md text-sm"
                >
                <RiDeleteBin6Line />
                </button>
            </td>
        </tr>
    )
}

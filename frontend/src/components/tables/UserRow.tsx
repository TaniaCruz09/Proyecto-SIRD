"use client"

import { RiDeleteBin6Line } from "react-icons/ri";
import BtnOpenEditModal from "../Buttons/btnOpenEditModal";
import { useState } from "react";
import { User } from "@/interfaces/authInterface";
import ModalBase from "../modals/ModalBase";
import UserForm from "../forms/UserForm";

interface UserRowProps {
  user: User;
  onDelete: (id: number) => void;
  fetchUsers: () => Promise<void>;
  onSuccess: () => void;
}

export default function UserRow({ user, onDelete, fetchUsers, onSuccess }: UserRowProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
      <td className="p-3 border-b border-gray-200">{user.id}</td>
      <td className="p-3 border-b border-gray-200">{user.name}</td>
      <td className="p-3 border-b border-gray-200 text-blue-700">{user.email}</td>
      <td className="p-3 border-b border-gray-200">
        {user.roles && user.roles.length > 0
          ? user.roles.map(r => r.rol).join(", ")
          : "Sin rol"}
      </td>

      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center">
        <BtnOpenEditModal
          onClick={() => setShowModal(true)}
        />

        {showModal && (
          <ModalBase
            onshowModal={showModal}
            onCloseModal={() => setShowModal(false)}
            content={
              <UserForm
                defaultValues={user}
                onSuccess={() => {
                  fetchUsers();
                  setShowModal(false);
                  // onSuccess();s
                }}
              />
            }
          />
        )}
      </td>
      <td className="p-3 px-2 py-3 border-b border-gray-200 text-center">
        <button
          onClick={() => onDelete(user.id)}
          className="bg-red-300/30 hover:bg-red-400 text-red-600 text-bold px-4 py-2 rounded-md text-sm"
        >
          <RiDeleteBin6Line />
        </button>
      </td>
    </tr>
  )
}

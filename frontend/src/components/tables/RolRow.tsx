"use client";
import { RiDeleteBin6Line } from "react-icons/ri";
import BtnOpenEditModal from "../Buttons/btnOpenEditModal";
import ModalBase from "../modals/ModalBase";
import RoleForm from "../forms/RoleForm";
import { Role } from "@/interfaces/AuthInterface";
import { useState } from "react";

interface RolRowProps {
  rol: Role;
  onDelete: (id: number) => void;
  fetchRoles: () => Promise<void>;
  onSuccess: () => void;
}

export default function RolRow({
  rol,
  onDelete,
  fetchRoles,
  onSuccess,
}: RolRowProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <tr className="hover:bg-gray-100">
      <td className="p-3 border-b border-gray-200">{rol.id}</td>
      <td className="p-3 border-b border-gray-200">{rol.rol}</td>
      <td className="p-3 border-b border-gray-200 ">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${rol.isActive ? "bg-green-500/30 text-green-600" : "text-red-600 bg-red-500/30"
          }`}>
          {rol.isActive ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center">
        <BtnOpenEditModal onClick={() => setShowModal(true)} />

        {showModal && (
          <ModalBase
            onshowModal={showModal}
            onCloseModal={() => setShowModal(false)}
            content={
              <RoleForm
                defaultValues={rol}
                onSuccess={() => {
                  fetchRoles();
                  setShowModal(false);
                  onSuccess();
                }}
              />
            }
          />
        )}
      </td>
      <td className="p-3 px-2 py-3 border-b border-gray-200 text-center">
        <button
          onClick={() => onDelete(rol.id)}
          className="bg-red-300/30 hover:bg-red-400 text-red-600 text-bold px-4 py-2 rounded-md text-sm"
        >
          <RiDeleteBin6Line />
        </button>
      </td>
    </tr>
  );
}

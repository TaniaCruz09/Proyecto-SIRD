"use client";

import { useEffect, useState } from "react";
import {
  deleteUser,
  getUser,
} from "@/actions/authMethods/usersMethods";

import BtnOpenAddModal from "@/components/Buttons/btnOpenAddModal";
import ConfirmDeletModal from "@/components/modals/modalConfirmDeletion";
import NavbarAdmin from "@/components/navbarAdmin";
import SearchBar from "@/components/SearchBar";
import UserTable from "@/components/tables/UserTable";
import ModalBase from "@/components/modals/ModalBase";
import UserForm from "@/components/forms/UserForm";

export default function Users() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await getUser();
      setUsuarios(res?.data || []);
    } catch (error) {
      console.error("Error al obtener usuarios", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (usuario: any) => {
    setEditUserId(usuario.id);
    setIsEdit(true);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete);
      fetchUsers();
    } catch (error) {
      console.error("Error al eliminar usuario", error);
    } finally {
      setShowConfirm(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteClick = (id: number) => {
    setUserToDelete(id);
    setShowConfirm(true);
  };

  // Filtro por búsqueda
  const filteredUsers = usuarios.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <div className="w-1/4">
        <NavbarAdmin />
      </div>
      <div className="w-3/4 p-6 bg-gray-100">
      <div className="flex items-center justify-between">
        <h1 className="ml-10 text-2xl font-bold c mb-4 tracking-tight text-gray-600 text-center">
          Usuarios
        </h1>
        <div className="flex justify-end mr-10 mb-6 mt-6">
          <BtnOpenAddModal
            text="Agregar Usuario"
            onClick={() => setShowModal(true)}
          />
      </div>
        </div>
        <div className="flex items-center justify-between bg-white border rounded-t-xl">
          <h2 className="pl-10 text-xl font-bold text-gray-600">
          Lista de usuarios
          </h2>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
            placeholder="Buscar por nombre o correo..."
          />
        </div>
        <UserTable
          users={filteredUsers}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        {showModal && (
          <ModalBase
            onCloseModal={() => {
              setShowModal(false);
              setIsEdit(false);
              setEditUserId(null);
            }}
          >
            <UserForm
              defaultValues={
                isEdit ? usuarios.find((u) => u.id === editUserId) : null
              }
              onSuccess={() => {
                fetchUsers();
                setShowModal(false);
                setIsEdit(false);
                setEditUserId(null);
              }}
            />
          </ModalBase>
        )}
        <ConfirmDeletModal
          visible={showConfirm}
          onCancel={() => setShowConfirm(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
}

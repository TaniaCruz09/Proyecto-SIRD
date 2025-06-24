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
import UserForm from "@/components/forms/UserForm";
import ModalBase from "@/components/modals/ModalBase";
import User from "@/interfaces/authInterface";

export default function Users() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  //obtener todos los usuarios
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

  const handleSuccess = () => {
  fetchUsers();
  setIsEdit(false);
  setShowModal(false);
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
      <div>
        <NavbarAdmin />
      </div>
      <div className="w-screen p-6 bg-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="ml-10 text-2xl font-bold c mb-4 tracking-tight text-gray-600 text-center">
            Usuarios
          </h1>
          <div className="flex justify-end mr-10 mb-6 mt-6">
            <BtnOpenAddModal
              text="Agregar Usuario"
              onClick={() => {
                setIsEdit(false);
                setShowModal(true);
              }}
            />
            {showModal && (
              <ModalBase
                onshowModal={showModal}
                onCloseModal={() => setShowModal(false)}
                content={
                  <UserForm
                    onSuccess={() => {
                      fetchUsers();
                      setShowModal(false);
                    }}
                  />
                }
              />
            )}
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
          onDelete={handleDeleteClick}
          onSuccess={handleSuccess}
          fetchUsers={fetchUsers}
        />
        <ConfirmDeletModal
          onshow={showConfirm}
          onCancel={() => setShowConfirm(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
}

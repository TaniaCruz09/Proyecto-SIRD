"use client"

import { deleteRoles, getRoles } from '@/actions/authMethods/rolesMethods'
import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import RoleForm from '@/components/forms/RoleForm'
import ModalBase from '@/components/modals/ModalBase'
import ConfirmDeletModal from '@/components/modals/ModalConfirmDeletion'
import SearchBar from '@/components/SearchBar'
import RolTable from '@/components/tables/RolTable'
import { useToast } from '@/hooks/use-toast'
import { Role } from '@/interfaces/authInterface'
import { useEffect, useState } from 'react'

export default function Roles() {
  const { toast } = useToast();
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>([])
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [rolToDelete, setRolToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);


  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res || []);
    } catch (error) {
      console.error("Error al obtener roles", error);
    }
  }

  useEffect(() => {
    fetchRoles();
  }, []);

  // Filtro por búsqueda
  const filteredRoles = roles.filter(
    (u) =>
      u.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (id: number) => {
    setRolToDelete(id);
    setShowConfirm(true);
  };

  const handleSuccess = () => {
    fetchRoles();
    setShowModal(false);
  };

  const confirmDelete = async () => {
    if (!rolToDelete) return;
    try {
      await deleteRoles(rolToDelete);
      fetchRoles();
      toast({
        title: "Rol eliminado",
        description: "El rol se elimino correctamente.",
        variant: "destructive",
      })
    } catch (error) {
      console.error("Error al eliminar usuario", error);
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar el rol.",
        variant: "destructive",
      })
    } finally {
      setShowConfirm(false);
      setRolToDelete(null);
    }
  };

  return (
    <div>
      <div className="p-6 flex item-center justify-between">
        <h1 className="ml-10 text-2xl font-bold c mb-4 tracking-tight text-gray-600 text-center">
          Roles
        </h1>
        <div className="flex justify-end mr-10 mb-5">
          <BtnOpenAddModal
            text="Agregar nuevo Rol"
            onClick={() => setShowModal(true)}
          />
          {showModal && (
            <ModalBase
              onshowModal={showModal}
              onCloseModal={() => setShowModal(false)}
              content={
                <RoleForm
                  defaultValues={roleToEdit}
                  onSuccess={() => {
                    fetchRoles();
                    setShowModal(false);
                    setRoleToEdit(null);
                  }}
                />
              }
            />
          )}
        </div>
      </ div>
      <div className="flex items-center justify-between bg-white border rounded-t-xl">
        <h2 className='pl-10 text-xl font-bold text-gray-600'>Lista de Roles</h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
          placeholder='Buscar rol'
        />
      </div>
      <RolTable
        roles={filteredRoles}
        onDelete={handleDeleteClick}
        onSuccess={handleSuccess}
        fetchRoles={fetchRoles}
      />
      <ConfirmDeletModal
        onshow={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

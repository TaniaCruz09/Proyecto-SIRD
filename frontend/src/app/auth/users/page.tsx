'use client';

import { assignRoleToUser, deleteUser, getUser, saveUser, updateUser } from "@/actions/authMethods/usersMethods";
import FormUserModal from "@/components/modals/FormUserModal";
import ConfirmDeletModal from "@/components/modals/modalConfirmDeletion";
import NavbarAdmin from "@/components/navbarAdmin";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function Users() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rol, setRol] = useState("")
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("")

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

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRol("");
    setIsEdit(false);
    setEditUserId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await saveUser({ name, email, password })
      const userId = data?.data?.id; // segun como responde el backen es asi

      if (userId && rol) {
      await assignRoleToUser(userId, [Number(rol)]);
      console.log("Rol asignado correctamente");
    }

      // Limpiar formulario
      resetForm
      setShowModal(false) // Cierra modal
    } catch (err) {
      console.error("Error al guardar el usuario", err)
    }
  }

  const handleEdit = (usuario: any) => {
  setName(usuario.name);
  setEmail(usuario.email);
  setRol(usuario.roles?.[0]?.id || ""); // si tiene rol
  setEditUserId(usuario.id);
  setIsEdit(true);
  setShowModal(true);
};

  const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (!editUserId) return;
    await updateUser(editUserId, { name, email, password }); // OJO: no mandes password si no deseas cambiarla

    if (rol) {
      await assignRoleToUser(editUserId, [Number(rol)]);
    }

    resetForm();
    // setIsEdit(false);
    setShowModal(false);
  } catch (error) {
    console.error("Error al actualizar el usuario", error);
  }
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
  const filteredUsers = usuarios.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <div className="w-1/4">
        <NavbarAdmin />
      </div>
      <div className="w-3/4 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Bienvenido la configuracion de usuarios</h1>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Agregar Usuario
          </button>
          <div className="relative w-full max-w-md flex items-center">
  <FaSearch className="absolute left-3 text-gray-400" />
  <input
    type="text"
    placeholder="Buscar por nombre o correo..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-10 py-3 border rounded-xl border-gray-300 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
  />
  {searchTerm && (
    <button
      onClick={() => setSearchTerm("")}
      className="absolute right-2 text-gray-500 hover:text-red-500 text-lg font-bold"
      title="Limpiar búsqueda"
    >
      ×
    </button>
  )}
</div>
        </div>

      {/*a partir de aca esta la tabla de usuarios sin embargo hay que hacerla en un componente aparte porque es mucho codigo ya */}
        <h2 className="text-xl font-bold mt-6 mb-2">Usuarios Registrados</h2>
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full text-left border border-gray-300 bg-white">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 border">Nombre</th>
                <th className="p-3 border">Correo</th>
                <th className="p-3 border">Rol</th>
                <th className="p-3 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-100">
                    <td className="p-3 border">{usuario.name}</td>
                    <td className="p-3 border">{usuario.email}</td>
                    <td className="p-3 border">
                      {usuario.roles?.[0]?.rol || "Sin rol"}
                    </td>
                    <td className="p-3 border flex gap-2">
                      <button
                        onClick={() => handleEdit(usuario)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                      >
                        Editar
                      </button> 
                      <button
                        onClick={() => handleDeleteClick(usuario.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Eliminar
                      </button>

                   
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center p-3">No hay usuarios registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      <ConfirmDeletModal
      visible={showConfirm}
      onCancel={()=> setShowConfirm(false)}
      onConfirm={confirmDelete}
      />
     <FormUserModal
     visible={showModal}
     onCloseModal={()=> setShowModal(false)}
     reset={resetForm}
     name={name}
     setName={setName}
     email={email}
     setEmail={setEmail}
     password={password}
     setPassword={setPassword}
     rol={rol}
     setRol={setRol}
     isEditMode={isEdit}
     update={handleUpdate}
     create={handleSubmit}
     />
      </div>
    </div>
  );
}

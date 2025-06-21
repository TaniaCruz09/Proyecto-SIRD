"use client";
import { useEffect, useState } from "react";
import {
  assignRoleToUser,
  getUser,
  saveUser,
  updateUser,
} from "@/actions/authMethods/usersMethods";
import { getRoles } from "@/actions/authMethods/rolesMethods";

interface UserFormProps {}

//mejorar el tipado con una interface
const UserForm = ({ defaultValues = null, onSuccess }: any) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const [roles, setRoles] = useState<{ id: number; rol: string }[]>();
  const [usuarios, setUsuarios] = useState<any[]>([]);

  const isEdit = Boolean(defaultValues?.id);

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
    onSuccess();
  };

  //funcion con la que enviamos los datos para agregar un nuevo usuario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //guardo el usuario
      const data = await saveUser({ name, email, password });
      const user = data?.user;
      const userId = user?.id;

      let newUserWithRoles = user;

      //asignamos usuarios al estado con rol
      if (userId && rol) {
        const updatedUser = await assignRoleToUser(userId, [Number(rol)]);
        newUserWithRoles = updatedUser;
      }

      // Agregamos usuario al estado (con rol)
      setUsuarios((prev) => [...prev, newUserWithRoles]);

      //limpiar el formulario
      resetForm();
      onSuccess(); // Cierra modal
    } catch (err) {
      console.error("Error al guardar el usuario", err);
    }
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error("Error al cargar los roles:", error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    if (defaultValues) {
      setName(defaultValues.name || "");
      setEmail(defaultValues.email || "");
      setRol(defaultValues.roles?.[0]?.id?.toString() || "");
    }
  }, [defaultValues]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {isEdit ? "Editar Usuario" : "Agregar Usuario"}
      </h2>

      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />
      <select
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        value={rol}
        onChange={(e) => setRol(e.target.value)}
      >
        <option value="">Selecciona un rol</option>
        {roles?.map((r) => (
          <option key={r.id} value={r.id}>
            {r.rol}
          </option>
        ))}
      </select>
      <div className="flex justify-center">
        <button
          type="submit"
          className="px-20 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
        >
          {isEdit ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;

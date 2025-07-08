"use client";
import { useEffect, useState } from "react";
import {
  assignRoleToUser,
  saveUser,
  updateUser,
} from "@/actions/authMethods/usersMethods";
import { getRoles } from "@/actions/authMethods/rolesMethods";
import User from "@/interfaces/AuthInterface";
import Role from "@/interfaces/AuthInterface";

interface UserFormProps {
  defaultValues?: User | null;
  onSuccess: () => void;
}

const UserForm = ({ defaultValues, onSuccess }: UserFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);

  const isEdit = Boolean(defaultValues?.id);

  // Prellenar campos si es edición
  useEffect(() => {
    if (defaultValues) {
      setName(defaultValues.name || "");
      setEmail(defaultValues.email || "");
      setPassword(""); // No mostrar contraseña cifrada
      setRol(defaultValues.roles?.[0]?.id?.toString() || ""); // O ajusta según tu estructura
    }
  }, [defaultValues]);

  //funcion con la que enviamos los datos para agregar un nuevo usuario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && defaultValues?.id) {
        // 🔁 Editar usuario
        const updatedUser = await updateUser(defaultValues.id, { name, email, password });
        
        if (rol) await assignRoleToUser(updatedUser.id, [Number(rol)]);
      } else {
        // ➕ Crear nuevo usuario
        const newUserRes = await saveUser({ name, email, password });
        const userId = newUserRes?.user?.id;

        if (userId && rol) {
          await assignRoleToUser(userId, [Number(rol)]);
        }
      }

      onSuccess();
    } catch (err) {
      console.error("Error al guardar/actualizar el usuario:", err);
    }
  };

    // Traer roles una vez
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

  // Si defaultValues cambia, actualiza los inputs
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

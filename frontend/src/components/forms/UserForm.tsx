"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import {
  assignRoleToUser,
  getUserById,
  saveUser,
  updateUser,
} from "@/actions/authMethods/usersMethods";
import { getRoles } from "@/actions/authMethods/rolesMethods";
import { User } from "@/interfaces/AuthInterface";
import { Docente } from "@/interfaces";
import { Role } from "@/interfaces/AuthInterface";
import { getDocentes } from "@/actions/docentesMethods/docentesMethods";

interface UserFormProps {
  defaultValues?: User | null;
  onSuccess: () => void;
}

interface OptionType {
  value: number;
  label: string;
}

const UserForm = ({ defaultValues, onSuccess }: UserFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rolesSelected, setRolesSelected] = useState<OptionType[]>([]);
  const [docente, setDocente] = useState<number | "">("");
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const isEdit = Boolean(defaultValues?.id);

  useEffect(() => {
    if (defaultValues) {
      setName(defaultValues.name || "");
      setEmail(defaultValues.email || "");
      setPassword("");

      // Preselecciona docente si existe
      setDocente(defaultValues.docente?.id || "");

      // Preselecciona roles si existen
      if (defaultValues.roles) {
        const mappedRoles = defaultValues.roles.map((r: Role) => ({
          value: r.id,
          label: r.rol,
        }));
        setRolesSelected(mappedRoles);
      }
    }
  }, [defaultValues]);

  // Asegura que el docente aparezca cuando ya se cargó la lista de docentes
  useEffect(() => {
    if (defaultValues?.docente?.id) {
      setDocente(defaultValues.docente.id);
    }
  }, [docentes, defaultValues]);

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

    const fetchDocentes = async () => {
      try {
        const docentesData = await getDocentes();
        setDocentes(docentesData);
      } catch (error) {
        console.error("Error al cargar los docentes:", error);
      }
    };
    fetchRoles();
    fetchDocentes();
  }, []);

  const availableRoles = roles.map((r) => ({ value: r.id, label: r.rol }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const DocenteTieneRol = rolesSelected.some((r) => r.label.toLocaleLowerCase() === 'docente');

    if(DocenteTieneRol && !docente){
      alert('debe seleccionar un docente existente o crear uno nuevo antes de asignarle el rol de docente')
      return;
    }
    try {
      const payload: any = {
        email,
        password: password || undefined,
        roles: rolesSelected.map((r) => r.value),
        docente: docente ? { id: Number(docente) } : undefined,
        name: name.trim() || undefined,
      };

      let userId: number | undefined;

      if (isEdit && defaultValues?.id) {
        const updatedUser = await updateUser(defaultValues.id, payload);
        userId = updatedUser.id;
      } else {
        const newUserRes = await saveUser(payload);
        userId = newUserRes?.user?.id;
      }

      if (userId && rolesSelected.length > 0) {
        await assignRoleToUser(userId, rolesSelected.map((r) => r.value));
      }

      if (userId) {
        await getUserById(userId);
      }

      onSuccess();
    } catch (err) {
      console.error("Error al guardar/actualizar el usuario:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {isEdit ? "Editar Usuario" : "Agregar Usuario"}
      </h2>

      {/* Selector de docente SOLO si corresponde */}
      {(!isEdit || defaultValues?.docente) && (
        <select
          className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
          value={docente}
          onChange={(e) => setDocente(e.target.value === "" ? "" : Number(e.target.value))}
        >
          <option value="">Selecciona un docente (opcional)</option>
          {docentes?.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombres} {d.apellido_materno && d.apellido_paterno}
            </option>
          ))}
        </select>
      )}

      {/* Campo de nombre solo si NO seleccionó docente */}
      {docente === "" && (
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        />
      )}

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
        required={!isEdit}
      />

      {/* Multi-select moderno para todos los roles */}
      <Select
        isMulti
        options={availableRoles}
        value={rolesSelected}
        onChange={(selected) => setRolesSelected(selected as OptionType[])}
        placeholder="Selecciona uno o más roles"
        className="text-black"
      />

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

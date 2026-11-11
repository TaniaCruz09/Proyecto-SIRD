"use client";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Select from "react-select";
import {
  assignRoleToUser,
  getUser,
  getUserById,
  saveUser,
  updateUser,
} from "@/actions/authMethods/usersMethods";
import { getRoles } from "@/actions/authMethods/rolesMethods";
import { Docente } from "@/interfaces";
import { getDocentes } from "@/actions/docentesMethods/docentesMethods";
import { useToast } from "@/hooks/use-toast";
import { Role, User } from "@/interfaces/authInterface";

interface UserFormProps {
  defaultValues?: User | null;
  onSuccess: () => void;
}

interface OptionType {
  value: number;
  label: string;
}

const UserForm = ({ defaultValues, onSuccess }: UserFormProps) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rolesSelected, setRolesSelected] = useState<OptionType[]>([]);
  const [docente, setDocente] = useState<number | "">("");
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast({
        title: "Docente requerido",
        description: "Debe seleccionar un docente existente o crear uno nuevo antes de asignarle el rol de docente.",
        variant: "destructive",
      })
      return;
    }
    
    if (password && password.length < 8) {
      toast({
        title: "Contrasena invalida",
        description: "La contrasena debe tener al menos 8 caracteres.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail) {
        const usersRes = await getUser();
        const usersList: User[] = Array.isArray(usersRes?.data)
          ? usersRes.data
          : Array.isArray(usersRes)
            ? usersRes
            : [];

        const duplicate = usersList.find(
          (u) =>
            u.email?.toLowerCase() === normalizedEmail &&
            (!isEdit || u.id !== defaultValues?.id)
        );

        if (duplicate) {
          toast({
            title: "Correo duplicado",
            description: "Este correo ya pertenece a otra persona.",
            variant: "destructive",
          });
          return;
        }
      }

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
        toast({
          title: "Usuario actualizado",
          description: "El usuario se actualizo correctamente.",
          variant: "success",
        })
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

      if (!isEdit) {
        toast({
          title: "Usuario agregado",
          description: "El usuario se agrego correctamente.",
          variant: "success",
        })
      }

      onSuccess();
    } catch (err) {
      console.error("Error al guardar/actualizar el usuario:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col min-h-[520px] py-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">
        {isEdit ? "Editar Usuario" : "Agregar Usuario"}
      </h2>

      <div className="flex flex-1 flex-col justify-evenly gap-6">
      {/* Selector de docente con búsqueda: visible al crear, al editar si ya tiene docente, o si se seleccionó el rol Docente */}
      {(!isEdit || defaultValues?.docente || rolesSelected.some((r) => r.label.toLocaleLowerCase() === 'docente')) && (
        <div>
          <label htmlFor="user-docente" className="block text-left text-sm font-medium text-gray-700 mb-1">
            Seleccionar Docente
          </label>
          <Select
            inputId="user-docente"
            isClearable
            placeholder="Buscar y seleccionar un docente..."
            noOptionsMessage={() => "No se encontraron docentes"}
            options={docentes?.map((d) => ({
              value: d.id,
              label: `${d.nombres} ${d.apellido_paterno || ''} ${d.apellido_materno || ''}`.trim(),
            }))}
            value={
              docente
                ? (() => {
                    const d = docentes.find((d) => d.id === docente);
                    return d
                      ? {
                          value: d.id,
                          label: `${d.nombres} ${d.apellido_paterno || ''} ${d.apellido_materno || ''}`.trim(),
                        }
                      : null;
                  })()
                : null
            }
            onChange={(selected) => setDocente(selected ? selected.value : "")}
            className="text-black"
            styles={{
              control: (base) => ({
                ...base,
                padding: "2px",
                borderRadius: "0.75rem",
                borderColor: "#d1d5db",
                boxShadow: "none",
                "&:hover": { borderColor: "#a5b4fc" },
              }),
            }}
          />
        </div>
      )}

      {/* Campo de nombre solo si NO seleccionó docente */}
      {docente === "" && (
        <div>
          <label htmlFor="user-name" className="block text-left text-sm font-medium text-gray-700 mb-1">
            Nombre de usuario
          </label>
          <input
            id="user-name"
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
            required
          />
        </div>
      )}

      <div>
        <label htmlFor="user-email" className="block text-left text-sm font-medium text-gray-700 mb-1">
          Correo
        </label>
        <input
          id="user-email"
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
          required
        />
      </div>

      <div>
        <label htmlFor="user-password" className="block text-left text-sm font-medium text-gray-700 mb-1">
          Contraseña{isEdit && <span className="font-normal text-gray-500"> (dejar vacío para no cambiarla)</span>}
        </label>
        <div className="relative">
          <input
            id="user-password"
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pr-12 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
            required={!isEdit}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
            aria-label={showPassword ? "Ocultar contrasena" : "Ver contrasena"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Multi-select moderno para todos los roles */}
      <div>
        <label htmlFor="user-roles" className="block text-left text-sm font-medium text-gray-700 mb-1">
          Roles
        </label>
        <Select
          inputId="user-roles"
          isMulti
          options={availableRoles}
          value={rolesSelected}
          onChange={(selected) => setRolesSelected(selected as OptionType[])}
          placeholder="Selecciona uno o más roles"
          className="text-black"
          required
        />
      </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-20 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              {isEdit ? "Actualizando..." : "Guardando..."}
            </>
          ) : (
            isEdit ? "Actualizar" : "Guardar"
          )}
        </button>
      </div>
    </form>
  );
};

export default UserForm;

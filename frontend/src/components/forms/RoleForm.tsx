"use client"
import { useState } from "react";
import { saveRole, updateRole } from "@/actions/authMethods/rolesMethods";

const RoleForm = ({ defaultValues = null, onSuccess }) => {
  const [name, setName] = useState(defaultValues?.name || "");

  const isEdit = Boolean(defaultValues?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await updateRole(defaultValues.id, { name });
    } else {
      await saveRole({ name });
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-black mb-2">
        {isEdit ? "Editar Rol" : "Agregar Rol"}
      </h2>

      <input
        type="text"
        placeholder="Nombre del rol"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
        required
      />

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          {isEdit ? "Guardar Cambios" : "Guardar Rol"}
        </button>
      </div>
    </form>
  );
};

export default RoleForm;

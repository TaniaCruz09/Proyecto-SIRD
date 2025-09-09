"use client";

import { useEffect, useState } from "react";
import { GrupoConAsignaturasResponse, GrupoConAsignaturasPayload } from "@/interfaces/organizacionEscolarInterface/gruposConAsignaturas";
import { Docente } from "@/interfaces";
import { actualizarGrupoConAsignatura, getGrupoConAsignaturaById } from "@/actions/organizacionEscolarMethods/GrupoEscolarMethods/grupoConAsignaturasMethos";

interface EditarMateriaFormProps {
  relacion: GrupoConAsignaturasResponse; // la relación actual (materia-docente)
  docentesDisponibles: Docente[];
  onClose: () => void; // cerrar modal
  onSave: (updated: GrupoConAsignaturasResponse) => void; // callback cuando se guarda
}

export default function EditarMateriaForm({
  relacion,
  docentesDisponibles,
  onClose,
  onSave,
}: EditarMateriaFormProps) {
  const [selectedDocente, setSelectedDocente] = useState<number>(relacion.docente.id);
  const [grupoConAsignaturas, setGrupoConAsignaturas] = useState<GrupoConAsignaturasResponse[]>([]);

  useEffect(() => {
  const fetchGrupoConAsignaturas = async () => {
    const data = await getGrupoConAsignaturaById(relacion.grupo.id);
    setGrupoConAsignaturas(data);
  };
  fetchGrupoConAsignaturas();
}, [relacion.grupo.id]);
 const handleGuardar = async () => {
  try {
    const payload: GrupoConAsignaturasPayload = {
      grupoId: relacion.grupo.id,
      asignaturasConDocentes: grupoConAsignaturas.map((r) => ({
        asignaturaId: r.asignatura.id,
        docenteId: r.id === relacion.id ? selectedDocente : r.docente.id,
      })),
    };

    const updated = await actualizarGrupoConAsignatura(relacion.grupo.id, payload);

    onSave(updated);
    onClose();
  } catch (error) {
    console.error(error);
    alert("Error al actualizar la materia ❌");
  }
};


  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ fontWeight: "bold", marginBottom: "15px" }}>Editar Materia</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>Nombre de la materia</label>
        <input
          type="text"
          value={relacion.asignatura.asignatura}
          disabled
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginTop: "5px",
          }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Docente</label>
        <select
          value={selectedDocente}
          onChange={(e) => setSelectedDocente(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginTop: "5px",
          }}
        >
          {docentesDisponibles.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombres} {d.apellido_paterno}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button
          onClick={onClose}
          style={{
            padding: "8px 15px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            background: "#f3f4f6",
          }}
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          style={{
            padding: "8px 15px",
            borderRadius: "5px",
            background: "#10b981",
            color: "white",
            border: "none",
          }}
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}

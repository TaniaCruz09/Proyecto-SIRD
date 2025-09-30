"use client";
import { useEffect, useState } from "react";
import {
  GrupoConAsignaturasPayload,
  GrupoConAsignaturasResponse,
} from "@/interfaces/organizacionEscolarInterface/gruposConAsignaturas";
import {
  eliminarGrupoConTodasSusAsignatura,
  eliminarUnaAsignaturaAsignatura,
  getGrupoConAsignaturaById,
  saveGrupoConAsignatura,
} from "@/actions/organizacionEscolarMethods/GrupoEscolarMethods/grupoConAsignaturasMethos";
import { Asignatura, Docente, GrupoEscolar } from "@/interfaces";
import { getAsignaturas } from "@/actions/catalogos/asignaturaMethods";
import { useParams, } from "next/navigation";
import { getDocentes } from "@/actions/docentesMethods/docentesMethods";
import EditarMateriaForm from "@/components/forms/EditarMateriaForm";
import ConfirmDialog from "@/components/modals/organizacionEscolar/grupoConAsignatura/ConfirmAccion";
import { getGruposById } from "@/actions/organizacionEscolarMethods/GrupoEscolarMethods/GrupoEscolarMethods";

export default function AddClasesOrganizacionEscolarPage() {
  // useQuery({
  //   queryKey: ['grupoId'],
  //   queryFn: async () => await getGruposById(Number(useParams().grupoId))
  // });

  const [grupoConAsignaturas, setGrupoConAsignaturas] = useState<GrupoConAsignaturasResponse[]>([]);
  const [materiasDisponibles, setMateriasDisponibles] = useState<Asignatura[]>([]);
  const [docentesDisponibles, setDocentesDisponibles] = useState<Docente[]>([]);
  const [selectedAsignatura, setSelectedAsignatura] = useState<number>(0);
  const [selectedDocente, setSelectedDocente] = useState<number>(0);
  const [editando, setEditando] = useState<GrupoConAsignaturasResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    message: "",
    onConfirm: () => { },
  });

  const { grupoId } = useParams();


  const [grupos, setGrupos] = useState<GrupoEscolar>();

  const fetchGrupoById = async () => {
    try {
      const response = await getGruposById(Number(grupoId))
      setGrupos(response)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchGrupoById()

  }, [grupoId]);
  const grupo = grupos?.grado.grades ?? "N/A"
  const docenteGuia = grupos?.docenteGuia.nombres ?? "N/A"
  const docenteGuiaApellidos = grupos?.docenteGuia.apellido_materno ?? "N/A"
  const seccion = grupos?.seccion.seccion ?? "N/A"

  // Función para traer las relaciones del grupo
  const fetchRelaciones = async () => {
    if (!grupoId) return;
    const relacionesArray = await getGrupoConAsignaturaById(Number(grupoId));
    const relacionesUnicas = relacionesArray.filter(
      (rel: GrupoConAsignaturasResponse, index: number, self: GrupoConAsignaturasResponse[]) =>
        index === self.findIndex((r) => r.asignatura.id === rel.asignatura.id)
    );

    setGrupoConAsignaturas(relacionesUnicas);
  };

  useEffect(() => {
    async function fetchData() {
      if (!grupoId) return;
      try {
        await fetchRelaciones();
        setMateriasDisponibles(await getAsignaturas());
        setDocentesDisponibles(await getDocentes());
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [grupoId]);

  // Función para eliminar una asignatura
  const handleEliminarAsignatura = (asignaturaId: number) => {
    setConfirmDialog({
      open: true,
      message: "¿Seguro que deseas eliminar esta asignatura?",
      onConfirm: async () => {
        try {
          setLoading(true);
          const res = await eliminarUnaAsignaturaAsignatura(Number(grupoId), asignaturaId);
          console.log(res?.message || "Asignatura eliminada correctamente ✅");
          await fetchRelaciones();
        } catch (error: any) {
          console.log(error.message || "Error al eliminar asignatura ❌");
        } finally {
          setLoading(false);
          setConfirmDialog({ ...confirmDialog, open: false }); // cerrar modal
        }
      },
    });
  };

  // Función para eliminar todas las asignaturas del grupo
  const handleEliminarTodasAsignaturas = () => {
    setConfirmDialog({
      open: true,
      message: "¿Seguro que deseas eliminar todas las asignaturas del grupo?",
      onConfirm: async () => {
        try {
          setLoading(true);
          const res = await eliminarGrupoConTodasSusAsignatura(Number(grupoId));
          console.log(res?.message || "Todas las asignaturas eliminadas ✅");
          await fetchRelaciones();
        } catch (error: any) {
          console.log(error.message || "Error al eliminar todas las asignaturas ❌");
        } finally {
          setLoading(false);
          setConfirmDialog({ ...confirmDialog, open: false });
        }
      },
    });
  };


  // Función para agregar una asignatura
  const handleAgregar = async () => {
    if (!selectedAsignatura || !selectedDocente) {
      alert("Selecciona materia y docente");
      return;
    }

    if (grupoConAsignaturas.some(r => r.asignatura.id === selectedAsignatura)) {
      alert("Esta asignatura ya está asignada.");
      return;
    }

    const payload: GrupoConAsignaturasPayload = {
      grupoId: Number(grupoId),
      asignaturasConDocentes: [{ asignaturaId: selectedAsignatura, docenteId: selectedDocente }],
    };

    try {
      await saveGrupoConAsignatura(payload);
      await fetchRelaciones();
      setSelectedAsignatura(0);
      setSelectedDocente(0);
    } catch (error) {
      console.error(error);
    }
  };

  if (!grupoId) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontWeight: "bold", fontSize: "24px" }}>Asignación de Materias</h1>
      <p style={{ color: "#6b7280" }}>Gestiona las materias para el grupo seleccionado</p>

      {/* Info del grupo */}
      <div style={{ backgroundColor: "#f0fdf4", borderRadius: "10px", padding: "15px", marginBottom: "20px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <strong>Grupo Seleccionado</strong>
          <h2 style={{ color: "#15803d" }}>
            Docente Guia: {docenteGuia || "N/A"}{docenteGuiaApellidos || "N/A"}
          </h2>
          <p>

            grupo: {grupo || "N/A"} {seccion || "N/A"}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p>Materias asignadas: {grupoConAsignaturas.length}</p>
        </div>
      </div>

      {/* Asignar nuevas materias */}
      <div style={{ backgroundColor: "#f9fafb", borderRadius: "10px", padding: "15px", marginBottom: "20px" }}>
        <h3 style={{ fontWeight: "bold" }}>+ Asignar Nuevas Materias</h3>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <select style={{ flex: 1, padding: "8px", borderRadius: "5px" }} value={selectedAsignatura} onChange={(e) => setSelectedAsignatura(Number(e.target.value))}>
            <option value={0}>Elige una materia</option>
            {materiasDisponibles.filter(m => !grupoConAsignaturas.some(r => r.asignatura.id === m.id))
              .map(m => <option key={m.id} value={m.id}>{m.asignatura}</option>)}
          </select>

          <select style={{ flex: 1, padding: "8px", borderRadius: "5px" }} value={selectedDocente} onChange={(e) => setSelectedDocente(Number(e.target.value))}>
            <option value={0}>Elige un docente</option>
            {docentesDisponibles.map(d => <option key={d.id} value={d.id}>{d.nombres} {d.apellido_paterno}</option>)}
          </select>

          <button onClick={handleAgregar} style={{ padding: "10px 20px", backgroundColor: "#6ee7b7", color: "#065f46", borderRadius: "5px", border: "none" }}>
            + Agregar a Lista
          </button>
        </div>
      </div>

      {/* Materias asignadas */}
      <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Materias Asignadas</h3>
          <button
            onClick={handleEliminarTodasAsignaturas}
            disabled={loading || grupoConAsignaturas.length === 0}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Eliminar todas
          </button>
        </div>

        {/* Grid de asignaturas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {grupoConAsignaturas.map((r) => (
            <div
              key={r.id}
              className="relative bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition"
            >
              {/* Nombre de asignatura */}
              <h4 className="text-base font-medium text-gray-900 mb-1">
                {r.asignatura.asignatura}
              </h4>

              {/* Docente */}
              <p className="text-sm text-gray-600">
                Docente: <span className="font-medium">{r.docente.nombres} {r.docente.apellido_paterno}</span>
              </p>

              {/* Acciones */}
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => setEditando(r)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleEliminarAsignatura(r.asignatura.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          {/* Cuando no hay asignaturas */}
          {grupoConAsignaturas.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-6 italic">
              No hay asignaturas en este grupo.
            </div>
          )}
        </div>
      </div>


      {/* Modal para editar */}
      {editando && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <EditarMateriaForm
            relacion={editando}
            docentesDisponibles={docentesDisponibles}
            onClose={() => setEditando(null)}
            onSave={fetchRelaciones}
          />
        </div>
      )}
      <ConfirmDialog
        isOpen={confirmDialog.open}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
      />

    </div>
  );
}

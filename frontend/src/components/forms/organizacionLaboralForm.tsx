"use client"
import { getAniosLectivos } from "@/actions/catalogos/anioLectivoMethods";
import { getAsignaturas } from "@/actions/catalogos/asignaturaMethods";
import { getDocentes } from "@/actions/docentesMethods/docentesMethods";
import { getGrupos } from "@/actions/organizacionEscolarMethods/GrupoEscolarMethods/GrupoEscolarMethods";
import { ActualizarOrganizacionEscolar, saveOrganizacionLaboral } from "@/actions/organizacionLaboralMetodo/organizacionLaboralMetodo";
import { AnioLectivo, Asignatura, Docente, GrupoEscolar } from "@/interfaces";
import { OrganizacionLaboral, OrganizacionLaboralPayload } from "@/interfaces/organizacionLaboralInterface";
import { useEffect, useState } from "react";

interface OrganizacionLaboralProps {
    defeaultValues?: OrganizacionLaboral | null;
    onSucess?: () => void;
}

export default function OrganizacionLaboralForm({ defeaultValues, onSucess }: OrganizacionLaboralProps) {
    const [docente, setDocente] = useState<string>("");
    const [añoLectivo, setAñoLectivo] = useState<string>("");
    const [grupoGuia, setGrupoGuia] = useState<string>("");

    const [docenteRelacion, setDocentesRelacion] = useState<Docente[]>([]);
    const [añolectivoRelacion, setAñolectivoRelacion] = useState<AnioLectivo[]>([]);
    const [grupoGuiaRelacion, setGrupoGuiaRelacion] = useState<GrupoEscolar[]>([]);
    const isEdit = Boolean(defeaultValues?.id)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    docentesData,
                    añoLectivoData,
                    grupoGuia,
                ] = await Promise.all([
                    getDocentes(),
                    getAniosLectivos(),
                    getGrupos(), // Assuming this is the same endpoint for both grupos and grupoGuia
                ])
                setDocentesRelacion(docentesData);
                setAñolectivoRelacion(añoLectivoData);
                setGrupoGuiaRelacion(grupoGuia);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [])
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const selectedDocente = docenteRelacion.find((s) => s.id === parseInt(docente));
            const selectedAñoLectivo = añolectivoRelacion.find((p) => p.id === parseInt(añoLectivo));
            const selectedGrupoGuia = grupoGuiaRelacion.find(
                (m) => m.id === parseInt(grupoGuia)
            );
            if (
                !selectedDocente ||
                !selectedAñoLectivo ||
                !selectedGrupoGuia
            ) {
                console.error("Faltan campos requeridos");
                return;
            }

            const OrganizacionLaboralData: OrganizacionLaboralPayload = {
                docente: selectedDocente,
                añolectivo: selectedAñoLectivo,
                grupoGuia: selectedGrupoGuia,
                // Opcionales:
                user_create_id: null,
                created_at: undefined,
                update_at: undefined,
                user_update_id: null,
                deleted_at: null,
                deleted_at_id: null,
            }
            if (isEdit && defeaultValues?.id) {
                await ActualizarOrganizacionEscolar(defeaultValues.id, OrganizacionLaboralData);
            } else {
                await saveOrganizacionLaboral(OrganizacionLaboralData);
            }
            onSucess?.();

        } catch (error) {
            console.error("Error al guardar el estudiante:", error);
        }

    }

    useEffect(() => {
        if (defeaultValues) {
            setDocente(defeaultValues.docente.id?.toString() || "");
            setAñoLectivo(defeaultValues.añolectivo.id?.toString() || "");
            setGrupoGuia(defeaultValues.grupoGuia.id?.toString() || "");
        }
    }, [defeaultValues]);

    return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
      <h2 className="text-xl font-semibold text-gray-700">
        {isEdit ? "Editar organización laboral" : "Agregar organización laboral"}
      </h2>

      <select
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        value={docente}
        onChange={(e) => setDocente(e.target.value)}
      >
        <option value="">Docente</option>
        {docenteRelacion.map((r) => (
          <option key={r.id} value={r.id}>
            {r.nombres} {r.apellido_paterno}
          </option>
        ))}
      </select>

      <select
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        value={añoLectivo}
        onChange={(e) => setAñoLectivo(e.target.value)}
      >
        <option value="">Año Lectivo</option>
        {añolectivoRelacion.map((r) => (
          <option key={r.id} value={r.id}>
            {r.anio_lectivo}
          </option>
        ))}
      </select>
      <select
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        value={grupoGuia}
        onChange={(e) => setGrupoGuia(e.target.value)}
      >
        <option value="">Grupo Guía</option>
        {grupoGuiaRelacion.map((r) => (
          <option key={r.id} value={r.id}>
            {r.grado?.grades} - {r.modalidad?.modalidad} - {r.turno?.turno} - {r.seccion?.seccion}
          </option>
        ))}
      </select>

      <div className="flex justify-center">
        <button
          type="submit"
          className="px-20 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 mb-6"
        >
          {isEdit ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
}

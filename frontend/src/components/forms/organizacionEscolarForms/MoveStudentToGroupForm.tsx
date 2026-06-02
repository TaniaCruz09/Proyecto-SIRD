"use client";
import { moverEstudianteDeGrupo } from "@/actions/organizacionEscolarMethods/asignacionEstudiantesMethods";
import { getGruposPorAnioYGrado } from "@/actions/organizacionEscolarMethods/GrupoEscolarMethods/GrupoEscolarMethods";
import { useToast } from "@/hooks/use-toast";
import { GrupoEscolar } from "@/interfaces";
import { useEffect, useState } from "react";

interface MoveStudentModalProps {
  onSuccess: () => void;
  gradoId: number
  idAnioLectivo: number;
  estudianteId: number;
  anioLectivo: number
  grupoOrigenId: number
}

export default function MoveStudentToGroupForm({
  onSuccess,
  gradoId,
  idAnioLectivo,
  estudianteId,
  anioLectivo,
  grupoOrigenId
}: MoveStudentModalProps) {
  const [nuevoGrupoId, setNuevoGrupoId] = useState<number | "">("");
  const [grupos, setGrupos] = useState<GrupoEscolar[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {toast} = useToast();

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const gruposData = await getGruposPorAnioYGrado(idAnioLectivo, gradoId);
        setGrupos(gruposData);
      } catch (error) {
        console.error("Error cargando grupos:", error);
      }
    };
    fetchGrupos();
  }, [idAnioLectivo, gradoId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ✅ Evita que recargue la página

    if (!nuevoGrupoId || nuevoGrupoId === 0) {
      toast({
        title: "Grupo inválido",
        description: "Por favor selecciona un grupo válido.",
        variant: "destructive",
      });
      return;
    }

    if (Number(nuevoGrupoId) === Number(grupoOrigenId)) {
      toast({
        title: "Traslado no válido",
        description: "El estudiante ya pertenece a ese grupo.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await moverEstudianteDeGrupo(estudianteId, grupoOrigenId, nuevoGrupoId as number);

      console.log("Estudiante movido:", result);

      onSuccess();
      toast({
        title: "Estudiante movido",
        description: "El estudiante se movió exitosamente al nuevo grupo.",
        variant: "success",
      });
    } catch (error: any) {
      console.error("Error al mover estudiante:", error);
      toast({
        title: "No se pudo mover al estudiante",
        description: error?.message || "Ocurrió un error al mover al estudiante.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
      <h2 className="text-xl font-semibold text-gray-700 mb-5">Mover estudiante a otra sección</h2>
      <p className="text-center text-gray-600 mb-6">
        Año lectivo: <span className="font-semibold text-blue-900">{anioLectivo}</span>
      </p>

      <label className="text-left block mt-10 mb-2 text-sm font-medium">
        Selecciona el nuevo grupo:
      </label>
      <select
        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 hover:bg-white mb-10 text-sm"
        value={nuevoGrupoId}
        onChange={(e) => setNuevoGrupoId(e.target.value === "" ? "" : Number(e.target.value))}
        required
      >
        <option value="">-- Seleccionar --</option>
        {grupos.map((grupo) => (
          <option key={grupo.id} value={grupo.id}>
            {`${grupo.grado.grades} - ${grupo.seccion.seccion} - ${grupo.turno.turno} de ${grupo.turno.modalidad?.modalidad}`}
          </option>
        ))}
      </select>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
        >
          {isSubmitting ? "Moviendo..." : "Confirmar"}
        </button>
      </div>
    </form>
  );
}

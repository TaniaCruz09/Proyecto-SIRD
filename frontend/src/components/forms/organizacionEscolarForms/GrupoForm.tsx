import { getAniosLectivos } from '@/actions/catalogos/anioLectivoMethods';
import { getGrados } from '@/actions/catalogos/gradoMethods';
import { getModalidades } from '@/actions/catalogos/modalidadMethods';
import { getSecciones } from '@/actions/catalogos/seccionMethods';
import { getTurnos } from '@/actions/catalogos/turnoMethods';
import { getDocentes } from '@/actions/docentesMethods/docentesMethods';
import { saveGrupo, updateGrupo } from '@/actions/organizacionEscolarMethods/GrupoEscolarMethods/GrupoEscolarMethods';
import { AnioLectivo, Docente, Grado, GrupoEscolar, GrupoEscolarPayload, Modalidad, Seccion, Turno } from '@/interfaces';
import React, { useEffect, useState } from 'react'

interface GrupoFormProp {
    defaultValues?: GrupoEscolar | null;
    onSuccess: () => void;
}


export default function GrupoForm({ defaultValues, onSuccess }: GrupoFormProp) {
    const [grado, setGrado] = useState<string>("")
    const [grados, setGrados] = useState<Grado[]>([])

    const [seccion, setSeccion] = useState<string>("")
    const [secciones, setSecciones] = useState<Seccion[]>([])
    const [modalidad, setModalidad] = useState<string>("")
    const [modalidades, setModalidades] = useState<Modalidad[]>([])

    const [turno, setTurno] = useState<string>("")
    const [turnos, setTurnos] = useState<Turno[]>([])

    const isEdit = Boolean(defaultValues?.id);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    organizacionEscolarData,
                    gradoData,
                    seccionData,
                    modalidadData,
                    turnoData,
                    docenteData
                ] = await Promise.all([
                    getAniosLectivos(),
                    getGrados(),
                    getSecciones(),
                    getModalidades(),
                    getTurnos(),
                    getDocentes()
                ]);
                setGrados(gradoData);
                setSecciones(seccionData);
                setModalidades(modalidadData);
                setTurnos(turnoData);
            } catch (error) {
                console.error("Error al cargar los datos del formulario:", error);
            }
        }
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const selectedGrado = grados.find((g) => g.id === parseInt(grado));
            const selectedSeccion = secciones.find((s) => s.id === parseInt(seccion));
            const selectedModalidad = modalidades.find((m) => m.id === parseInt(modalidad));
            const selectedTurno = turnos.find((t) => t.id === parseInt(turno));

            if (
                !selectedGrado ||
                !selectedSeccion ||
                !selectedModalidad ||
                !selectedTurno
            ) {
                console.error("Faltan campos requeridos");
                return;
            }

            const grupoData: GrupoEscolarPayload = {
                grado: selectedGrado,
                seccion: selectedSeccion,
                modalidad: selectedModalidad,
                turno: selectedTurno,
            }
            if (isEdit && defaultValues?.id) {
                await updateGrupo(defaultValues.id, grupoData);
            } else {
                await saveGrupo(grupoData)
            }
            onSuccess();
        } catch (error) {
            console.error("Error al guardar o actualizar grupo:", error);
        }
    }

    useEffect(() => {
        if (defaultValues) {
            setGrado(defaultValues.grado?.id?.toString() || "");
            setSeccion(defaultValues.seccion?.id?.toString() || "");
            setModalidad(defaultValues.modalidad?.id?.toString() || "");
            setTurno(defaultValues.turno?.id?.toString() || "");
        }
    }, [defaultValues])
    return (
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
            <h2 className="text-xl font-semibold text-gray-700">
                {isEdit ? "Editar Grupo" : "Agregar Nuevo Grupo"}
            </h2>
            <select
                name="grado"
                id="grado"
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={grado}
                onChange={(e) => setGrado(e.target.value)}
            >
                <option value="">Grado</option>
                {grados?.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.grades}
                    </option>
                ))}
            </select>
            <select
                name="seccion"
                id="seccion"
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={seccion}
                onChange={(e) => setSeccion(e.target.value)}
            >
                <option value="">Seccion</option>
                {secciones?.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.seccion}
                    </option>
                ))}
            </select>
            <select
                name="turno"
                id="turno"
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={turno}
                onChange={(e) => setTurno(e.target.value)}
            >
                <option value="">Turno</option>
                {turnos?.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.turno}
                    </option>
                ))}
            </select>
            <select
                name="modalidad"
                id="modalidad"
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={modalidad}
                onChange={(e) => setModalidad(e.target.value)}
            >
                <option value="">Modalidad</option>
                {modalidades?.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.modalidad}
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
    )
}

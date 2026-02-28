"use client"
import { getGrados } from '@/actions/catalogos/gradoMethods';
import { getSecciones } from '@/actions/catalogos/seccionMethods';
import { getTurnos } from '@/actions/catalogos/turnoMethods';
import { getDocentes } from '@/actions/docentesMethods/docentesMethods';
import { saveGrupo, updateGrupo } from '@/actions/organizacionEscolarMethods/GrupoEscolarMethods/GrupoEscolarMethods';
import { getOrganizacionEscolar } from '@/actions/organizacionEscolarMethods/organizacionMethods';
import { Docente, Grado, GrupoEscolar, GrupoEscolarPayload, OrganizacionEscolar, Seccion, Turno } from '@/interfaces';
import { useToast } from '@/hooks/use-toast';
import React, { useEffect, useState } from 'react'

interface GrupoFormProp {
    defaultValues?: GrupoEscolar | null;
    onSuccess: () => void;
}


export default function GrupoForm({ defaultValues, onSuccess }: GrupoFormProp) {
    const { toast } = useToast();
    const [grado, setGrado] = useState<string>("")
    const [grados, setGrados] = useState<Grado[]>([])

    const [seccion, setSeccion] = useState<string>("")
    const [secciones, setSecciones] = useState<Seccion[]>([])

    const [turno, setTurno] = useState<string>("")
    const [turnos, setTurnos] = useState<Turno[]>([])

    const [docenteGuia, setDocenteGuia] = useState<string>("")
    const [docentes, setDocentes] = useState<Docente[]>([])

    const [organizacionEscolar, setOrganizacionEscolar] = useState<string>("")
    const [organizacionesEscolares, setOrgnizacionesEscolares] = useState<OrganizacionEscolar[]>([])
    const [isLoading, setIsLoading] = useState(false)


    const isEdit = Boolean(defaultValues?.id);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    organizacionEscolarData,
                    gradoData,
                    seccionData,
                    docenteGuiaData,
                    turnoData,
                ] = await Promise.all([
                    getOrganizacionEscolar(),
                    getGrados(),
                    getSecciones(),
                    getDocentes(),
                    getTurnos(),
                ]);
                setOrgnizacionesEscolares(organizacionEscolarData)
                setGrados(gradoData);
                setSecciones(seccionData);
                setDocentes(docenteGuiaData);
                setTurnos(turnoData);
            } catch (error) {
                console.error("Error al cargar los datos del formulario:", error);
            }
        }
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const selectedOrganizacionEScolar = organizacionesEscolares.find((g) => g.id === parseInt(organizacionEscolar));
            const selectedGrado = grados.find((g) => g.id === parseInt(grado));
            const selectedSeccion = secciones.find((s) => s.id === parseInt(seccion));
            const selectedDocente = docentes.find((m) => m.id === parseInt(docenteGuia));
            const selectedTurno = turnos.find((t) => t.id === parseInt(turno));

            if (
                !selectedOrganizacionEScolar ||
                !selectedGrado ||
                !selectedSeccion ||
                !selectedDocente ||
                !selectedTurno
            ) {
                toast({
                    title: "Campos requeridos",
                    description: "Completa todos los campos para guardar el grupo.",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }

            const grupoData: GrupoEscolarPayload = {
                organizacionEscolar: selectedOrganizacionEScolar,
                grado: selectedGrado,
                seccion: selectedSeccion,
                docenteGuia: selectedDocente,
                turno: selectedTurno,
            }
            if (isEdit && defaultValues?.id) {
                await updateGrupo(defaultValues.id, grupoData);
                toast({
                    title: "Grupo actualizado",
                    description: "Se actualizo correctamente.",
                    variant: "success",
                });
            } else {
                await saveGrupo(grupoData)
                toast({
                    title: "Grupo creado",
                    description: "Se creo correctamente.",
                    variant: "success",
                });
            }
            onSuccess();
        } catch (error) {
            console.error("Error al guardar o actualizar grupo:", error);
            toast({
                title: "Error al guardar",
                description: "Ocurrio un error al guardar el grupo.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (defaultValues) {
            setOrganizacionEscolar(defaultValues.organizacionEscolar?.id?.toString() || "");
            setGrado(defaultValues.grado?.id?.toString() || "");
            setSeccion(defaultValues.seccion?.id?.toString() || "");
            setDocenteGuia(defaultValues.docenteGuia?.id?.toString() || "");
            setTurno(defaultValues.turno?.id?.toString() || "");
        }
    }, [defaultValues])
    return (
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
            <h2 className="text-xl font-semibold text-gray-700">
                {isEdit ? "Editar Grupo" : "Agregar Nuevo Grupo"}
            </h2>
            <select
                name="organizacionEscolar"
                id="organizacionEscolar"
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={organizacionEscolar}
                onChange={(e) => setOrganizacionEscolar(e.target.value)}
            >
                <option value="">Organizacion Escolar</option>
                {organizacionesEscolares?.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.anio_lectivo?.anio_lectivo} - {r.turno.turno} -
                        {r.turno.modalidad?.modalidad}
                    </option>
                ))}
            </select>
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
                name="docente"
                id="docente"
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={docenteGuia}
                onChange={(e) => setDocenteGuia(e.target.value)}
            >
                <option value="">Docente Guia</option>
                {docentes?.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.nombres} {r.apellido_materno} {r.apellido_paterno}
                    </option>
                ))}
            </select>
            <div className="flex justify-center">
                <button
                    type="submit"
                    className="px-20 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 mb-6"
                    disabled={isLoading}
                >
                    {isLoading ? "Guardando..." : isEdit ? "Actualizar" : "Guardar"}
                </button>
            </div>
        </form>
    )
}

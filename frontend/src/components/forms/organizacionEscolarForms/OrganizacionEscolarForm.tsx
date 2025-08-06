import { getAniosLectivos } from '@/actions/catalogos/anioLectivoMethods';
import { getAsignaturas } from '@/actions/catalogos/asignaturaMethods';
import { getCortesEvaluativos } from '@/actions/catalogos/corteEvaluativoMethods';
import { getDocentes } from '@/actions/docentesMethods/docentesMethods';
import { getGrupos, saveGrupo, updateGrupo } from '@/actions/organizacionEscolarMethods/GrupoEscolarMethods/GrupoEscolarMethods';
import { saveOrganizacionEscolar, updateOrganizacionEscolar } from '@/actions/organizacionEscolarMethods/organizacionMethods';
import { AnioLectivo, Asignatura, Corte, Docente, GrupoEscolarPayload, OrganizacionEscolar, OrganizacionEscolarPayload } from '@/interfaces';
import { Grupos } from '@/interfaces/catalogoInterface/GruposInterface';
import React, { useEffect, useState } from 'react'

interface OrganizacionFormProp {
    defaultValues?: OrganizacionEscolar | null;
    onSuccess: () => void;
}


export default function OrganizacionEscolarForm({ defaultValues, onSuccess }: OrganizacionFormProp) {
    const [anioLectivo, setAnioLectivo] = useState<string>("")
    const [aniosLectivos, setAniosLectivos] = useState<AnioLectivo[]>([])

    const [grupo, setGrupo] = useState<string>("")
    const [grupos, setGrupos] = useState<Grupos[]>([])

    const [docenteGuia, setDocenteGuia] = useState<string>("")
    const [docentesGuias, setDocentesGuias] = useState<Docente[]>([])

    const [docente, setDocente] = useState<string[]>([])
    const [docentes, setDocentes] = useState<Docente[]>([])

    const [asignatura, setAsignatura] = useState<string[]>([])
    const [asignaturas, setAsignaturas] = useState<Asignatura[]>([])

    const [corte, setCorte] = useState<string[]>([])
    const [cortes, setCortes] = useState<Corte[]>([])

    const isEdit = Boolean(defaultValues?.id);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    anioLectivoData,
                    grupoData,
                    docenteGuiaData,
                    docentesData,
                    asignaturasData,
                    cortesData
                ] = await Promise.all([
                    getAniosLectivos(),
                    getGrupos(),
                    getDocentes(),
                    getDocentes(),
                    getAsignaturas(),
                    getCortesEvaluativos()
                ]);
                setAniosLectivos(anioLectivoData);
                setGrupos(grupoData);
                setDocentesGuias(docenteGuiaData);
                setDocentes(docentesData);
                setAsignaturas(asignaturasData);
                setCortes(cortesData);
            } catch (error) {
                console.error("Error al cargar los datos del formulario:", error);
            }
        }
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const selectedAnioEscolar = aniosLectivos.find((a) => a.id === parseInt(anioLectivo));
            const selectedGrupo = grupos.find((g) => g.id === parseInt(grupo));
            const selectedDocenteGuia = docentesGuias.find((m) => m.id === parseInt(docenteGuia));
            const selectedDocentes = docentes.filter((d) => docente.includes(d.id.toString()));
            const selectedAsignaturas = asignaturas.filter((a) => asignatura.includes(a.id.toString()));
            const selectedCortes = cortes.filter((c) => corte.includes(c.id.toString()));

            if (
                !selectedAnioEscolar ||
                !selectedGrupo ||
                !selectedDocenteGuia ||
                !selectedDocentes ||
                !selectedAsignaturas ||
                !selectedCortes
            ) {
                console.error("Faltan campos requeridos");
                return;
            }

            const organizacionEscolarData: OrganizacionEscolarPayload = {
                anio_lectivo: selectedAnioEscolar,
                grupo: selectedGrupo,
                docenteGuia: selectedDocenteGuia,
                docentes: selectedDocentes,
                asignaturas: selectedAsignaturas,
                cortes: selectedCortes,
            }
            if (isEdit && defaultValues?.id) {
                await updateOrganizacionEscolar(defaultValues.id, organizacionEscolarData);
            } else {
                await saveOrganizacionEscolar(organizacionEscolarData)
            }
            onSuccess();
        } catch (error) {
            console.error("Error al guardar o actualizar organizacion Escolar:", error);
        }
    }

    useEffect(() => {
        if (defaultValues) {
            setAnioLectivo(defaultValues.anio_lectivo?.id?.toString() || "");
            setGrupo(defaultValues.grupo?.id?.toString() || "");
            setDocenteGuia(defaultValues.docenteGuia?.id?.toString() || "");
            setDocente(defaultValues.docentes?.map((d) => d.id.toString()) || []);
            setAsignatura(defaultValues.asignaturas?.map((d) => d.id.toString()) || []);
            setCorte(defaultValues.cortes?.map((d) => d.id.toString()) || []);
        }
    }, [defaultValues])
    return (
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
            <h2 className="text-xl font-semibold text-gray-700">
                {isEdit ? "Editar Organizacion Escolar" : "Agregar Organizacion Escolar"}
            </h2>
            <select
                name="anioLectivo"
                id="anioLectivo"
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={anioLectivo}
                onChange={(e) => setAnioLectivo(e.target.value)}
            >
                <option value="">Año Lectivo</option>
                {aniosLectivos?.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.anio_lectivo}
                    </option>
                ))}
            </select>
            <select
                name="grupo"
                id="grupo"
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={grupo}
                onChange={(e) => setGrupo(e.target.value)}
            >
                <option value="">Grupo</option>
                {grupos?.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.id}
                    </option>
                ))}
            </select>
            <select
                name="docenteGuia"
                id="docenteGuia"
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={docenteGuia}
                onChange={(e) => setDocenteGuia(e.target.value)}
            >
                <option value="">Docente Guia</option>
                {docentes?.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.nombres}
                    </option>
                ))}
            </select>
            <select
                multiple
                name="docentes"
                id="docentes"
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={docente}
                onChange={(e) => setDocente(Array.from(e.target.selectedOptions, (option) => option.value))}
            >
                <option value="">Docentes Asignados</option>
                {docentesGuias?.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.nombres}
                    </option>
                ))}
            </select>
            <select
                multiple
                name="asignaturas"
                id="asignaturas"
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={asignatura}
                onChange={(e) => setAsignatura(Array.from(e.target.selectedOptions, (option) => option.value))}
            >
                <option value="">Asignaturas</option>
                {asignaturas?.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.asignatura}
                    </option>
                ))}
            </select>
            <select
                multiple
                name="cortes"
                id="cortes"
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={corte}
                onChange={(e) => setCorte(Array.from(e.target.selectedOptions, (option) => option.value))}
            >
                <option value="">Corte</option>
                {cortes?.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.corte}
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

"use client"

import EstudianteRow from "./EstudianteRow"

export default function ListaEstudiantes({
    estudiantes,
    asignatura,
    corteActivo,
    guardando,
    getInitials,
    handleCalificacionChange,
    handleGuardarIndividual
}: any) {
    return (
        <div className="space-y-4">

            <div className="hidden md:grid md:grid-cols-12 gap-4 pb-3 border-b font-semibold text-sm text-muted-foreground">
                <div className="col-span-1 text-center">Foto</div>
                <div className="col-span-4">Nombre Completo</div>
                <div className="col-span-2">Código</div>
                <div className="col-span-1 text-center">Sexo</div>
                <div className="col-span-4">Calificación</div>
            </div>

            {estudiantes.map((est: any) => (
                <EstudianteRow
                    key={est.id}
                    estudiante={est}
                    asignaturaId={asignatura.id}
                    corteActivo={corteActivo}
                    guardando={guardando}
                    getInitials={getInitials}
                    onChange={handleCalificacionChange}
                    onGuardar={handleGuardarIndividual}
                />
            ))}
        </div>
    )
}

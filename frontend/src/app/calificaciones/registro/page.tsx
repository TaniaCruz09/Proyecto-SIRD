'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import NavbarAdmin from '@/components/navbarAdmin'

type Estudiante = {
    id: number
    nombre: string
}

type Seccion = {
    id: number
    anio: number
    asignatura: string
    estudiantes: Estudiante[]
}

// 🧪 Simulamos datos (esto vendría del backend)
const seccionesMock: Seccion[] = [
    {
        id: 1,
        anio: 2024,
        asignatura: 'Matemáticas',
        estudiantes: [
            { id: 1, nombre: 'Ana López' },
            { id: 2, nombre: 'Carlos Martínez' }
        ]
    },
    {
        id: 2,
        anio: 2024,
        asignatura: 'Ciencias',
        estudiantes: [
            { id: 3, nombre: 'Luisa Torres' },
            { id: 4, nombre: 'Pedro Gómez' }
        ]
    }
]

export default function RegistroNotas() {
    const searchParams = useSearchParams()
    const idSeccion = parseInt(searchParams.get('idSeccion') || '0')
    const anio = parseInt(searchParams.get('anio') || '0')
    const asignatura = searchParams.get('asignatura') || ''

    const [notas, setNotas] = useState<{ [idEstudiante: number]: number }>({})

    const seccion = seccionesMock.find(
        (s) => s.id === idSeccion && s.anio === anio && s.asignatura === asignatura
    )

    const handleNotaChange = (id: number, valor: string) => {
        const nota = parseFloat(valor)
        setNotas({ ...notas, [id]: isNaN(nota) ? 0 : nota })
    }

    const handleGuardar = () => {
        console.log('📤 Notas enviadas:', notas)

        // Aquí iría el POST al backend para guardar
        alert('✅ Notas guardadas con éxito')
    }

    if (!seccion) {
        return (
            <div className="flex">
                <NavbarAdmin />
                <div className="p-6">
                    <p className="text-red-600 font-bold">Sección no encontrada</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen">
            <NavbarAdmin />
            <div className="w-full p-6 bg-gray-100 overflow-auto">
                <h1 className="text-2xl font-bold mb-4 text-blue-800">Registro de Calificaciones</h1>
                <p className="mb-6 text-gray-700">
                    Asignatura: <strong>{asignatura}</strong> | Año: <strong>{anio}</strong> | Sección ID: <strong>{idSeccion}</strong>
                </p>

                <div className="bg-white rounded-xl shadow p-6">
                    <table className="w-full table-auto border">
                        <thead>
                            <tr className="bg-blue-100">
                                <th className="p-3 border">#</th>
                                <th className="p-3 border text-left">Estudiante</th>
                                <th className="p-3 border">Nota</th>
                            </tr>
                        </thead>
                        <tbody>
                            {seccion.estudiantes.map((e, i) => (
                                <tr key={e.id} className="hover:bg-blue-50">
                                    <td className="p-3 border text-center">{i + 1}</td>
                                    <td className="p-3 border">{e.nombre}</td>
                                    <td className="p-3 border text-center">
                                        <input
                                            type="number"
                                            min={0}
                                            max={100}
                                            className="w-24 text-center border rounded-md px-2 py-1"
                                            value={notas[e.id] || ''}
                                            onChange={(ev) => handleNotaChange(e.id, ev.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleGuardar}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:shadow-lg"
                        >
                            Guardar Calificaciones
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

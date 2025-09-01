import React from 'react';

export default function Page() {
    // Datos de ejemplo del estudiante
    const estudiante = {
        nombre: "Juan Pérez",
        codigo: "STU2020123",
        sexo: "Masculino",
        fotoUrl: "", // Puedes poner la URL de la foto aquí
        historial: [
            { año: 2020, grado: "Séptimo" },
            { año: 2021, grado: "Octavo" },
            { año: 2022, grado: "Noveno" },
        ],
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            {/* Encabezado */}
            <div className="flex items-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-300">
                    {estudiante.fotoUrl ? (
                        <img
                            src={estudiante.fotoUrl}
                            alt={estudiante.nombre}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                            Foto
                        </div>
                    )}
                </div>
                <div className="ml-6">
                    <h2 className="text-2xl font-semibold">{estudiante.nombre}</h2>
                    <p className="text-gray-600">Código: {estudiante.codigo}</p>
                    <p className="text-gray-600">Sexo: {estudiante.sexo}</p>
                </div>
            </div>

            {/* Historial académico */}
            <div>
                <h3 className="text-xl font-medium mb-3">Historial académico</h3>
                <ul className="space-y-2">
                    {estudiante.historial.map((item, index) => (
                        <li
                            key={index}
                            className="p-3 bg-blue-50 rounded-md flex justify-between"
                        >
                            <span className="font-medium">{item.grado}</span>
                            <span className="text-gray-600">{item.año}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

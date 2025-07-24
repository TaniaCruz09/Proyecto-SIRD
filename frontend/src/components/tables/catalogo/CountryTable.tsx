// import Country from '@/interfaces/CountryInterface';
// import React, { useState } from 'react'
// import CountryRow from './countryRow';

// interface CountryTableProps {
//     countryData: Country []
//     onDelete: (id: number) => void
//     onSuccess?: () => void
//     fetchCountry: ()=> Promise<void>
// }
// export default function CountryTable({countryData, onDelete, onSuccess, fetchCountry}: CountryTableProps) {

//     const [paginaActual, setPaginaActual] = useState <number> (1)
//     const countryPerPage = 5
//     const indiceFinal = paginaActual * countryPerPage
//     const indiceInicio = indiceFinal - countryPerPage
//     const actualCountry = countryData.slice ()
//  return (
//     <div className="bg-white shadow-lg max-screen overflow-hidden shadow-md">
//       <table className="w-full h-full overflow-y-auto space-y-2 text-left bg-white overflow-y-auto text-gray-800">
//         <thead className="bg-gray-200 uppercase text-sm font-semibold sticky top-0 z-10">
//           <tr>
//             <th className="p-3 border-b border-gray-300">ID</th>
//             <th className="p-3 border-b border-gray-300">Rol</th>
//             <th className="p-3 border-b border-gray-300">Activo</th>
//             <th className="p-1 border-b border-gray-300 text-center">Editar</th>
//             <th className="p-1 border-b border-gray-300 text-center">
//               Eliminar
//             </th>
//           </tr>
//         </thead>
//         <tbody className="text-black text-sm">
//           {countryData.length > 0 ? (
//             actualCountry.map((country) => (
//               <CountryRow
//                 key={country.id}
//                 country={country}
//                 onDelete={onDelete}
//                 onSuccess={() => onSuccess}
//                 fetchCountry={fetchCountry}
//               />
//             ))
//           ) : (
//             <tr>
//               <td colSpan={4} className="px-4 py-3">
//                 No hay Paises registrados.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//       <div className="flex justify-between items-center mt-4">
//         <p className="text-sm text-gray-600">
//           Mostrando {indiceInicio + 1} -{" "}
//           {Math.min(indiceFinal, countryData.length)} de {countryData.length} usuarios
//         </p>

//         <div className="space-x-2">
//           <button
//             disabled={paginaActual === 1}
//             onClick={() => setPaginaActual(paginaActual - 1)}
//             className="px-2 py-1 bg-gray-400 rounded hover:bg-gray-500 disabled:opacity-50 text-gray-900"
//           >
//             Anterior
//           </button>
//           <button
//             disabled={indiceFinal >= countryData.length}
//             onClick={() => setPaginaActual(paginaActual + 1)}
//             className="px-2 py-1 bg-gray-400 rounded hover:bg-gray-500 disabled:opacity-50 text-gray-900"
//           >
//             Siguiente
//           </button>
//         </div>
//       </div>
//     </div>
//   );
//   }

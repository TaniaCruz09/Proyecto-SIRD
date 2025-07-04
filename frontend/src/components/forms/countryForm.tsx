// import Country from '@/interfaces/CountryInterface'
// import React from 'react'

// interface CountryFormProps {
//     defaultValues?: Country | null;
//     onSuccess: () => void
// }
// export default function CountryForm({defaultValues, onSuccess} : CountryFormProps) {

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <h2 className="text-xl font-semibold text-gray-700 mb-4">
//         {isEdit ? "Editar Usuario" : "Agregar Usuario"}
//       </h2>
//       <input 
//       type="text" 
//       placeholder="Rol" 
//       value={rol} 
//       onChange={(e)=> setRol(e.target.value)} 
//       className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
//       required/>

//       <div className="flex justify-center">
//         <button
//           type="submit"
//           className="px-20 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
//         >
//           {isEdit ? "Actualizar" : "Guardar"}
//         </button>
//       </div>
//     </form>
//   )
// }

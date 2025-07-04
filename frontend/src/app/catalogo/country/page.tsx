// 'use client'
// import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
// import NavbarAdmin from '@/components/navbarAdmin'
// import SearchBar from '@/components/SearchBar'
// import CountryTable from '@/components/tables/CountryTable'
// import React, { useState } from 'react'

// export default function Page() {
//     const [showModal, setShowModal] = useState <boolean> (false)
//     const [searchTerm, SetSearchTerm] = useState <string>("")
    
//   return (
//     <div className="flex h-screen bg-white">
//         <div>
//             <NavbarAdmin/>
//         </div>
//         <div className='w-screen p-6 bg-gray-100'>
//            <div className="p-6 flex item-center justify-between">
//             <h1 className="ml-10 text-2xl font-bold c mb-4 tracking-tight text-gray-600 text-center">
//             Paises
//             </h1>

//             <div className="flex justify-end mr-10 mb-5">
//             <BtnOpenAddModal onClick={() => setShowModal (true)}/>
//             </div>
//             </div>
//             <div className="flex items-center justify-between bg-white border rounded-t-xl">
//                 <h2 className='pl-10 text-xl font-bold text-gray-600'>Lista de Paises</h2>
//                 <SearchBar 
//                 value={searchTerm}
//                 onChange={SetSearchTerm}
//                 onClear={()=> SetSearchTerm("")}
//                 placeholder='Buscar Pais'
//                 />
//             </div>
             
//             {/* <CountryTable countryData={} onDelete={} onSuccess={} fetchCountry={}/> */}
//         </div>
//     </div>
//   )
// }

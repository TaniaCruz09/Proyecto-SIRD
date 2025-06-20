import React, { useState } from 'react'

interface BtnOpenAddModalProps {
    text: string
}

export default function BtnOpenAddModal({text}: BtnOpenAddModalProps) {
    const [showModal, setShowModal] = useState(Boolean)
    
  return (
    <button
     onClick={() => setShowModal(true)}
     className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
    >
     Agregar Usuario
    </button>
  )
}

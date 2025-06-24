"use client"
import React, { useState } from 'react'
import { BsPlusCircle } from 'react-icons/bs'

interface BtnOpenAddModalProps {
    text?: string
    onClick: ()=> void
}

export default function BtnOpenAddModal({text, onClick}: BtnOpenAddModalProps) {
  
  return (
    <button
     onClick={onClick}
     className="flex items-center gap-2 ml-4 bg-indigo-500 text-white px-3 py-2 rounded-xl hover:bg-indigo-600 transition"
    >
     <span>
      Agregar
     </span>
     <BsPlusCircle className="text-xl"/>
    </button>
  )
}

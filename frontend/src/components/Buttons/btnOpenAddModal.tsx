"use client"
import React, { useState } from 'react'

interface BtnOpenAddModalProps {
    text: string
    onClick: ()=> void
}

export default function BtnOpenAddModal({text, onClick}: BtnOpenAddModalProps) {
  
  return (
    <button
     onClick={onClick}
     className="ml-4 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
    >
     {text}
    </button>
  )
}

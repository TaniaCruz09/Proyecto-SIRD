"use client"
import { Button } from '@headlessui/react'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import { BsPlus, BsPlusCircle } from 'react-icons/bs'

interface BtnOpenAddModalProps {
  text?: string
  onClick: () => void
}

export default function BtnOpenAddModal({ text, onClick }: BtnOpenAddModalProps) {

  return (
    <Button onClick={onClick} className="flex items-center gap-2 ml-4 bg-indigo-500 text-white px-3 py-2 rounded-lg hover:bg-indigo-600 transition">
      <Plus className="h-4 w-4" />
      <span>
        {text || "Agregar"}
      </span>
    </Button>
  )
}

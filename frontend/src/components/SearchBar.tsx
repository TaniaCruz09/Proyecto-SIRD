"use client"

import React from 'react'
import { FaSearch } from 'react-icons/fa';

interface SearchFilterProps{
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onClear?: () => void;
}

export default function SearchBar({
  placeholder = "Buscar...",
  value,
  onChange,
  onClear
}: SearchFilterProps) {
  return (
    <div className="relative w-full max-w-md m-2 flex items-center">
          <FaSearch className="absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border rounded-xl border-gray-300 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {value && (
            <button
              onClick={() => onClear?.()}
              className="absolute right-2 text-gray-500 hover:text-red-500 text-lg font-bold"
              title="Limpiar búsqueda"
            >
              x
            </button>
          )}
        </div>
  )
}

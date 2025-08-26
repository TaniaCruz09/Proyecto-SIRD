import { ArrowLeftRight } from 'lucide-react';
import React from 'react'

interface BtnMoveProps {
    onClick: () => void;
}

export default function BtnMove({ onClick }: BtnMoveProps) {
    return (
        <div>
            <button onClick={onClick}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg shadow-md transition cursor-pointer"
            >
                <ArrowLeftRight size={16} />
            </button>
        </div>
    )
}

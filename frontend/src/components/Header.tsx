import React from 'react'
import CerrarSecion from '@/components/cerrarSesion'

interface HeaderProps {
    title: string,
    subTitle?: string
}

export default function Header({ title, subTitle }: HeaderProps) {
    return (
        <header className="bg-gradient-to-r from-gray-50 to-purple-50 shadow-sm border-b border-gray-200 py-2">
            <div className="max-w-7xl mx-auto px-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-black mb-0.5">{title}</h1>
                        <p className="text-muted-foreground">{subTitle} </p>
                    </div>
                    <CerrarSecion />
                </div>
            </div>
        </header>
    )
}

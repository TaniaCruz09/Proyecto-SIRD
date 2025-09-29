import React from 'react'
import CerrarSecion from '@/components/cerrarSesion'
import Image from 'next/image'

interface HeaderProps {
    title: string,
    subTitle?: string
}

export default function Header({ title, subTitle }: HeaderProps) {
    return (
        <header className="bg-gradient-to-r from-gray-50 to-purple-50 shadow-sm border-b border-gray-200 py-2">
            <div className="max-w-7xl mx-auto px-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src="/logo_actual_instituto_ruben_dario.png"
                            alt="logo"
                            className="h-15 mr-3"
                        />

                        <div>
                            <h1 className="text-xl font-bold text-gray-800 mb-0.5 ">{title}</h1>
                            <p className="text-muted-foreground text-left">{subTitle}</p>
                        </div>
                    </div>

                    <CerrarSecion />
                </div>
            </div>
        </header>
    )
}

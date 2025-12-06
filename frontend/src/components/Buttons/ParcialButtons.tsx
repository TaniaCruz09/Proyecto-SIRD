"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import React from "react"

export const ParcialButtons = ({ esquelaId }: { esquelaId: number }) => {
    const router = useRouter()

    const botones = [
        { label: "1er Parcial", filter: "1" },
        { label: "2do Parcial", filter: "2" },
        { label: "1er Semestre", filter: "1S" },
        { label: "3er Parcial", filter: "3" },
        { label: "4to Parcial", filter: "4" },
        { label: "2do Semestre", filter: "2S" },
        { label: "Nota Final", filter: "F" },
    ]

    return (
        <div className="flex flex-wrap gap-2 my-4">
            {botones.map((b) => (
                <Button
                    key={b.filter}
                    onClick={() => router.push(`/esquela/${esquelaId}/${b.filter}`)}
                >
                    {b.label}
                </Button>
            ))}
        </div>
    )
}

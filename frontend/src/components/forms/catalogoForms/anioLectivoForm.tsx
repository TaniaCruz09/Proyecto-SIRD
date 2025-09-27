import { saveAnioLectivo } from "@/actions/catalogos/anioLectivoMethods";
import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Calendar, Plus } from "lucide-react"

interface AnioLectivoFormProps {
  onSuccess: () => void;
}

export function AnioLectivoForm({
  onSuccess,
}: AnioLectivoFormProps) {
  const [anioLectivo, setAnioLectivo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)

    const anioLectivoNumber = parseInt(anioLectivo, 10); // ✅ Convertir a número

    if (isNaN(anioLectivoNumber)) {
      console.error("El año lectivo no es un número válido");
      return;
    }

    try {
      await saveAnioLectivo({
        anio_lectivo: anioLectivoNumber, // ✅ Número, no string
      });

      onSuccess();
    } catch (error) {
      console.error("Error al guardar o actualizar año lectivo:", error);
    }
  };

  return (
    <div className="mt-5">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Calendar className="h-6 w-6" />
            Crear Nuevo Año Lectivo
          </CardTitle>
          <CardDescription>Después podrás agregar las organizaciones escolares que necesites</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="year" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Año Lectivo
              </Label>
              <input
                type="number"
                placeholder="Ingresa el año lectivo"
                value={anioLectivo}
                onChange={(e) => setAnioLectivo(e.target.value)}
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                required
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Plus className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Siguiente paso</h3>
                  <p className="text-sm text-muted-foreground">
                    Una vez creado el año lectivo, podrás agregar organizaciones escolares seleccionando:
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>
                      • <strong>Modalidad:</strong>
                    </li>
                    <li>
                      • <strong>Turno:</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading} variant={"custom"}>
              {isLoading ? "Creando Año Lectivo..." : "Crear Año Lectivo"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

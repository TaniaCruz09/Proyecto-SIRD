import { saveAnioLectivo, updateAnioLectivo } from "@/actions/catalogos/anioLectivoMethods";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { AnioLectivoPayload, AnioLectivo } from "@/interfaces";

interface AnioLectivoFormProps {
  defaultValues?: AnioLectivo | null;
  onSuccess: () => void;
}

export function AnioLectivoForm({ defaultValues, onSuccess }: AnioLectivoFormProps) {
  const [anioLectivo, setAnioLectivo] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEdit = Boolean(defaultValues?.id);

  // Rellenar campos si es edición
  useEffect(() => {
    if (defaultValues) {
      setAnioLectivo(defaultValues.anio_lectivo.toString());
      setIsActive(defaultValues.isActive);
    }
  }, [defaultValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const anioLectivoNumber = parseInt(anioLectivo, 10);

    if (isNaN(anioLectivoNumber)) {
      console.error("El año lectivo no es un número válido");
      setIsLoading(false);
      return;
    }

    const payload: AnioLectivoPayload = {
      anio_lectivo: anioLectivoNumber,
      isActive,
    };

    try {
      if (isEdit && defaultValues?.id) {
        await updateAnioLectivo(defaultValues.id, payload);
      } else {
        await saveAnioLectivo(payload);
      }
      onSuccess();
    } catch (error) {
      console.error("Error al guardar o actualizar año lectivo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-5 px-2 flex justify-center w-full max-w-lg">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Calendar className="h-6 w-6" />
            {isEdit ? "Editar Año Lectivo" : "Crear Nuevo Año Lectivo"}
          </CardTitle>
          <CardDescription>
            Después podrás agregar las organizaciones escolares que necesites para este año escolar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div className="space-y-2 w-full">
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

            {/* Toggle para activar / desactivar */}
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-xl w-full">
              <span className="font-medium mb-2 text-center w-full">Estado del Año Lectivo</span>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-16 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${isActive ? "bg-green-500" : "bg-gray-300"}`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isActive ? "translate-x-8" : "translate-x-0"}`}
                />
              </button>
              <span className="mt-2">{isActive ? "Activo" : "Inactivo"}</span>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading} variant={"custom"}>
              {isLoading ? (isEdit ? "Actualizando..." : "Creando Año Lectivo...") : isEdit ? "Actualizar" : "Crear Año Lectivo"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

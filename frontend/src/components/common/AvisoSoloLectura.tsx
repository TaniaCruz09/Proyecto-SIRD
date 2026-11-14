import { Lock } from 'lucide-react';

interface AvisoSoloLecturaProps {
  /** Año lectivo mostrado en el mensaje (ej. 2026). */
  anio?: number | string | null;
  className?: string;
}

/**
 * Aviso para las pantallas de un año lectivo inactivo: se puede ver todo,
 * pero los cambios están bloqueados.
 */
export function AvisoSoloLectura({ anio, className }: AvisoSoloLecturaProps) {
  return (
    <div
      className={`flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 ${className ?? ''}`}
    >
      <Lock className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        <span className="font-semibold">
          Año lectivo {anio ?? ''} inactivo: modo solo lectura.
        </span>{' '}
        Puedes ver la organización, los grupos, los docentes y los estudiantes,
        pero no crear ni modificar. Activa el año lectivo para editar.
      </p>
    </div>
  );
}

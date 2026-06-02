"use client";

import {
  getAnioLectivoCalendarizacion,
  upsertAnioLectivoCalendarizacion,
} from '@/actions/catalogos/anioLectivoCalendarizacionMethods';
import { getAnioLectivoById } from '@/actions/catalogos/anioLectivoMethods';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AnioLectivo, AnioLectivoCalendarizacionItem } from '@/interfaces';
import { ArrowLeft, CalendarDays, Save } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

function emptyItem(item: AnioLectivoCalendarizacionItem): AnioLectivoCalendarizacionItem {
  return {
    ...item,
    fecha_inicio: item.fecha_inicio ?? '',
    fecha_fin: item.fecha_fin ?? '',
    observacion: item.observacion ?? '',
  };
}

function getModalidadName(
  anioLectivo: AnioLectivo | null,
  modalidadId: number,
): string {
  if (!anioLectivo) return '';
  for (const org of anioLectivo.organizacionEscolar) {
    if (org.turno?.modalidad?.id === modalidadId) {
      return org.turno.modalidad.modalidad;
    }
  }
  return '';
}

export default function CalendarizacionAnioLectivoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const anioLectivoId = Number(searchParams.get('idAnioLectivo')) || 0;
  const modalidadId = Number(searchParams.get('modalidadId')) || 0;

  const [anioLectivo, setAnioLectivo] = useState<AnioLectivo | null>(null);
  const [items, setItems] = useState<AnioLectivoCalendarizacionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const modalidadNombre = useMemo(
    () => getModalidadName(anioLectivo, modalidadId),
    [anioLectivo, modalidadId],
  );

  useEffect(() => {
    if (!anioLectivoId || !modalidadId) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const [anioData, calendarizacionData] = await Promise.all([
          getAnioLectivoById(anioLectivoId),
          getAnioLectivoCalendarizacion(anioLectivoId, modalidadId),
        ]);

        setAnioLectivo(anioData ?? null);
        setItems((calendarizacionData ?? []).map(emptyItem));
      } catch (error) {
        console.error('Error al cargar calendarizacion:', error);
        toast({
          title: 'No se pudo cargar la calendarización',
          description: 'Revisa el año lectivo y la modalidad seleccionados e inténtalo de nuevo.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [anioLectivoId, modalidadId, toast]);

  const isAnioInactivo = anioLectivo ? !anioLectivo.isActive : false;

  const cortesProgramados = useMemo(
    () => items.filter((item) => item.fecha_inicio && item.fecha_fin).length,
    [items],
  );

  const handleChange = (
    corteId: number,
    field: 'fecha_inicio' | 'fecha_fin' | 'observacion',
    value: string,
  ) => {
    // Forzar el año al año lectivo en los inputs de fecha
    let finalValue = value;
    if (isAnioInactivo) return;

    if (field !== 'observacion' && anioLectivo?.anio_lectivo && value) {
      const parts = value.split('-');
      if (parts.length === 3) {
        finalValue = `${anioLectivo.anio_lectivo}-${parts[1]}-${parts[2]}`;
      }
    }

    setItems((current) =>
      current.map((item) =>
        item.corte_id === corteId
          ? { ...item, [field]: finalValue }
          : item,
      ),
    );
  };

  const handleSave = async () => {
    if (!anioLectivoId || !modalidadId) {
      return;
    }

    if (isAnioInactivo) {
      toast({
        title: 'Año lectivo inactivo',
        description: 'No se puede editar la calendarización de un año lectivo que está inactivo.',
        variant: 'destructive',
      });
      return;
    }

    const invalidItem = items.find((item) => {
      const fechaInicio = item.fecha_inicio ?? '';
      const fechaFin = item.fecha_fin ?? '';
      const hasInicio = Boolean(fechaInicio);
      const hasFin = Boolean(fechaFin);

      return (hasInicio && !hasFin) || (!hasInicio && hasFin) || (hasInicio && hasFin && fechaInicio > fechaFin);
    });

    if (invalidItem) {
      toast({
        title: 'Fechas inválidas',
        description: `Revisa las fechas del corte ${invalidItem.abreviatura || invalidItem.corte || invalidItem.corte_id}.`,
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      const saved = await upsertAnioLectivoCalendarizacion(anioLectivoId, modalidadId, {
        items: items.map((item) => ({
          corte_id: item.corte_id,
          modalidad_id: modalidadId,
          fecha_inicio: item.fecha_inicio || null,
          fecha_fin: item.fecha_fin || null,
          observacion: item.observacion || null,
        })),
      });

      setItems((saved ?? []).map(emptyItem));
      toast({
        title: 'Calendarización guardada',
        description: 'Las fechas de los cortes quedaron actualizadas.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error al guardar calendarizacion:', error);
      toast({
        title: 'No se pudo guardar',
        description: error instanceof Error ? error.message : 'Ocurrió un problema al actualizar la calendarización.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6">
      {isAnioInactivo && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
          <span className="font-semibold">Año lectivo inactivo.</span> No se puede editar la calendarización. Los campos están deshabilitados.
        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Calendarización</h1>
          <p className="text-sm text-slate-500">
            {modalidadNombre
              ? `Define las fechas de cada corte para la modalidad ${modalidadNombre}`
              : 'Define las fechas de cada corte para esta modalidad'}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/home')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a años lectivos
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isLoading || !anioLectivoId || !modalidadId || isAnioInactivo}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Guardando...' : 'Guardar calendarización'}
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="border-stone-200">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Resumen</CardTitle>
            <CardDescription>Estado actual de la calendarización para esta modalidad.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Año lectivo</p>
              <div className="mt-2 flex items-center gap-2">
                <p className="text-2xl font-semibold text-slate-950">{anioLectivo?.anio_lectivo ?? '--'}</p>
                {isAnioInactivo && (
                  <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">Inactivo</Badge>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Modalidad</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">{modalidadNombre || '--'}</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Cortes vinculados</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{items.length}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Cortes programados</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-900">{cortesProgramados}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
              <CalendarDays className="h-5 w-5" />
              Cortes y Fechas
            </CardTitle>
            <CardDescription>
              Si luego cambias los cortes del año, la calendarización de los cortes removidos se invalidará automáticamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-slate-500">Cargando calendarización...</p>
            ) : !anioLectivoId || !modalidadId ? (
              <p className="text-sm text-slate-500">Selecciona un año lectivo y una modalidad válidos para continuar.</p>
            ) : items.length === 0 ? (
              <p className="text-sm text-slate-500">Este año lectivo no tiene cortes asociados para calendarizar.</p>
            ) : isAnioInactivo ? (
              <div className="space-y-4">
                {items.map((item) => {
                  const isConfigured = Boolean(item.fecha_inicio && item.fecha_fin);

                  return (
                    <div key={item.corte_id} className="rounded-3xl border border-stone-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5">
                      <div className="flex flex-col gap-3 border-b border-stone-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-slate-950">{item.corte || `Corte ${item.corte_id}`}</p>
                          <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
                            {item.abreviatura || `ID ${item.corte_id}`}
                          </p>
                        </div>
                        <Badge className={isConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}>
                          {isConfigured ? 'Programado' : 'Pendiente'}
                        </Badge>
                      </div>

                      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,180px)_minmax(0,180px)_minmax(0,1fr)]">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Fecha inicio</label>
                          <Input
                            type="date"
                            value={item.fecha_inicio || ''}
                            disabled
                            className="opacity-60"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Fecha fin</label>
                          <Input
                            type="date"
                            value={item.fecha_fin || ''}
                            disabled
                            className="opacity-60"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Observación</label>
                          <textarea
                            value={item.observacion || ''}
                            disabled
                            className="min-h-24 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 opacity-60 cursor-not-allowed"
                            placeholder="Opcional: describe ajustes, observaciones o notas del corte"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const isConfigured = Boolean(item.fecha_inicio && item.fecha_fin);

                  return (
                    <div key={item.corte_id} className="rounded-3xl border border-stone-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5">
                      <div className="flex flex-col gap-3 border-b border-stone-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-slate-950">{item.corte || `Corte ${item.corte_id}`}</p>
                          <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
                            {item.abreviatura || `ID ${item.corte_id}`}
                          </p>
                        </div>
                        <Badge className={isConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}>
                          {isConfigured ? 'Programado' : 'Pendiente'}
                        </Badge>
                      </div>

                      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,180px)_minmax(0,180px)_minmax(0,1fr)]">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Fecha inicio</label>
                          <Input
                            type="date"
                            value={item.fecha_inicio || ''}
                            onChange={(event) => handleChange(item.corte_id, 'fecha_inicio', event.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Fecha fin</label>
                          <Input
                            type="date"
                            value={item.fecha_fin || ''}
                            onChange={(event) => handleChange(item.corte_id, 'fecha_fin', event.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Observación</label>
                          <textarea
                            value={item.observacion || ''}
                            onChange={(event) => handleChange(item.corte_id, 'observacion', event.target.value)}
                            className="min-h-24 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-stone-300"
                            placeholder="Opcional: describe ajustes, observaciones o notas del corte"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { saveAnioLectivo, updateAnioLectivo } from "@/actions/catalogos/anioLectivoMethods";
import { getCortesEvaluativos } from "@/actions/catalogos/corteEvaluativoMethods";
import { getTiposPeriodizacion } from "@/actions/catalogos/tipoPeriodizacionMethods";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AnioLectivo, AnioLectivoPayload, Corte, TipoPeriodizacion } from "@/interfaces";
import { Calendar, CheckCircle2, Layers3, SplitSquareVertical } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface AnioLectivoFormProps {
  defaultValues?: AnioLectivo | null;
  onSuccess: (anioLectivo: AnioLectivo) => void;
}

interface PreviewPeriodo {
  orden: number;
  nombre: string;
  abreviatura: string;
  cortes: Corte[];
}

export function AnioLectivoForm({ defaultValues, onSuccess }: AnioLectivoFormProps) {
  const { toast } = useToast();
  const submitLockRef = useRef(false);
  const [anioLectivo, setAnioLectivo] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [selectedPeriodoId, setSelectedPeriodoId] = useState("");
  const [tiposPeriodizacion, setTiposPeriodizacion] = useState<TipoPeriodizacion[]>([]);
  const [cortesDisponibles, setCortesDisponibles] = useState<Corte[]>([]);
  const [selectedCorteIds, setSelectedCorteIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isEdit = Boolean(defaultValues?.id);

  useEffect(() => {
    const loadCatalogos = async () => {
      try {
        const [tiposData, cortesData] = await Promise.all([
          getTiposPeriodizacion(),
          getCortesEvaluativos(),
        ]);

        setTiposPeriodizacion(Array.isArray(tiposData) ? (tiposData as TipoPeriodizacion[]) : []);
        setCortesDisponibles(
          (Array.isArray(cortesData) ? (cortesData as Corte[]) : []).sort((left, right) => left.id - right.id),
        );
      } catch (error) {
        console.error("Error al cargar catálogos del año lectivo:", error);
        toast({
          title: "No se pudieron cargar los catálogos",
          description: "Revisa los catálogos de periodización y cortes antes de continuar.",
          variant: "destructive",
        });
      }
    };

    loadCatalogos();
  }, [toast]);

  const tiposActivos = useMemo(
    () => tiposPeriodizacion.filter((tipo) => tipo.isActive ?? true),
    [tiposPeriodizacion],
  );

  const fallbackCortes = useMemo(() => {
    const periodos = defaultValues?.periodos ?? [];
    const map = new Map<number, Corte>();

    for (const corte of periodos.flatMap((periodo) => periodo.cortes ?? [])) {
      if (corte?.id && !map.has(corte.id)) {
        map.set(corte.id, corte);
      }
    }

    for (const corte of defaultValues?.cortes ?? []) {
      if (corte?.id && !map.has(corte.id)) {
        map.set(corte.id, corte);
      }
    }

    return map;
  }, [defaultValues]);

  useEffect(() => {
    if (!defaultValues) {
      return;
    }

    const periodos = defaultValues.periodos ?? [];
    const primerPeriodo = periodos[0];
    const selectedIds = [
      ...periodos.flatMap((periodo) => periodo.cortes ?? []),
      ...(defaultValues.cortes ?? []),
    ].map((corte) => corte.id);

    setAnioLectivo(String(defaultValues.anio_lectivo ?? ""));
    setIsActive(Boolean(defaultValues.isActive));
    setSelectedCorteIds(Array.from(new Set(selectedIds.filter((id) => Number.isFinite(id)))));

    if (primerPeriodo?.tipo_periodizacion_id) {
      setSelectedPeriodoId(String(primerPeriodo.tipo_periodizacion_id));
    }
  }, [defaultValues]);

  useEffect(() => {
    if (!defaultValues || selectedPeriodoId || tiposActivos.length === 0) {
      return;
    }

    const codigoPeriodo = defaultValues.periodos?.[0]?.tipo?.toUpperCase();
    if (!codigoPeriodo) {
      return;
    }

    const tipo = tiposActivos.find((item) => item.codigo === codigoPeriodo);
    if (tipo?.id) {
      setSelectedPeriodoId(String(tipo.id));
    }
  }, [defaultValues, selectedPeriodoId, tiposActivos]);

  useEffect(() => {
    if (defaultValues || selectedPeriodoId || tiposActivos.length === 0) {
      return;
    }

    const tipoSemestre = tiposActivos.find((tipo) => tipo.codigo?.toUpperCase() === "SEMESTRE");
    const tipoInicial = tipoSemestre ?? tiposActivos[0];

    if (tipoInicial?.id) {
      setSelectedPeriodoId(String(tipoInicial.id));
    }
  }, [defaultValues, selectedPeriodoId, tiposActivos]);

  const periodoSeleccionado = useMemo(
    () => tiposActivos.find((tipo) => String(tipo.id) === selectedPeriodoId) ?? null,
    [selectedPeriodoId, tiposActivos],
  );

  const totalPeriodos = periodoSeleccionado?.cantidad_periodos ?? 0;

  const selectedCortes = useMemo(
    () =>
      selectedCorteIds
        .map((id) => cortesDisponibles.find((corte) => corte.id === id) ?? fallbackCortes.get(id))
        .filter((corte): corte is Corte => Boolean(corte)),
    [cortesDisponibles, fallbackCortes, selectedCorteIds],
  );

  const previewPeriodos = useMemo<PreviewPeriodo[]>(() => {
    if (!periodoSeleccionado || totalPeriodos <= 0 || selectedCortes.length === 0) {
      return [];
    }

    const baseCortes = Math.floor(selectedCortes.length / totalPeriodos);
    const remainder = selectedCortes.length % totalPeriodos;
    let currentIndex = 0;

    return Array.from({ length: totalPeriodos }, (_, index) => {
      const orden = index + 1;
      const cortesEnPeriodo = baseCortes + (index < remainder ? 1 : 0);
      const cortes = selectedCortes.slice(currentIndex, currentIndex + cortesEnPeriodo);
      currentIndex += cortesEnPeriodo;

      return {
        orden,
        nombre: `${periodoSeleccionado.etiqueta_periodo || periodoSeleccionado.nombre || "Periodo"} ${orden}`,
        abreviatura: `${periodoSeleccionado.prefijo_abreviatura || periodoSeleccionado.codigo || "P"}${orden}`,
        cortes,
      };
    });
  }, [periodoSeleccionado, selectedCortes, totalPeriodos]);

  const tieneCortesSuficientes = !periodoSeleccionado || selectedCortes.length >= totalPeriodos;
  const configuracionValida = Boolean(periodoSeleccionado) && selectedCortes.length > 0 && tieneCortesSuficientes;

  const toggleCorteSelection = (corteId: number) => {
    setSelectedCorteIds((current) =>
      current.includes(corteId)
        ? current.filter((id) => id !== corteId)
        : [...current, corteId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitLockRef.current || isLoading) {
      return;
    }

    submitLockRef.current = true;
    setIsLoading(true);

    if (!/^\d{4}$/.test(anioLectivo)) {
      toast({
        title: "Año lectivo inválido",
        description: "Ingresa un año de 4 dígitos, por ejemplo 2026.",
        variant: "destructive",
      });
      submitLockRef.current = false;
      setIsLoading(false);
      return;
    }

    if (!configuracionValida || !periodoSeleccionado) {
      toast({
        title: "Configuración inválida",
        description: !tieneCortesSuficientes && totalPeriodos > 0
          ? `Debes seleccionar al menos ${totalPeriodos} cortes para ${periodoSeleccionado.nombre.toLowerCase()}.`
          : "Debes seleccionar un período del catálogo y al menos un corte.",
        variant: "destructive",
      });
      submitLockRef.current = false;
      setIsLoading(false);
      return;
    }

    const payload: AnioLectivoPayload = {
      anio_lectivo: Number(anioLectivo),
      isActive,
      tipo_periodizacion: periodoSeleccionado.codigo,
      cantidad_periodos: periodoSeleccionado.cantidad_periodos,
      cortes: selectedCortes.map((corte) => ({ id: corte.id })),
    };

    try {
      if (isEdit && defaultValues?.id) {
        const updatedAnioLectivo = await updateAnioLectivo(defaultValues.id, payload);
        toast({
          title: "Año lectivo actualizado",
          description: "El backend regeneró los períodos y distribuyó los cortes automáticamente.",
          variant: "success",
        });
        onSuccess(updatedAnioLectivo);
      } else {
        const createdAnioLectivo = await saveAnioLectivo(payload);
        toast({
          title: "Año lectivo creado",
          description: "El backend generó los períodos y repartió los cortes automáticamente.",
          variant: "success",
        });
        onSuccess(createdAnioLectivo);
      }
    } catch (error) {
      console.error("Error al guardar año lectivo:", error);
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar la configuración del año lectivo.",
        variant: "destructive",
      });
    } finally {
      submitLockRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-2 py-2 sm:px-4 sm:py-4">
      <Card className="overflow-hidden rounded-[30px] border border-stone-200 bg-white shadow-[0_28px_80px_-34px_rgba(15,23,42,0.35)]">
        <CardHeader className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_28%),linear-gradient(180deg,#fffaf0_0%,#ffffff_58%,#fcfcfd_100%)] px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-full border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-900">
                  <SplitSquareVertical className="h-3.5 w-3.5" />
                  Configuración por ID
                </Badge>
                <Badge variant="outline" className="rounded-full border-stone-200 bg-white px-3 py-1 text-stone-700">
                  <Layers3 className="h-3.5 w-3.5" />
                  {periodoSeleccionado ? `${totalPeriodos} períodos` : "0 períodos"}
                </Badge>
                <Badge variant="outline" className="rounded-full border-stone-200 bg-white px-3 py-1 text-stone-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {selectedCortes.length} cortes
                </Badge>
              </div>

              <div className="space-y-2">
                <CardTitle className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm sm:h-12 sm:w-12">
                    <Calendar className="h-5 w-5" />
                  </div>
                  {isEdit ? "Editar Año Lectivo" : "Nuevo Año Lectivo"}
                </CardTitle>
                <CardDescription className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px]">
                  Define el año lectivo, selecciona el tipo de periodización y revisa cómo el backend dividirá los cortes automáticamente entre sus períodos.
                </CardDescription>
              </div>
            </div>

            <div className="w-full rounded-[24px] border border-stone-200 bg-white/90 p-4 shadow-sm lg:max-w-xs">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Estado del año</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{isActive ? "Activo" : "Inactivo"}</p>
                  <p className="text-xs text-slate-500">Disponible para cambios posteriores</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative flex h-9 w-16 shrink-0 items-center rounded-full p-1 transition-colors duration-300 ${isActive ? "bg-emerald-500" : "bg-stone-300"}`}
                  aria-label="Cambiar estado del año lectivo"
                >
                  <div className={`h-7 w-7 rounded-full bg-white shadow-md transition-transform duration-300 ${isActive ? "translate-x-7" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="bg-[linear-gradient(180deg,#fcfcfd_0%,#f8fafc_100%)] px-4 py-4 sm:px-6 sm:py-6">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.8fr)]">
              <section className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 space-y-1">
                  <p className="text-base font-semibold text-slate-950">Configuración principal</p>
                  <p className="text-sm leading-6 text-slate-500">Primero selecciona el tipo de periodización, luego marca los cortes que el backend debe repartir entre sus períodos.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-sm font-medium text-slate-700">Año lectivo</Label>
                    <Input
                      id="year"
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="Ej: 2040"
                      value={anioLectivo}
                      onChange={(e) => setAnioLectivo(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className="h-12 rounded-2xl border-stone-200 bg-stone-50 text-base text-slate-900 shadow-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Tipo de periodización</Label>
                    <Select value={selectedPeriodoId} onValueChange={setSelectedPeriodoId}>
                      <SelectTrigger className="h-12 w-full rounded-2xl border-stone-200 bg-stone-50 text-left text-slate-900 shadow-none">
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposActivos.map((tipo) => (
                          <SelectItem key={tipo.id} value={String(tipo.id)}>
                            {tipo.nombre} · {tipo.cantidad_periodos} períodos
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Cortes del catálogo</Label>
                    <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-3 sm:p-4">
                      {cortesDisponibles.length > 0 ? (
                        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                          {cortesDisponibles.map((corte) => {
                            const isSelected = selectedCorteIds.includes(corte.id);

                            return (
                              <button
                                key={corte.id}
                                type="button"
                                onClick={() => toggleCorteSelection(corte.id)}
                                className={`rounded-2xl border px-4 py-3 text-left transition ${isSelected ? "border-slate-900 bg-slate-900 text-white shadow-sm" : "border-stone-200 bg-white text-slate-700 hover:border-stone-300 hover:bg-stone-100"}`}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold">{corte.corte}</p>
                                    <p className={`text-xs ${isSelected ? "text-slate-200" : "text-slate-500"}`}>
                                      ID {corte.id} · {corte.abreviatura}
                                    </p>
                                  </div>
                                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${isSelected ? "bg-white/15 text-white" : "bg-stone-100 text-stone-500"}`}>
                                    {isSelected ? "Asignado" : "Disponible"}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">No hay cortes disponibles en el catálogo.</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-stone-200 bg-[#fcfaf6] p-5 shadow-sm sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-950">Resumen rápido</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">Este año guardará el tipo de periodización y los cortes; el backend generará los períodos y hará la división automáticamente.</p>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs font-semibold ${configuracionValida ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {configuracionValida ? "Válido" : "Revisar"}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="rounded-2xl border border-stone-200 bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">Tipo</p>
                    <p className="mt-2 text-lg font-semibold leading-none text-slate-950">
                      {periodoSeleccionado ? `${periodoSeleccionado.nombre}` : "Sin seleccionar"}
                    </p>
                    <p className="mt-2 text-xs text-stone-500">
                      {periodoSeleccionado ? `${totalPeriodos} períodos automáticos` : "Selecciona un tipo del catálogo"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">Cortes</p>
                    <p className="mt-2 text-3xl font-semibold leading-none text-slate-950">{selectedCortes.length}</p>
                    <p className="mt-2 text-xs text-stone-500">
                      {periodoSeleccionado ? `Mínimo requerido: ${totalPeriodos}` : "Selecciona un tipo primero"}
                    </p>
                  </div>
                  <div className={`rounded-2xl border p-4 ${configuracionValida ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                    <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${configuracionValida ? "text-emerald-700" : "text-amber-700"}`}>Estado</p>
                    <p className={`mt-2 text-sm font-semibold leading-6 ${configuracionValida ? "text-emerald-900" : "text-amber-900"}`}>
                      {configuracionValida
                        ? "La configuración está lista para que el backend genere los períodos automáticamente."
                        : !tieneCortesSuficientes && totalPeriodos > 0
                          ? `Faltan cortes para repartir ${totalPeriodos} períodos.`
                          : "Debes elegir un tipo del catálogo y al menos un corte."}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <section className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Vista previa</h3>
                  <p className="text-sm leading-6 text-slate-500">Así dividirá el backend los cortes dentro de cada período generado automáticamente.</p>
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone-400">Generación automática</p>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {previewPeriodos.length > 0 ? (
                  previewPeriodos.map((periodo) => (
                    <div
                      key={periodo.orden}
                      className="rounded-[24px] border border-stone-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-sm sm:p-5"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                              {periodo.orden}
                            </span>
                            <div>
                              <p className="text-base font-semibold text-slate-950">{periodo.nombre}</p>
                              <p className="text-xs uppercase tracking-[0.16em] text-stone-500">{periodo.abreviatura}</p>
                            </div>
                          </div>
                        </div>

                        <Badge variant="outline" className="w-fit rounded-full border-stone-200 bg-stone-50 px-3 py-1 text-stone-700">
                          {periodo.cortes.length} cortes
                        </Badge>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2.5">
                        {periodo.cortes.length > 0 ? (
                          periodo.cortes.map((corte) => (
                            <span
                              key={`${periodo.orden}-${corte.id}`}
                              className="rounded-full border border-slate-200 bg-slate-950 px-3 py-1.5 text-xs font-semibold tracking-wide text-white"
                            >
                              {corte.corte} · ID {corte.id}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-stone-500">Este período no recibirá cortes con la selección actual.</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-dashed border-stone-200 bg-stone-50 p-5 text-sm text-stone-500 lg:col-span-2">
                    Selecciona un tipo de periodización y al menos un corte para ver cómo se generarán los períodos automáticamente.
                  </div>
                )}
              </div>
            </section>

            <div className="flex flex-col gap-4 border-t border-stone-200 pt-5 sm:pt-6 lg:flex-row lg:items-center lg:justify-between">
              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                El formulario ahora replica la regla del backend: guarda el tipo y los cortes seleccionados, y el servicio genera los períodos y reparte los cortes automáticamente.
              </p>
              <Button
                type="submit"
                className="h-12 w-full rounded-2xl bg-slate-950 px-6 text-sm font-semibold text-white hover:bg-slate-800 sm:w-auto sm:min-w-64"
                disabled={isLoading}
              >
                {isLoading ? (isEdit ? "Actualizando..." : "Creando Año Lectivo...") : isEdit ? "Actualizar Año Lectivo" : "Crear Año Lectivo"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

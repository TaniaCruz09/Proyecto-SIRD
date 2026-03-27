import { saveAnioLectivo, updateAnioLectivo } from "@/actions/catalogos/anioLectivoMethods";
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
import { AnioLectivo, AnioLectivoPayload, TipoPeriodizacion } from "@/interfaces";
import { Calendar, CheckCircle2, Layers3, SplitSquareVertical } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

type TipoPeriodizacionCode = string;

type PreviewPeriodo = {
  nombre: string;
  abreviatura: string;
  cortes: string[];
};

const resolveCantidadPeriodosFallback = (tipo: TipoPeriodizacionCode) => {
  switch (tipo.toUpperCase()) {
    case "SEMESTRE":
      return 2;
    case "CUATRIMESTRE":
      return 3;
    case "TRIMESTRE":
      return 4;
    case "BIMESTRE":
      return 6;
    default:
      return 1;
  }
};

const buildPeriodoNombre = (orden: number, etiquetaPeriodo?: string, prefijoAbreviatura?: string) => {
  const etiqueta = etiquetaPeriodo?.trim() || "Periodo";
  const prefijo = prefijoAbreviatura?.trim() || "P";

  return {
    nombre: `${etiqueta} ${orden}`,
    abreviatura: `${prefijo}${orden}`,
  };
};

const buildPreview = (
  totalPeriodos: number,
  cantidadCortes: number,
  etiquetaPeriodo?: string,
  prefijoAbreviatura?: string,
): PreviewPeriodo[] => {
  if (totalPeriodos <= 0) {
    return [];
  }

  const totalCortes = Number.isFinite(cantidadCortes) ? Math.max(0, cantidadCortes) : 0;

  const base = Math.floor(totalCortes / totalPeriodos);
  const remainder = totalCortes % totalPeriodos;
  let corteActual = 1;

  return Array.from({ length: totalPeriodos }, (_, index) => {
    const orden = index + 1;
    const naming = buildPeriodoNombre(orden, etiquetaPeriodo, prefijoAbreviatura);
    const cortesEnPeriodo = base + (index < remainder ? 1 : 0);
    const cortes = Array.from({ length: cortesEnPeriodo }, () => {
      const label = `C${corteActual}`;
      corteActual += 1;
      return label;
    });

    return {
      nombre: naming.nombre,
      abreviatura: naming.abreviatura,
      cortes,
    };
  });
};

interface AnioLectivoFormProps {
  defaultValues?: AnioLectivo | null;
  onSuccess: () => void;
}

export function AnioLectivoForm({ defaultValues, onSuccess }: AnioLectivoFormProps) {
  const { toast } = useToast();
  const submitLockRef = useRef(false);
  const [anioLectivo, setAnioLectivo] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [tipoPeriodizacion, setTipoPeriodizacion] = useState<TipoPeriodizacionCode>("SEMESTRE");
  const [tiposPeriodizacion, setTiposPeriodizacion] = useState<TipoPeriodizacion[]>([]);
  const [cantidadPeriodos, setCantidadPeriodos] = useState("2");
  const [cantidadCortes, setCantidadCortes] = useState("4");
  const [isLoading, setIsLoading] = useState(false);

  const isEdit = Boolean(defaultValues?.id);

  useEffect(() => {
    const loadTiposPeriodizacion = async () => {
      try {
        const data = await getTiposPeriodizacion();
        const tipos = Array.isArray(data) ? (data as TipoPeriodizacion[]) : [];
        setTiposPeriodizacion(tipos);
      } catch (error) {
        console.error("Error al cargar tipos de periodizacion:", error);
        toast({
          title: "No se pudieron cargar los tipos",
          description: "Se usarán valores predeterminados para continuar.",
          variant: "destructive",
        });
      }
    };

    loadTiposPeriodizacion();
  }, [toast]);

  const tiposActivos = useMemo(
    () => tiposPeriodizacion.filter((tipo) => tipo.isActive ?? true),
    [tiposPeriodizacion],
  );

  const tipoSeleccionado = useMemo(
    () => tiposActivos.find((tipo) => tipo.codigo === tipoPeriodizacion) ?? null,
    [tiposActivos, tipoPeriodizacion],
  );

  useEffect(() => {
    if (tiposActivos.length === 0) {
      return;
    }

    const existeTipoSeleccionado = tiposActivos.some((tipo) => tipo.codigo === tipoPeriodizacion);
    if (!existeTipoSeleccionado) {
      setTipoPeriodizacion(tiposActivos[0].codigo);
    }
  }, [tiposActivos, tipoPeriodizacion]);

  useEffect(() => {
    if (!defaultValues) {
      return;
    }

    const periodos = defaultValues.periodos ?? [];
    const tipoDesdeDefault = (defaultValues as unknown as { tipo_periodizacion?: string }).tipo_periodizacion;
    const tipo = (tipoDesdeDefault?.toUpperCase() || periodos[0]?.tipo?.toUpperCase() || "SEMESTRE") as TipoPeriodizacionCode;
    const totalCortes = periodos.reduce((acc, periodo) => acc + (periodo.cortes?.length ?? 0), 0);

    setAnioLectivo(String(defaultValues.anio_lectivo ?? ""));
    setIsActive(Boolean(defaultValues.isActive));
    setTipoPeriodizacion(tipo);
    setCantidadPeriodos(String(periodos.length || resolveCantidadPeriodosFallback(tipo)));
    setCantidadCortes(String(totalCortes || defaultValues.cortes?.length || 4));
  }, [defaultValues]);

  useEffect(() => {
    if (tipoPeriodizacion.toUpperCase() === "PERSONALIZADO") {
      return;
    }

    if (tipoSeleccionado?.cantidad_periodos) {
      setCantidadPeriodos(String(tipoSeleccionado.cantidad_periodos));
      return;
    }

    setCantidadPeriodos(String(resolveCantidadPeriodosFallback(tipoPeriodizacion)));
  }, [tipoPeriodizacion, tipoSeleccionado]);

  const cantidadPeriodosNumerica =
    tipoPeriodizacion.toUpperCase() === "PERSONALIZADO"
      ? Number.parseInt(cantidadPeriodos, 10) || 0
      : tipoSeleccionado?.cantidad_periodos || resolveCantidadPeriodosFallback(tipoPeriodizacion);
  const cantidadCortesNumerica = Number.parseInt(cantidadCortes, 10) || 0;

  const preview = useMemo(
    () =>
      buildPreview(
        cantidadPeriodosNumerica,
        cantidadCortesNumerica,
        tipoSeleccionado?.etiqueta_periodo,
        tipoSeleccionado?.prefijo_abreviatura,
      ),
    [cantidadPeriodosNumerica, cantidadCortesNumerica, tipoSeleccionado],
  );

  const totalPeriodos = preview.length;
  const configuracionValida = totalPeriodos > 0 && cantidadCortesNumerica >= totalPeriodos;

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

    const anioLectivoNumber = Number(anioLectivo);

    if (!configuracionValida) {
      toast({
        title: "Configuración inválida",
        description: "La cantidad de cortes debe ser mayor o igual a la cantidad de períodos.",
        variant: "destructive",
      });
      submitLockRef.current = false;
      setIsLoading(false);
      return;
    }

    const payload: AnioLectivoPayload = {
      anio_lectivo: anioLectivoNumber,
      isActive,
      tipo_periodizacion: tipoPeriodizacion,
      cantidad_periodos: tipoPeriodizacion.toUpperCase() === "PERSONALIZADO" ? cantidadPeriodosNumerica : undefined,
      cantidad_cortes: cantidadCortesNumerica,
    };

    try {
      if (isEdit && defaultValues?.id) {
        await updateAnioLectivo(defaultValues.id, payload);
        toast({
          title: "Año lectivo actualizado",
          description: "La distribución automática se actualizó correctamente.",
          variant: "success",
        });
      } else {
        await saveAnioLectivo(payload);
        toast({
          title: "Año lectivo creado",
          description: "La estructura del año lectivo se generó automáticamente.",
          variant: "success",
        });
      }

      onSuccess();
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
                  Configuración automática
                </Badge>
                <Badge variant="outline" className="rounded-full border-stone-200 bg-white px-3 py-1 text-stone-700">
                  <Layers3 className="h-3.5 w-3.5" />
                  {totalPeriodos} períodos
                </Badge>
                <Badge variant="outline" className="rounded-full border-stone-200 bg-white px-3 py-1 text-stone-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {cantidadCortesNumerica || 0} cortes
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
                  Define el año, el tipo de periodización y la cantidad total de cortes. El sistema se encarga de construir la estructura académica.
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
                  <div
                    className={`h-7 w-7 rounded-full bg-white shadow-md transition-transform duration-300 ${isActive ? "translate-x-7" : "translate-x-0"}`}
                  />
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
                  <p className="text-sm leading-6 text-slate-500">Una sola captura para describir cómo se divide el año escolar.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-sm font-medium text-slate-700">Año lectivo</Label>
                    <Input
                      id="year"
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="Ej: 2026"
                      value={anioLectivo}
                      onChange={(e) => setAnioLectivo(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className="h-12 rounded-2xl border-stone-200 bg-stone-50 text-base text-slate-900 shadow-none"
                      required
                    />
                  </div>

                  <div className="grid gap-4 xl:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Tipo de periodización</Label>
                      <Select value={tipoPeriodizacion} onValueChange={setTipoPeriodizacion}>
                        <SelectTrigger className="h-12 w-full rounded-2xl border-stone-200 bg-stone-50 text-left text-slate-900 shadow-none">
                          <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposActivos.length > 0 ? (
                            tiposActivos.map((tipo) => (
                              <SelectItem key={tipo.id} value={tipo.codigo}>
                                {tipo.nombre}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="SEMESTRE">Semestral</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Cantidad total de cortes</Label>
                      <Input
                        type="number"
                        min="1"
                        value={cantidadCortes}
                        onChange={(e) => setCantidadCortes(e.target.value)}
                        className="h-12 rounded-2xl border-stone-200 bg-stone-50 text-base text-slate-900 shadow-none"
                      />
                    </div>
                  </div>

                  {tipoPeriodizacion.toUpperCase() === "PERSONALIZADO" ? (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Cantidad de períodos</Label>
                      <Input
                        type="number"
                        min="1"
                        value={cantidadPeriodos}
                        onChange={(e) => setCantidadPeriodos(e.target.value)}
                        className="h-12 rounded-2xl border-stone-200 bg-stone-50 text-base text-slate-900 shadow-none"
                      />
                    </div>
                  ) : null}
                </div>
              </section>

              <section className="rounded-[28px] border border-stone-200 bg-[#fcfaf6] p-5 shadow-sm sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-950">Resumen rápido</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">Validación automática de la configuración.</p>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs font-semibold ${configuracionValida ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {configuracionValida ? "Válido" : "Revisar"}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="rounded-2xl border border-stone-200 bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">Períodos</p>
                    <p className="mt-2 text-3xl font-semibold leading-none text-slate-950">{totalPeriodos}</p>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">Cortes</p>
                    <p className="mt-2 text-3xl font-semibold leading-none text-slate-950">{cantidadCortesNumerica || 0}</p>
                  </div>
                  <div className={`rounded-2xl border p-4 ${configuracionValida ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                    <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${configuracionValida ? "text-emerald-700" : "text-amber-700"}`}>Estado</p>
                    <p className={`mt-2 text-sm font-semibold leading-6 ${configuracionValida ? "text-emerald-900" : "text-amber-900"}`}>
                      {configuracionValida ? "La distribución puede generarse correctamente." : "La cantidad de cortes debe cubrir todos los períodos."}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <section className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Vista previa de distribución</h3>
                  <p className="text-sm leading-6 text-slate-500">Así quedarán organizados los cortes dentro de cada período.</p>
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone-400">Generación automática</p>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {preview.map((periodo, index) => (
                  <div key={periodo.nombre} className="rounded-[24px] border border-stone-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                            {index + 1}
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
                      {periodo.cortes.map((corte) => (
                        <span
                          key={`${periodo.nombre}-${corte}`}
                          className="rounded-full border border-slate-200 bg-slate-950 px-3 py-1.5 text-xs font-semibold tracking-wide text-white"
                        >
                          {corte}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex flex-col gap-4 border-t border-stone-200 pt-5 sm:pt-6 lg:flex-row lg:items-center lg:justify-between">
              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                El sistema crea los cortes automáticamente y los distribuye de la forma más equilibrada posible entre los períodos definidos.
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

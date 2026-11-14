import {
  evaluarFechaCorte,
  formatearFechaCorte,
  mensajeEstadoCorte,
} from './corte-estado.helper';

describe('corte-estado.helper', () => {
  describe('evaluarFechaCorte', () => {
    it('bloquea cuando no hay fechas configuradas', () => {
      expect(evaluarFechaCorte(null, null, '2026-11-12')).toEqual({
        estado: 'unconfigured',
        editablePorFecha: false,
        mensajeFecha: 'Sin fechas asignadas en calendarización',
      });
    });

    it('bloquea cuando el corte no está habilitado en la calendarización', () => {
      expect(evaluarFechaCorte('2026-11-12', '2026-11-15', '2026-11-13', false)).toEqual({
        estado: 'unconfigured',
        editablePorFecha: false,
        mensajeFecha: 'Corte no habilitado en la calendarización',
      });
    });

    it('bloquea cortes que aún no inician', () => {
      expect(evaluarFechaCorte('2026-11-20', '2026-11-25', '2026-11-12')).toEqual({
        estado: 'future',
        editablePorFecha: false,
        mensajeFecha: 'Aún no inicia',
      });
    });

    it('bloquea cortes cerrados por fecha', () => {
      expect(evaluarFechaCorte('2026-11-10', '2026-11-11', '2026-11-12')).toEqual({
        estado: 'closed',
        editablePorFecha: false,
        mensajeFecha: 'Fecha cerrada',
      });
    });

    it('abre el corte dentro del rango, incluidos los extremos', () => {
      expect(evaluarFechaCorte('2026-11-12', '2026-11-15', '2026-11-12').estado).toBe('open');
      expect(evaluarFechaCorte('2026-11-12', '2026-11-15', '2026-11-15').estado).toBe('open');
      expect(evaluarFechaCorte('2026-11-12', '2026-11-15', '2026-11-13')).toEqual({
        estado: 'open',
        editablePorFecha: true,
        mensajeFecha: 'En fecha',
      });
    });
  });

  describe('mensajeEstadoCorte', () => {
    const base = {
      anioActivo: true,
      estado: 'open' as const,
      mensajeFecha: 'En fecha',
      secuenciaCompleta: true,
      completo: false,
    };

    it('marca solo consulta con el año inactivo', () => {
      expect(mensajeEstadoCorte({ ...base, anioActivo: false })).toBe('Solo consulta');
    });

    it('pide completar el corte anterior', () => {
      expect(mensajeEstadoCorte({ ...base, secuenciaCompleta: false })).toBe(
        'Completa el corte anterior',
      );
    });

    it('distingue completado de en progreso', () => {
      expect(mensajeEstadoCorte({ ...base, completo: true })).toBe('Completado');
      expect(mensajeEstadoCorte(base)).toBe('En progreso');
    });

    it('usa el mensaje de fecha cuando el corte no está abierto', () => {
      expect(
        mensajeEstadoCorte({ ...base, estado: 'closed', mensajeFecha: 'Fecha cerrada' }),
      ).toBe('Fecha cerrada');
      expect(
        mensajeEstadoCorte({ ...base, estado: 'future', mensajeFecha: 'Aún no inicia' }),
      ).toBe('Aún no inicia');
    });
  });

  describe('formatearFechaCorte', () => {
    it('convierte a dd/mm/aaaa', () => {
      expect(formatearFechaCorte('2026-11-10')).toBe('10/11/2026');
      expect(formatearFechaCorte('sin-fecha')).toBe('sin-fecha');
    });
  });
});

import { calcularPromedios, periodosDeTrabajo, promedio } from './promedios.helper';

const CORTES = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

const PERIODOS = [
  { id: 5, nombre: 'semestral 1', orden: 1, cortes: [{ id: 1 }, { id: 2 }] },
  { id: 6, nombre: 'semestral 2', orden: 2, cortes: [{ id: 3 }, { id: 4 }] },
];

describe('promedios.helper', () => {
  describe('promedio', () => {
    it('redondea el promedio', () => {
      expect(promedio([56, 0])).toBe(28);
      expect(promedio([45, 0])).toBe(23);
      expect(promedio([75, 80])).toBe(78);
    });

    it('devuelve 0 sin valores válidos', () => {
      expect(promedio([])).toBe(0);
      expect(promedio([Number.NaN])).toBe(0);
    });
  });

  describe('calcularPromedios', () => {
    it('calcula período y final con los cortes faltantes en 0', () => {
      const valores: Record<number, number> = { 1: 56, 2: 100 };
      const resultado = calcularPromedios(CORTES, PERIODOS, (id) => valores[id] ?? 0);

      expect(resultado.porPeriodo.get(5)).toBe(78);
      expect(resultado.porPeriodo.get(6)).toBe(0);
      expect(resultado.final).toBe(39);
    });

    it('promedia los períodos para la nota final', () => {
      const valores: Record<number, number> = { 1: 0, 2: 90, 3: 80, 4: 80 };
      const resultado = calcularPromedios(CORTES, PERIODOS, (id) => valores[id] ?? 0);

      expect(resultado.porPeriodo.get(5)).toBe(45);
      expect(resultado.porPeriodo.get(6)).toBe(80);
      expect(resultado.final).toBe(63);
    });

    it('usa el promedio de todos los cortes cuando hay un solo período', () => {
      const periodos = periodosDeTrabajo([], CORTES);
      const valores: Record<number, number> = { 1: 60 };

      const resultado = calcularPromedios(CORTES, periodos, (id) => valores[id] ?? 0);

      expect(periodos).toHaveLength(1);
      expect(resultado.porPeriodo.get(1)).toBe(15);
      expect(resultado.final).toBe(15);
    });

    it('devuelve final 0 sin períodos', () => {
      const resultado = calcularPromedios(CORTES, [], () => 80);
      expect(resultado.final).toBe(0);
    });
  });
});

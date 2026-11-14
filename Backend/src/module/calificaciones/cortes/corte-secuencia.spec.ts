import {
  buildCortesFuente,
  buildPeriodosFuente,
  nombreCorte,
  sortCortes,
  uniqueCortes,
} from './corte-secuencia';

const ANIO_CON_PERIODOS = {
  periodosLectivos: [
    {
      id: 6,
      nombre: 'semestral 2',
      orden: 2,
      cortesPeriodo: [
        { orden: 2, corte: { id: 4, abreviatura: 'C4' } },
        { orden: 1, corte: { id: 3, abreviatura: 'C3' } },
      ],
    },
    {
      id: 5,
      nombre: 'semestral 1',
      orden: 1,
      cortesPeriodo: [
        { orden: 2, corte: { id: 2, abreviatura: 'C2' } },
        { orden: 1, corte: { id: 1, abreviatura: 'C1' } },
      ],
    },
  ],
  cortesAnioLectivo: [],
};

const ANIO_SIN_PERIODOS = {
  periodosLectivos: [],
  cortesAnioLectivo: [
    { corte: { id: 2, abreviatura: 'II corte' } },
    { corte: { id: 1, abreviatura: 'I corte' } },
  ],
};

describe('corte-secuencia', () => {
  describe('buildPeriodosFuente', () => {
    it('ordena períodos y cortes por su orden', () => {
      const periodos = buildPeriodosFuente(ANIO_CON_PERIODOS);

      expect(periodos.map((periodo) => periodo.id)).toEqual([5, 6]);
      expect(periodos[0].cortes.map((corte) => corte.id)).toEqual([1, 2]);
      expect(periodos[1].cortes.map((corte) => corte.id)).toEqual([3, 4]);
    });

    it('devuelve vacío cuando el año no tiene períodos', () => {
      expect(buildPeriodosFuente(ANIO_SIN_PERIODOS)).toEqual([]);
      expect(buildPeriodosFuente(undefined)).toEqual([]);
    });
  });

  describe('buildCortesFuente', () => {
    it('sigue el orden de los períodos', () => {
      const periodos = buildPeriodosFuente(ANIO_CON_PERIODOS);

      expect(buildCortesFuente(ANIO_CON_PERIODOS, periodos).map((corte) => corte.id)).toEqual([
        1, 2, 3, 4,
      ]);
    });

    it('usa los cortes del año cuando no hay períodos', () => {
      expect(buildCortesFuente(ANIO_SIN_PERIODOS, []).map((corte) => corte.id)).toEqual([1, 2]);
    });

    it('usa las notas existentes como último recurso', () => {
      const cortes = buildCortesFuente(
        { periodosLectivos: [], cortesAnioLectivo: [] },
        [],
        [{ id: 9 }, undefined, { id: 7 }],
      );

      expect(cortes.map((corte) => corte.id)).toEqual([7, 9]);
    });
  });

  describe('sortCortes / uniqueCortes', () => {
    it('ordena por orden y desempata por id', () => {
      const cortes = sortCortes([
        { id: 3, orden: 1 },
        { id: 1 },
        { id: 2, orden: 1 },
      ]);

      expect(cortes.map((corte) => corte.id)).toEqual([2, 3, 1]);
    });

    it('elimina cortes duplicados', () => {
      expect(uniqueCortes([{ id: 1 }, { id: 1 }, { id: 2 }]).map((corte) => corte.id)).toEqual([
        1, 2,
      ]);
    });
  });

  describe('nombreCorte', () => {
    it('prefiere la abreviatura y cae al nombre', () => {
      expect(nombreCorte({ id: 1, abreviatura: 'II corte' })).toBe('II corte');
      expect(nombreCorte({ id: 2, abreviatura: '  ', corte: 'segundo corte' })).toBe(
        'segundo corte',
      );
      expect(nombreCorte({ id: 3 })).toBe('corte 3');
      expect(nombreCorte(null)).toBe('corte anterior');
    });
  });
});

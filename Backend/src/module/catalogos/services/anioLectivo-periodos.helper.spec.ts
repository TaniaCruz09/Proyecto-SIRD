import { BadRequestException } from '@nestjs/common';
import {
  construirPlanDesdeCortes,
  normalizarCorteIds,
  TipoPeriodizacionConfig,
  validarPlanExplicito,
} from './anioLectivo-periodos.helper';

const SEMESTRAL: TipoPeriodizacionConfig = {
  tipo: 'Semestral',
  totalPeriodos: 2,
  etiquetaPeriodo: 'Semestral',
  prefijoAbreviatura: 'S',
  tipoPeriodizacionId: 1,
};

const TRIMESTRAL: TipoPeriodizacionConfig = {
  tipo: 'Trimestral',
  totalPeriodos: 3,
  etiquetaPeriodo: 'Trimestral',
  prefijoAbreviatura: 'T',
};

describe('anioLectivo-periodos.helper', () => {
  describe('normalizarCorteIds', () => {
    it('acepta objetos y números, elimina duplicados e inválidos', () => {
      expect(
        normalizarCorteIds([{ id: 3 }, 1, { id: '2' }, { id: 3 }, null as any, -1, 0]),
      ).toEqual([3, 1, 2]);
    });

    it('devuelve vacío sin datos', () => {
      expect(normalizarCorteIds(undefined)).toEqual([]);
      expect(normalizarCorteIds(null)).toEqual([]);
    });
  });

  describe('construirPlanDesdeCortes', () => {
    it('reparte 4 cortes en 2 semestres', () => {
      const plan = construirPlanDesdeCortes(SEMESTRAL, [1, 2, 3, 4]);

      expect(plan.totalPeriodos).toBe(2);
      expect(plan.totalCortes).toBe(4);
      expect(plan.periodos.map((p) => p.orden)).toEqual([1, 2]);
      expect(plan.periodos[0]).toMatchObject({
        nombre: 'Semestral 1',
        abreviatura: 'S1',
        cortes: [
          { id: 1, orden: 1 },
          { id: 2, orden: 2 },
        ],
      });
      expect(plan.periodos[1].cortes).toEqual([
        { id: 3, orden: 1 },
        { id: 4, orden: 2 },
      ]);
    });

    it('reparte el excedente desde el primer período', () => {
      const plan = construirPlanDesdeCortes(SEMESTRAL, [1, 2, 3, 4, 5]);

      expect(plan.periodos[0].cortes).toHaveLength(3);
      expect(plan.periodos[1].cortes).toHaveLength(2);
    });

    it('reparte 5 cortes en 3 trimestres', () => {
      const plan = construirPlanDesdeCortes(TRIMESTRAL, [1, 2, 3, 4, 5]);

      expect(plan.periodos.map((p) => p.cortes.length)).toEqual([2, 2, 1]);
      expect(plan.periodos[2].cortes).toEqual([{ id: 5, orden: 1 }]);
    });

    it('rechaza combinaciones inválidas', () => {
      expect(() => construirPlanDesdeCortes(SEMESTRAL, [])).toThrow(BadRequestException);
      expect(() => construirPlanDesdeCortes(SEMESTRAL, [])).toThrow(
        /al menos un corte/i,
      );

      expect(() => construirPlanDesdeCortes(SEMESTRAL, [1])).toThrow(
        /al menos 2 cortes/i,
      );

      expect(() =>
        construirPlanDesdeCortes(
          { ...SEMESTRAL, totalPeriodos: 0 },
          [1, 2],
        ),
      ).toThrow(/cantidad de periodos/i);
    });

    it('ignora cortes repetidos al distribuir', () => {
      const plan = construirPlanDesdeCortes(SEMESTRAL, [1, 1, 2]);
      expect(plan.totalCortes).toBe(2);
    });
  });

  describe('validarPlanExplicito', () => {
    it('normaliza nombres y orden', () => {
      const plan = validarPlanExplicito(SEMESTRAL, [
        { cortes: [{ id: 1 }, { id: 2 }] },
        { cortes: [{ id: 3 }, { id: 4 }] },
      ]);

      expect(plan.totalPeriodos).toBe(2);
      expect(plan.periodos[0]).toMatchObject({ orden: 1, nombre: 'Semestral 1' });
      expect(plan.periodos[1].cortes).toEqual([
        { id: 3, orden: 1 },
        { id: 4, orden: 2 },
      ]);
    });

    it('rechaza cantidad de periodos distinta al tipo', () => {
      expect(() =>
        validarPlanExplicito(SEMESTRAL, [{ cortes: [{ id: 1 }] }]),
      ).toThrow(/requiere 2 periodos/i);
    });

    it('rechaza periodos vacíos', () => {
      expect(() =>
        validarPlanExplicito(SEMESTRAL, [
          { cortes: [{ id: 1 }] },
          { cortes: [] },
        ]),
      ).toThrow(/no tiene cortes/i);
    });

    it('rechaza cortes repetidos entre periodos', () => {
      expect(() =>
        validarPlanExplicito(SEMESTRAL, [
          { cortes: [{ id: 1 }] },
          { cortes: [{ id: 1 }] },
        ]),
      ).toThrow(/repetido/i);
    });

    it('rechaza orden repetido', () => {
      expect(() =>
        validarPlanExplicito(SEMESTRAL, [
          { orden: 1, cortes: [{ id: 1 }] },
          { orden: 1, cortes: [{ id: 2 }] },
        ]),
      ).toThrow(/orden repetido/i);
    });

    it('exige que los cortes coincidan con la lista del año', () => {
      expect(() =>
        validarPlanExplicito(
          SEMESTRAL,
          [{ cortes: [{ id: 1 }] }, { cortes: [{ id: 2 }] }],
          [1, 2, 3],
        ),
      ).toThrow(/no estan asignados a ningun periodo/i);

      expect(() =>
        validarPlanExplicito(
          TRIMESTRAL,
          [
            { cortes: [{ id: 1 }] },
            { cortes: [{ id: 2 }] },
            { cortes: [{ id: 9 }] },
          ],
          [1, 2],
        ),
      ).toThrow(/no pertenecen a la lista/i);
    });
  });
});

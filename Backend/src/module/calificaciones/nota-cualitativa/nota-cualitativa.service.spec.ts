// La entidad arrastra imports circulares del proyecto; en pruebas basta un stub.
jest.mock('../../catalogos/entities/notaCualitativa.entity', () => ({
  NotaCualitativa: class NotaCualitativa {},
}));

import type { Repository } from 'typeorm';
import type { NotaCualitativa } from '../../catalogos/entities/notaCualitativa.entity';
import {
  ABREVIATURA_SIN_NOTA,
  NotaCualitativaService,
  RangoCualitativo,
} from './nota-cualitativa.service';

const RANGOS: RangoCualitativo[] = [
  { id: 1, abreviatura: 'AF', rango_menor: 0, rango_mayor: 59 },
  { id: 2, abreviatura: 'AS', rango_menor: 60, rango_mayor: 75 },
  { id: 3, abreviatura: 'AS', rango_menor: 75, rango_mayor: 85 },
  { id: 4, abreviatura: 'AA', rango_menor: 85, rango_mayor: 100 },
];

function createService(notas: Partial<NotaCualitativa>[]) {
  const find = jest.fn().mockResolvedValue(notas);
  const repo = { find } as unknown as Repository<NotaCualitativa>;

  return { service: new NotaCualitativaService(repo), find };
}

describe('NotaCualitativaService', () => {
  describe('cualificar', () => {
    let service: NotaCualitativaService;

    beforeEach(() => {
      service = createService([]).service;
    });

    it('devuelve el rango que contiene la nota', () => {
      expect(service.cualificar(56, RANGOS)).toEqual({ cual: 'AF', cualitativaId: 1 });
      expect(service.cualificar(70, RANGOS)).toEqual({ cual: 'AS', cualitativaId: 2 });
      expect(service.cualificar(90, RANGOS)).toEqual({ cual: 'AA', cualitativaId: 4 });
    });

    it('usa el primer rango del catálogo cuando hay solapamiento', () => {
      expect(service.cualificar(75, RANGOS)).toEqual({ cual: 'AS', cualitativaId: 2 });
    });

    it('devuelve AI cuando no hay rango o el valor no es válido', () => {
      expect(service.cualificar(120, RANGOS)).toEqual({
        cual: ABREVIATURA_SIN_NOTA,
        cualitativaId: null,
      });
      expect(service.cualificar(Number.NaN, RANGOS)).toEqual({
        cual: ABREVIATURA_SIN_NOTA,
        cualitativaId: null,
      });
      expect(service.cualificar(50, [])).toEqual({
        cual: ABREVIATURA_SIN_NOTA,
        cualitativaId: null,
      });
    });
  });

  describe('getRangos', () => {
    it('ordena por id y descarta rangos incompletos', async () => {
      const { service, find } = createService([
        { id: 4, abreviatura: 'AA', rango_menor: 85, rango_mayor: 100 },
        { id: 2, abreviatura: 'AS', rango_menor: null, rango_mayor: 75 },
        { id: 1, abreviatura: 'AF', rango_menor: 0, rango_mayor: 59 },
      ]);

      const rangos = await service.getRangos();

      expect(find).toHaveBeenCalledWith({
        where: { deleted_at: expect.anything() },
        order: { id: 'ASC' },
      });
      expect(rangos.map((rango) => rango.id)).toEqual([4, 1]);
    });
  });

  describe('derivar', () => {
    it('deriva la nota cualitativa desde la cuantitativa', async () => {
      const { service } = createService([
        { id: 1, abreviatura: 'AF', rango_menor: 0, rango_mayor: 59 },
        { id: 4, abreviatura: 'AA', rango_menor: 85, rango_mayor: 100 },
      ]);

      await expect(service.derivar(90)).resolves.toEqual({ cual: 'AA', cualitativaId: 4 });
      await expect(service.derivar(10)).resolves.toEqual({ cual: 'AF', cualitativaId: 1 });
      await expect(service.derivar(70)).resolves.toEqual({
        cual: ABREVIATURA_SIN_NOTA,
        cualitativaId: null,
      });
    });
  });
});

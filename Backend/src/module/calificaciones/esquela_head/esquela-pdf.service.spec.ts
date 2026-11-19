import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { Centro } from '../../centroEducativo/entities/centro.entity';
import { EsquelaResumen, EsquelaResumenService } from './esquela-resumen.service';
import { EsquelaPdfService } from './esquela-pdf.service';

describe('EsquelaPdfService', () => {
  let service: EsquelaPdfService;
  let resumenActual: EsquelaResumen;

  const resumen: EsquelaResumen = {
    esquelaHeadId: 7,
    grupo: {
      id: 12,
      grado: 'Séptimo',
      seccion: 'A',
      turno: 'Matutino',
      modalidad: 'Regular',
      anioLectivo: 2026,
      docenteGuia: 'Docente Ejemplo',
    },
    cortes: [{ id: 1, corte: 'Corte 1', abreviatura: 'C1', orden: 1 }],
    periodos: [{ id: 3, nombre: 'Semestre 1', orden: 1, cortes: [1] }],
    asignaturas: [{ id: 5, asignatura: 'Matemática', docente: 'Docente Ejemplo' }],
    estudiantes: [
      {
        id: 11,
        name: 'Ana',
        lastName: 'Ejemplo',
        studentCode: 'A-001',
        profileImage: null,
        gender: 'F',
        activoEnGrupo: true,
        asignaturas: [
          {
            asignaturaId: 5,
            asignatura: 'Matemática',
            docente: 'Docente Ejemplo',
            cortes: [
              {
                corteId: 1,
                registrado: true,
                cuant: 85,
                cual: 'AA',
                cualitativaId: 1,
              },
            ],
            periodos: [
              {
                periodoId: 3,
                nombre: 'Semestre 1',
                orden: 1,
                cortes: [1],
                cuant: 85,
                cual: 'AA',
                cualitativaId: 1,
              },
            ],
            final: { cuant: 85, cual: 'AA', cualitativaId: 1 },
          },
        ],
        promedioGeneral: { cuant: 85, cual: 'AA', cualitativaId: 1 },
      },
    ],
  };

  beforeEach(async () => {
    resumenActual = resumen;
    const moduleRef = await Test.createTestingModule({
      providers: [
        EsquelaPdfService,
        {
          provide: EsquelaResumenService,
          useValue: { build: jest.fn(() => Promise.resolve(resumenActual)) },
        },
        {
          provide: getRepositoryToken(Centro),
          useValue: { find: jest.fn().mockResolvedValue([]) },
        },
      ],
    }).compile();

    service = moduleRef.get(EsquelaPdfService);
  });

  it.each(['ALL', 'FINAL', 'C-1', 'S-3'])(
    'genera un PDF para la vista %s',
    async (vista) => {
      const pdf = await service.build(7, vista);

      expect(pdf.subarray(0, 5).toString('ascii')).toBe('%PDF-');
    },
  );

  it('rechaza una vista que no pertenece a la esquela', async () => {
    await expect(service.build(7, 'C-999')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

    it('envuelve las materias sobrantes en otra fila de la misma página', async () => {
      const materias = Array.from({ length: 7 }, (_, index) => ({
        id: 5 + index,
        asignatura: `Materia ${index + 1}`,
        docente: 'Docente Ejemplo',
      }));
      const asignaturaBase = resumen.estudiantes[0].asignaturas[0];
      resumenActual = {
        ...resumen,
        asignaturas: materias,
        estudiantes: [
          {
            ...resumen.estudiantes[0],
            asignaturas: materias.map((materia) => ({
              ...asignaturaBase,
              asignaturaId: materia.id,
              asignatura: materia.asignatura,
            })),
          },
        ],
      };

      const pdf = await service.build(7, 'C-1');
      const pageCount = (pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) ?? []).length;

      expect(pageCount).toBe(1);
    });
});

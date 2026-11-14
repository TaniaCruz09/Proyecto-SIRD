import { GrupoResumen } from './interfaces/promocion.interfaces';
import { elegirGrupoSugerido, etiquetaGrupo } from './promocion.helpers';

const grupo = (id: number, seccionId: number | null, seccion: string): GrupoResumen => ({
  id,
  label: `${seccion}`,
  gradoId: 2,
  grado: 'Octavo',
  ordenGrado: 2,
  seccionId,
  seccion,
  turno: 'matutino',
  modalidad: 'Modalidad regular',
});

describe('promocion helpers', () => {
  describe('elegirGrupoSugerido', () => {
    const disponibles = [grupo(10, 1, 'A'), grupo(11, 2, 'B')];

    it('elige el grupo de la misma sección', () => {
      expect(elegirGrupoSugerido(disponibles, 2)?.id).toBe(11);
    });

    it('usa el primer grupo cuando no existe la misma sección', () => {
      expect(elegirGrupoSugerido(disponibles, 3)?.id).toBe(10);
    });

    it('no sugiere nada si no hay grupos disponibles', () => {
      expect(elegirGrupoSugerido([], 1)).toBeNull();
    });
  });

  describe('etiquetaGrupo', () => {
    it('incluye turno y modalidad cuando existen', () => {
      expect(etiquetaGrupo('Octavo', 'A', 'matutino', 'Modalidad regular')).toBe(
        'Octavo A · matutino · Modalidad regular',
      );
    });

    it('omite la modalidad cuando no existe', () => {
      expect(etiquetaGrupo('Octavo', 'A', 'matutino')).toBe('Octavo A · matutino');
    });

    it('omite turno y modalidad cuando no existen', () => {
      expect(etiquetaGrupo('Octavo', 'A')).toBe('Octavo A');
    });

    it('recorta los espacios sobrantes que traen los catálogos', () => {
      expect(etiquetaGrupo('Octavo', 'A', ' matutino', 'Modalidad regular ')).toBe(
        'Octavo A · matutino · Modalidad regular',
      );
    });
  });
});

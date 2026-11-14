import { SetMetadata } from '@nestjs/common';

export const ADMIN_WRITE_KEY = 'adminWrite';

/**
 * Exige rol Admin únicamente en operaciones de escritura (POST/PUT/PATCH/DELETE).
 * Las lecturas (GET) siguen disponibles para cualquier usuario autenticado,
 * de modo que el área de docentes puede seguir consultando catálogos.
 */
export const AdminWrite = () => SetMetadata(ADMIN_WRITE_KEY, true);

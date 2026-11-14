/**
 * Validación mínima de variables de entorno al arrancar.
 * Falla rápido con un mensaje claro en lugar de romper en el primer login.
 */
export function validateEnv(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const errors: string[] = [];

  if (!config.JWT_SECRET) {
    errors.push('JWT_SECRET es obligatorio');
  }

  const hasDatabaseUrl = Boolean(config.DATABASE_URL);
  const hasDatabaseParts =
    Boolean(config.HOST) && Boolean(config.DATA_BASE_NAME);

  if (!hasDatabaseUrl && !hasDatabaseParts) {
    errors.push(
      'Define DATABASE_URL o las variables HOST / DATA_BASE_NAME para conectar la base de datos',
    );
  }

  if (errors.length > 0) {
    throw new Error(`Configuración inválida: ${errors.join('; ')}`);
  }

  return config;
}

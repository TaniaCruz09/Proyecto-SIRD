import 'dotenv/config';
import { createTransport } from 'nodemailer';

/**
 * Comprueba las credenciales SMTP sin enviar ningún correo.
 *
 *   npm run mail:check
 *
 * Lee las mismas variables que la API (`Backend/.env`): GMAIL_USER,
 * GMAIL_PASS y, opcionalmente, SMTP_HOST / SMTP_PORT / SMTP_SECURE.
 */
async function main(): Promise<void> {
  const user = (process.env.GMAIL_USER ?? '').trim();
  const rawPass = (process.env.GMAIL_PASS ?? '').trim();
  const host = (process.env.SMTP_HOST ?? '').trim() || 'smtp.gmail.com';
  // Google muestra la contraseña como "abcd efgh ijkl mnop"; se aceptan con o
  // sin espacios para que el diagnóstico coincida con lo que usa la API.
  const pass = host === 'smtp.gmail.com' ? rawPass.replace(/\s+/g, '') : rawPass;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = (process.env.SMTP_SECURE ?? '').trim() === 'true';

  if (!user || !pass) {
    console.error('✗ Faltan GMAIL_USER y/o GMAIL_PASS en Backend/.env');
    process.exit(1);
  }

  if (user === 'tu_correo@gmail.com' || rawPass === 'tu_app_password') {
    console.error(
      [
        '✗ Backend/.env todavía tiene los valores de ejemplo de .env.example.',
        '  Edita Backend/.env (el archivo que lee la API), no .env.example, y',
        '  usa una contraseña de aplicación de Google de 16 caracteres:',
        '  https://myaccount.google.com/apppasswords',
      ].join('\n'),
    );
    process.exit(1);
  }

  const transporter = createTransport({ host, port, secure, auth: { user, pass } });

  try {
    await transporter.verify();
    console.log(`✓ SMTP autenticado correctamente: ${user} vía ${host}:${port}`);
  } catch (error) {
    const details = error as { code?: string; response?: string; message?: string };
    console.error('✗ El servidor de correo rechazó las credenciales.');
    if (details.code) console.error(`  código: ${details.code}`);
    if (details.response) console.error(`  respuesta: ${details.response}`);
    if (details.message) console.error(`  detalle: ${details.message}`);
    console.error(
      [
        '',
        'Revisa:',
        '  1. Que la verificación en 2 pasos esté activa.',
        '  2. Que GMAIL_PASS sea una contraseña de aplicación (16 caracteres),',
        '     no la contraseña normal de la cuenta.',
        '  3. Que no tenga espacios ni comillas.',
      ].join('\n'),
    );
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  console.error(
    `✗ No se pudo verificar el correo: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exit(1);
});

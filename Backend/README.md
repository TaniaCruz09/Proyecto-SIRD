<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Base de datos

El proyecto usa PostgreSQL con esquemas separados (`auth`, `catalogos`,
`calificaciones`, `centro`, `docentes`, `estudiante`, `organizacion_escolar`).

Copia `.env.example` a `.env` y ajusta la conexión. Luego:

```bash
# Crea esquemas + tablas automáticamente y arranca la API
# (requiere DB_SYNC=true en el .env)
$ npm run start:dev
```

También puedes crear la estructura sin arrancar la API:

```bash
# Solo crea los esquemas
$ npm run db:schemas

# Crea esquemas y sincroniza las tablas con las entidades
$ npm run db:sync

# Alternativa con migraciones (DB_SYNC=false)
$ npm run migration:run
```

> `synchronize` de TypeORM crea tablas, pero **no** esquemas de PostgreSQL; por
> eso el proyecto los crea antes de sincronizar. Si agregas una entidad en un
> esquema nuevo, se detecta automáticamente desde `@Entity({ schema })` o puedes
> declararlo en `DB_SCHEMAS` (separado por comas).

## Seguridad

- **Autenticación global**: todas las rutas exigen JWT salvo las marcadas con
  `@Public()` (login, refresh, recuperación de contraseña y healthcheck).
  El token se acepta por cookie `token` o por `Authorization: Bearer`.
- **Roles**: `@Role('Admin')` exige un rol concreto y `@AdminWrite()` exige
  Admin solo en POST/PUT/PATCH/DELETE (las lecturas siguen abiertas a cualquier
  usuario autenticado). Los catálogos y el centro educativo usan `@AdminWrite()`.
- **Datos sensibles**: `password`, `token`, `resetCode` y `resetCodeExpire` usan
  `select: false`; solo se cargan explícitamente en el login y en la
  recuperación de contraseña.
- **Rate limiting**: `/auth/*` limita intentos por IP (login 60/min,
  recuperación 15–20 cada 15 min). Requiere confiar en el proxy (`trust proxy`).
- **Uploads**: las fotos aceptan solo JPG/PNG/WEBP hasta 5 MB y los documentos
  del expediente hasta 5 MB. Los archivos de `/uploads` siguen siendo públicos
  por defecto; con `PROTECT_UPLOADS=true` se exige sesión válida.
- **Validación y limpieza de subidas**: además del MIME declarado se verifica el
  contenido real (magic bytes con `file-type`) y se responde `400` si no coincide
  con lo permitido. Si algo falla después de que Multer escribió el archivo,
  `UploadCleanupInterceptor` lo borra para no dejar huérfanos, y al reemplazar la
  foto de un estudiante o docente se elimina la anterior.
- **Almacenamiento de archivos**: todos los archivos subidos viven en una sola
  carpeta, calculada por `getUploadsRoot()` en
  `src/common/uploads/uploads-root.ts` como ruta absoluta (nunca depende del
  directorio desde el que se arranque el proceso). Por defecto es
  `<raíz del backend>/uploads`; con `UPLOADS_DIR` puede quedar fuera del
  proyecto o en un volumen persistente, y el sistema la crea si no existe.
  Al arrancar se registra la ruta resuelta en el log (`[Uploads] ...`).
- **Errores**: `AllExceptionsFilter` responde siempre con
  `{ statusCode, message, path, timestamp }`. Los fallos no controlados
  (TypeORM, red, etc.) se registran en el log del servidor y se devuelven como
  `500` con un mensaje genérico, sin incluir la consulta SQL ni detalles del
  motor de base de datos.
- **Swagger**: se publica en `/docs` solo fuera de producción o con
  `SWAGGER_ENABLED=true`.

Variables relacionadas: `NODE_ENV`, `JWT_SECRET`, `CORS_ORIGIN`,
`SWAGGER_ENABLED`, `PROTECT_UPLOADS`, `UPLOADS_DIR` (ver `.env.example`).

## Acceso desde otras PCs de la red local

Los archivos de `/uploads` los sirve este backend desde su propio disco: el
navegador del cliente solo descarga la URL, nunca lee el disco del servidor. Por
eso no hay que compartir carpetas, basta con que el backend sea alcanzable.

Para que otra PC de la red use el sistema hay que apuntar todo a la IP de LAN
del servidor (no a `localhost`, que en otra PC apunta a esa misma PC):

1. `frontend/.env` — son variables `NEXT_PUBLIC_*`, se incrustan en el bundle,
   así que el cambio exige reiniciar `npm run dev` o recompilar:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://<IP-LAN>:5003/api/v1
   NEXT_PUBLIC_API_UPLOADS=http://<IP-LAN>:5003
   ```

2. `CORS_ORIGIN` de este backend — el origen tal como lo ve el navegador:

   ```env
   CORS_ORIGIN=http://localhost:3000,http://<IP-LAN>:3000
   ```

3. `allowedDevOrigins` en `frontend/next.config.ts` — Next bloquea en
   desarrollo los recursos `_next/*` pedidos desde otro origen.

La IP la asigna el router por DHCP y puede cambiar; para uso continuo conviene
reservarla por MAC o usar el nombre mDNS del equipo (`<hostname>.local`).


## Cálculo de notas (esquelas)

`GET /api/v1/esquelas/:id/resumen` es la única fuente de verdad para las notas
que muestra el frontend; evita que cada vista (tabla general, detalle por
estudiante, exportación a Excel) calcule promedios por su cuenta.

Devuelve, por estudiante y asignatura:

- `cortes`: nota cuantitativa y cualitativa de cada corte (`registrado`
  indica si existe nota capturada).
- `periodos`: `Math.round` del promedio de los cortes del período.
- `final`: `Math.round` del promedio de los períodos.
- `promedioGeneral`: promedio de las notas finales de todas las asignaturas.

Reglas: un corte sin nota cuenta como `0`; la nota cualitativa se obtiene del
primer rango de `notaCualitativa` (ordenado por `id`) que contiene el valor y
`AI` cuando ningún rango aplica o el corte no tiene nota registrada.

### Nota cualitativa derivada

La regla vive en `NotaCualitativaService` y la usan tanto el resumen como el
guardado de notas. En `POST /esquela_row` y `PUT /esquela_row/:id` el backend
deriva la nota cualitativa desde `notaCuantitativa`:

- `notaCualitativa` es opcional en el payload; si se envía y no coincide con el
  rango del valor cuantitativo, la petición se rechaza con `400`.
- Si el valor no cae en ningún rango del catálogo, la petición se rechaza con
  `400`.
- En el `PUT` la derivación usa la nota cuantitativa efectiva (la del payload o
  la ya guardada), por lo que la cualitativa no puede quedar desincronizada.

### Fechas y calendarización

`POST`/`PUT` de `esquela_row` exigen que el corte esté **habilitado y con fechas**
en `anio_lectivo_calendarizacion` (por año lectivo y modalidad) y que la fecha de
hoy en `America/Managua` esté dentro del rango:

- Sin registro de calendarización o con `is_active = false`:
  `400 El corte no esta habilitado en la calendarizacion del anio lectivo`.
- Sin `fecha_inicio`/`fecha_fin`:
  `400 El corte no tiene fechas configuradas en la calendarizacion del anio lectivo`.
- Antes del rango: `400 El corte aun no esta habilitado por fecha`.
- Después del rango: `400 El corte esta cerrado por fecha...`.

### Secuencia de cortes

`POST /esquela_row` y `PUT /esquela_row/:id` validan que el corte anterior de la
asignatura esté resuelto antes de aceptar notas en el corte actual (la misma
regla que aplica la pantalla de captura):

- Se permite cuando el corte anterior ya tiene nota de **todos** los estudiantes
  activos del grupo en esa asignatura.
- Se permite también cuando el corte anterior está cerrado por fecha
  (`anio_lectivo_calendarizacion.fecha_fin` anterior a hoy): ya no se puede
  completar, así que no bloquea los siguientes.
- En otro caso responde `400` con `Completa el <corte anterior> antes de
  registrar notas en el <corte actual>`.

### Estado de los cortes expuesto al frontend

`GET /api/v1/esquela_head/:id` devuelve `cortesEstado`, calculado con las mismas
reglas y la misma zona horaria (`America/Managua`) que la validación de
guardado, para que la pantalla no las recalcule con la hora local del navegador:

```json
{
  "anioActivo": true,
  "modalidadId": 1,
  "hoy": "2026-11-12",
  "cortes": [{
    "corteId": 2,
    "abreviatura": "II corte",
    "estado": "open",              // open | future | closed | unconfigured
    "fechaInicio": "2026-11-12",
    "fechaFin": "2026-11-15",
    "rango": "12/11/2026 - 15/11/2026",
    "editablePorFecha": true,      // lo que el backend acepta por fecha
    "mensajeFecha": "En fecha",
    "porAsignatura": {
      "2": { "completo": true, "secuenciaCompleta": true,
             "habilitado": true, "editable": true, "mensaje": "Completado" }
    }
  }]
}
```

`editable` combina la fecha con la secuencia (corte anterior completo o cerrado).
Un corte **sin calendarización, deshabilitado o sin fechas** queda
`unconfigured` con `editablePorFecha: false`: no se puede capturar hasta que el
administrador configure sus fechas en la calendarización del año lectivo.

El orden de los cortes lo resuelve `cortes/corte-secuencia.ts` (períodos del año
lectivo → cortes del año → cortes con notas), compartido con el endpoint de
resumen, y se toma el inmediatamente anterior aun cuando los cortes estén
repartidos en varios períodos.

### Unicidad de cédula y código

`POST`/`PUT` de estudiantes y docentes validan duplicados **entre registros
activos** antes de guardar y responden `409 Conflict`:

- `Ya existe un estudiante con la cedula <x>`
- `Ya existe un estudiante con el codigo <x>`
- `Ya existe un docente con la cedula <x>`

La comparación ignora guiones y mayúsculas (`regexp_replace(...)`), así que
`001-140311-1001A` y `0011403111001A` cuentan como la misma cédula.

**Los registros con borrado lógico liberan su cédula/código.** Eso se garantiza
en la base de datos con índices únicos **parciales** (migración
`20261112000100-liberar-cedula-al-eliminar`):

```sql
create unique index uq_student_cedula_activa on estudiante.student (cedula_identidad)
  where cedula_identidad is not null and deleted_at is null;
create unique index uq_student_codigo_activo on estudiante.student (codigo_estudiante)
  where codigo_estudiante is not null and deleted_at is null;
create unique index uq_docente_cedula_activa on docentes.docentes (cedula_identidad)
  where cedula_identidad is not null and deleted_at is null;
```

Además, `AllExceptionsFilter` traduce cualquier violación de unicidad de
PostgreSQL (`23505`) a `409` con un mensaje genérico, en lugar de un `500`.

Validación en vivo para los formularios (sin descargar el listado completo):

- `GET /api/v1/student/existe?cedula=&codigo=&excluirId=` →
  `{ data: { existe, campo, valor } }`
- `GET /api/v1/docentes/existe?cedula=&excluirId=` →
  `{ data: { existe, campo, valor } }`

`excluirId` se usa al editar para no marcar el propio registro como duplicado.

Al reutilizar la cédula de un registro eliminado se crea uno nuevo; las notas y
el expediente del anterior quedan archivados en la fila eliminada.

### Reglas de períodos y cortes del año lectivo

`POST` / `PUT /anioLectivo` validan la configuración **antes de escribir nada**
(`anioLectivo-periodos.helper.ts`), de modo que un cliente no puede guardar
combinaciones inválidas aunque se salte la pantalla:

- Al menos un corte seleccionado.
- `cantidad_periodos` del tipo de periodización debe ser mayor que cero.
- Cortes >= períodos (ningún período puede quedar vacío).
- Todos los cortes deben existir y no estar eliminados.
- Si el payload trae `periodos` explícitos: deben ser exactamente los del tipo,
  cada período con al menos un corte, sin cortes repetidos entre períodos y sin
  `orden` duplicado.
- Si trae `periodos` **y** `cortes`, ambos deben describir el mismo conjunto.

La distribución es determinista: se reparte lo más parejo posible y el excedente
va a los primeros períodos (5 cortes en 2 semestres → 3 + 2).

**Preview sin guardar**: `POST /api/v1/anioLectivo/preview`

```json
// body
{ "tipo_periodizacion_id": 1, "cortes": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] }

// respuesta
{ "data": { "totalPeriodos": 2, "totalCortes": 4,
  "periodos": [{ "orden": 1, "nombre": "semestral 1", "abreviatura": "Smt1",
                 "cortes": [{ "id": 1, "orden": 1 }, { "id": 2, "orden": 2 }] }] } }
```

Acepta también `periodos` explícitos (se validan y normalizan). Devuelve los
mismos `400` que el guardado, por lo que el formulario de año lectivo lo usa para
mostrar la vista previa y los errores.

### Promedios persistidos

`calificaciones.esquela_row` guarda, además de la nota del corte:

- `promedio_semestral`: promedio del período al que pertenece ese corte.
- `nota_final`: nota final de la asignatura para ese estudiante.

`PromediosService` los recalcula y guarda tras cada alta, edición o borrado de
una nota (`esquela_row`), aplicando las mismas reglas que el resumen: corte sin
nota = 0, período = `Math.round(promedio de sus cortes)`, final =
`Math.round(promedio de los períodos)`. El endpoint de resumen devuelve el valor
persistido y solo calcula cuando la fila todavía no lo tiene (datos viejos).

`POST /api/v1/esquelas/:id/recalcular` (solo Admin) recalcula una esquela
completa y devuelve `{ actualizados }`; sirve para rellenar datos importados o
corregir valores tras un cambio de regla.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

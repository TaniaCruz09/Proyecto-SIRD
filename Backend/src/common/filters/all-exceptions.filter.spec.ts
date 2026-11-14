import {
  ArgumentsHost,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

function createHost() {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const response = { status, headersSent: false };
  const request = { method: 'GET', originalUrl: '/api/v1/pais?page=1' };

  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => request,
    }),
  } as unknown as ArgumentsHost;

  return { host, status, json };
}

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => jest.restoreAllMocks());

  it('devuelve el formato esperado y oculta detalles de SQL en errores no controlados', () => {
    const { host, status, json } = createHost();
    const error = new Error(
      'syntax error at or near "WHERE": SELECT * FROM "users" WHERE id = 1',
    );
    error.name = 'QueryFailedError';

    filter.catch(error, host);

    expect(status).toHaveBeenCalledWith(500);
    const body = json.mock.calls[0][0];
    expect(body).toMatchObject({
      statusCode: 500,
      message: 'Error interno del servidor',
      path: '/api/v1/pais?page=1',
    });
    expect(typeof body.timestamp).toBe('string');
    expect(JSON.stringify(body)).not.toMatch(/select|from|where/i);
  });

  it('oculta detalles de SQL aunque vengan dentro de un BadRequestException', () => {
    const { host, json } = createHost();

    filter.catch(
      new BadRequestException('duplicate key value violates unique constraint "uq_pais"'),
      host,
    );

    expect(json.mock.calls[0][0]).toMatchObject({
      statusCode: 400,
      message: 'No se pudo procesar la solicitud',
    });
  });

  it('usa un mensaje genérico para cualquier 5xx', () => {
    const { host, json } = createHost();

    filter.catch(new InternalServerErrorException('SELECT * FROM "users"'), host);

    expect(json.mock.calls[0][0]).toMatchObject({
      statusCode: 500,
      message: 'Error interno del servidor',
    });
  });

  it('conserva el mensaje de las HttpException de cliente', () => {
    const { host, status, json } = createHost();

    filter.catch(new NotFoundException('Pais no encontrado'), host);

    expect(status).toHaveBeenCalledWith(404);
    expect(json.mock.calls[0][0]).toMatchObject({
      statusCode: 404,
      message: 'Pais no encontrado',
    });
  });

  it('conserva los mensajes de validación en arreglo', () => {
    const { host, json } = createHost();

    filter.catch(
      new BadRequestException({
        statusCode: 400,
        message: ['anio_lectivo must be a number'],
        error: 'Bad Request',
      }),
      host,
    );

    expect(json.mock.calls[0][0]).toMatchObject({
      statusCode: 400,
      message: ['anio_lectivo must be a number'],
    });
  });

  it('registra el error original en el log sin exponerlo en la respuesta', () => {
    const { host, json } = createHost();
    const errorSpy = jest.spyOn(Logger.prototype, 'error');
    const dbError = new Error('SELECT * FROM "users" WHERE email = $1');

    filter.catch(new InternalServerErrorException(dbError), host);

    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy.mock.calls[0][0]).toContain('SELECT * FROM');
    expect(JSON.stringify(json.mock.calls[0][0])).not.toMatch(/select|users/i);
  });
});

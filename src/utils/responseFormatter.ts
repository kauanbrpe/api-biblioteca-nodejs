import { Response } from 'express';
import { HttpStatus } from './httpStatus';

interface SuccessResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
}

interface ErrorResponseOptions {
  res: Response;
  statusCode?: number;
  message: string;
  errors?: unknown;
}

/**
 * Padroniza o shape de respostas de sucesso da API.
 *
 * Uso:
 *   return sendSuccess({ res, data: book, statusCode: HttpStatus.CREATED });
 *
 * Resultado:
 *   { "success": true, "message": "OK", "data": { ... } }
 */
export function sendSuccess<T>({
  res,
  statusCode = HttpStatus.OK,
  message = 'OK',
  data,
}: SuccessResponseOptions<T>): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Padroniza o shape de respostas de erro da API.
 *
 * Uso:
 *   return sendError({ res, statusCode: HttpStatus.NOT_FOUND, message: 'Livro não encontrado' });
 *
 * Resultado:
 *   { "success": false, "message": "Livro não encontrado", "errors": null }
 */
export function sendError({
  res,
  statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
  message,
  errors = null,
}: ErrorResponseOptions): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

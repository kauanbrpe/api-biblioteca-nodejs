import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from "../generated/prisma"; 
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError';
import { HttpStatus } from '../utils/httpStatus';
import { formatZodError } from '../utils/formatZodError';
import { sendError } from '../utils/responseFormatter';

/**
 * Middleware global de tratamento de erros.
 * Deve ser o ÚLTIMO middleware registrado no app.ts (depois de todas as rotas).
 *
 * Uso no app.ts:
 *   import { errorHandler } from './middlewares/errorHandler';
 *   ...
 *   app.use(errorHandler);
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void {
  // Erros de negócio (lançados intencionalmente com AppError)
  if (err instanceof AppError) {
    sendError({ res, statusCode: err.statusCode, message: err.message });
    return;
  }

  // Erros de validação do Zod
  if (err instanceof ZodError) {
    sendError({
      res,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Erro de validação',
      errors: formatZodError(err),
    });
    return;
  }

  // Erros conhecidos do Prisma (Postgres) — ex: violação de unique constraint
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      sendError({
        res,
        statusCode: HttpStatus.CONFLICT,
        message: `Registro duplicado no campo: ${err.meta?.target ?? 'desconhecido'}`,
      });
      return;
    }

    if (err.code === 'P2025') {
      sendError({
        res,
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Registro não encontrado',
      });
      return;
    }

    sendError({
      res,
      statusCode: HttpStatus.BAD_REQUEST,
      message: `Erro no banco de dados (Prisma): ${err.code}`,
    });
    return;
  }

  // Erros de validação do Mongoose (MongoDB)
  if (err instanceof mongoose.Error.ValidationError) {
    sendError({
      res,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Erro de validação (MongoDB)',
      errors: Object.values(err.errors).map((e) => e.message),
    });
    return;
  }

  // ObjectId inválido enviado para o Mongoose
  if (err instanceof mongoose.Error.CastError) {
    sendError({
      res,
      statusCode: HttpStatus.BAD_REQUEST,
      message: `Identificador inválido: ${err.value}`,
    });
    return;
  }

  // Qualquer outro erro não previsto
  console.error('[errorHandler] Erro não tratado:', err);

  sendError({
    res,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Erro interno do servidor',
  });
}

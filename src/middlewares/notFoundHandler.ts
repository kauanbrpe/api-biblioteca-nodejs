import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Middleware para rotas que não batem com nenhum endpoint registrado.
 * Deve ser registrado DEPOIS de todas as rotas e ANTES do errorHandler.
 *
 * Uso no app.ts:
 *   import { notFoundHandler } from './middlewares/notFoundHandler';
 *   import { errorHandler } from './middlewares/errorHandler';
 *   ...
 *   app.use('/api', routes);
 *   app.use(notFoundHandler); // <- depois das rotas
 *   app.use(errorHandler);    // <- sempre por último
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  next(AppError.notFound(`Rota não encontrada: ${req.method} ${req.originalUrl}`));
}

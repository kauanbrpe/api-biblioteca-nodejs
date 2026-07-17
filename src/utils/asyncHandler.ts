import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Envolve um controller async, capturando qualquer erro (rejeição de Promise)
 * e repassando para o próximo middleware de erro via next(err).
 * Evita repetir try/catch em todos os controllers.
 *
 * Uso:
 *   export const getBook = asyncHandler(async (req, res) => {
 *     const book = await bookService.findById(req.params.id);
 *     res.status(HttpStatus.OK).json(book);
 *   });
 */
export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

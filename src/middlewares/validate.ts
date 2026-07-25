import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

type RequestPart = 'body' | 'params' | 'query';

/**
 * Middleware genérico de validação usando um schema Zod.
 * Valida req.body, req.params ou req.query antes da requisição chegar no controller.
 *
 * Se a validação falhar, repassa o ZodError original para o errorHandler global
 * (que já sabe formatá-lo com formatZodError e responder com 400).
 *
 * Uso na rota:
 *   import { validate } from '../middlewares/validate';
 *   import { createBookSchema } from '../schemas/book.schema';
 *
 *   router.post('/books', validate(createBookSchema), bookController.create);
 *
 * Para validar params (ex: :id na URL):
 *   router.get('/books/:id', validate(idParamSchema, 'params'), bookController.getById);
 *
 * Para validar query (ex: ?page=1&limit=10):
 *   router.get('/books', validate(listBooksQuerySchema, 'query'), bookController.getAll);
 *   -> no controller, leia de req.validated.query (não req.query),
 *      pois no Express 5 req.query é somente leitura e não pode ser sobrescrito.
 */
export function validate(schema: ZodType, part: RequestPart = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      next(result.error);
      return;
    }

    if (part === 'query') {
      // Express 5: req.query não pode ser reatribuído diretamente.
      // Guardamos o resultado validado/transformado em req.validated.query.
      (req as Request & { validated?: Record<string, unknown> }).validated = {
        ...(req as Request & { validated?: Record<string, unknown> }).validated,
        query: result.data,
      };
    } else {
      req[part] = result.data;
    }

    next();
  };
}

import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { AuthenticatedUser } from "./authenticate";

/**
 * Middleware de autorização por role.
 * Deve ser usado SEMPRE depois do `authenticate` na cadeia de middlewares,
 * pois depende de req.user já estar preenchido.
 *
 * Uso na rota:
 *   import { authenticate } from '../middlewares/authenticate';
 *   import { authorize } from '../middlewares/authorize';
 *
 *   router.post(
 *     '/authors',
 *     authenticate,
 *     authorize('ADMIN'),
 *     authorController.create,
 *   );
 *
 * Aceita múltiplos roles permitidos:
 *   authorize('ADMIN', 'USER')
 */
export function authorize(...allowedRoles: AuthenticatedUser["role"][]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      // Não deveria acontecer se authenticate rodou antes, mas fica como segurança extra
      return next(AppError.unauthorized("Usuário não autenticado"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(AppError.forbidden("Você não tem permissão para acessar este recurso"));
    }

    next();
  };
}

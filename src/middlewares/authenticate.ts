import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

export interface AuthenticatedUser {
  id: number;
  role: "USER" | "ADMIN";
}

// Estende o tipo Request do Express para incluir o usuário autenticado
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Middleware de autenticação via JWT.
 * Espera o header: Authorization: Bearer <token>
 * Se válido, anexa o usuário decodificado em req.user para uso nos controllers/services.
 *
 * Uso na rota:
 *   import { authenticate } from '../middlewares/authenticate';
 *
 *   router.get('/loans/me', authenticate, loanController.getMyLoans);
 *
 * No controller, acesse com: req.user.id / req.user.role
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(AppError.unauthorized("Token de autenticação não informado"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      // Erro de configuração do servidor, não do cliente
      return next(AppError.internal("JWT_SECRET não configurado"));
    }

    const decoded = jwt.verify(token, secret) as AuthenticatedUser;

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    next(AppError.unauthorized("Token inválido ou expirado"));
  }
}

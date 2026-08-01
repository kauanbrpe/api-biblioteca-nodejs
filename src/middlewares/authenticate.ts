import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { roleEnum } from "@prisma/client";

export interface AuthenticatedUser {
  id: number;
  role: roleEnum;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(AppError.unauthorized("Token de autenticação não informado"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return next(AppError.internal("JWT_SECRET não configurado"));
    }

    const decoded = jwt.verify(token, secret) as AuthenticatedUser;

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    next(AppError.unauthorized("Token inválido ou expirado"));
  }
}
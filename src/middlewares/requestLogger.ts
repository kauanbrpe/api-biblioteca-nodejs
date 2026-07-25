import { Request, Response, NextFunction } from "express";

/**
 * Middleware simples de log de requisições.
 * Loga: método, rota, status da resposta e tempo total de processamento.
 * Útil em desenvolvimento e para acompanhar logs em produção (ex: painel do Render).
 *
 * Uso no app.ts (registrar antes das rotas, para cobrir toda a aplicação):
 *   import { requestLogger } from './middlewares/requestLogger';
 *   app.use(requestLogger);
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });

  next();
}

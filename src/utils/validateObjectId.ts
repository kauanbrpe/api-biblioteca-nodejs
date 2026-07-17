import mongoose from 'mongoose';
import { AppError } from './AppError';

/**
 * Valida se uma string é um ObjectId válido do MongoDB.
 * Útil já que o projeto mistura Mongo (ObjectId) e Postgres (numérico),
 * evitando que um ID mal formado quebre feio dentro do Mongoose.
 *
 * Uso dentro de um controller/service:
 *   validateObjectId(req.params.id);
 *   const book = await Book.findById(req.params.id);
 */
export function validateObjectId(id: string): void {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest(`ID inválido: ${id}`);
  }
}

/**
 * Versão booleana, caso você prefira checar sem lançar erro.
 *
 * Uso:
 *   if (!isValidObjectId(id)) { ... }
 */
export function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

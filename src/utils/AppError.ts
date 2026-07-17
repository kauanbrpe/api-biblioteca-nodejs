import { HttpStatus } from './httpStatus';

/**
 * Erro customizado para erros de negócio/aplicação.
 * Deve ser lançado nos services/controllers ao invés de Error genérico,
 * pois carrega o statusCode HTTP correto junto com a mensagem.
 *
 * Uso:
 *   throw new AppError('Livro não encontrado', HttpStatus.NOT_FOUND);
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true,
  ) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Mantém o stack trace correto (excluindo o construtor)
    Error.captureStackTrace(this, this.constructor);
  }

  // Helpers estáticos para os casos mais comuns

  static badRequest(message = 'Requisição inválida'): AppError {
    return new AppError(message, HttpStatus.BAD_REQUEST);
  }

  static unauthorized(message = 'Não autorizado'): AppError {
    return new AppError(message, HttpStatus.UNAUTHORIZED);
  }

  static forbidden(message = 'Acesso negado'): AppError {
    return new AppError(message, HttpStatus.FORBIDDEN);
  }

  static notFound(message = 'Recurso não encontrado'): AppError {
    return new AppError(message, HttpStatus.NOT_FOUND);
  }

  static conflict(message = 'Conflito de dados'): AppError {
    return new AppError(message, HttpStatus.CONFLICT);
  }

  static unprocessable(message = 'Entidade não processável'): AppError {
    return new AppError(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }

  static internal(message = 'Erro interno do servidor'): AppError {
    return new AppError(message, HttpStatus.INTERNAL_SERVER_ERROR, false);
  }
}
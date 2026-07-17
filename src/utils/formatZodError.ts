import { ZodError } from 'zod';

export interface FormattedZodIssue {
  field: string;
  message: string;
}

/**
 * Converte um ZodError (formato cru e verboso) em uma lista simples
 * de { field, message }, pronta para devolver na resposta da API.
 *
 * Uso:
 *   const result = schema.safeParse(req.body);
 *   if (!result.success) {
 *     return res.status(HttpStatus.BAD_REQUEST).json({
 *       message: 'Erro de validação',
 *       errors: formatZodError(result.error),
 *     });
 *   }
 */
export function formatZodError(error: ZodError): FormattedZodIssue[] {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || '(raiz)',
    message: issue.message,
  }));
}

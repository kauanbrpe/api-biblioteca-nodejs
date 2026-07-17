import { z } from 'zod';

/**
 * Schema de validação das variáveis de ambiente.
 * Falha rápido no boot da aplicação (com mensagem clara) caso alguma
 * variável obrigatória esteja faltando ou em formato errado, ao invés
 * de deixar o erro estourar em runtime de forma confusa (ex: DATABASE_URL undefined).
 *
 * Requer que 'dotenv' (ou --env-file) já tenha carregado o .env antes
 * deste arquivo ser importado.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),

  MONGODB_URI: z.string().url('MONGODB_URI deve ser uma URL válida'),

  DB_USER: z.string().min(1, 'DB_USER é obrigatório'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD é obrigatório'),
  DB_NAME: z.string().min(1, 'DB_NAME é obrigatório'),
  DATABASE_URL: z.string().url('DATABASE_URL deve ser uma URL válida'),
});

function loadEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Variáveis de ambiente inválidas:');
    console.error(result.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n'));
    process.exit(1);
  }

  return result.data;
}

/**
 * Objeto de ambiente validado e tipado, use no lugar de process.env direto.
 *
 * Uso:
 *   import { env } from './config/env';
 *   app.listen(env.PORT, () => ...);
 */
export const env = loadEnv();

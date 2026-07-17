export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

/**
 * Extrai e normaliza os parâmetros de paginação vindos da query string.
 * Funciona igual para repositories de Mongo (skip/limit) e Postgres/Prisma (skip/take).
 *
 * Uso:
 *   const { page, limit, skip } = parsePagination(req.query);
 *
 *   // Prisma:
 *   prisma.book.findMany({ skip, take: limit });
 *
 *   // Mongoose:
 *   Book.find().skip(skip).limit(limit);
 */
export function parsePagination(query: {
  page?: string;
  limit?: string;
}): PaginationParams {
  const page = Math.max(DEFAULT_PAGE, Number(query.page) || DEFAULT_PAGE);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number(query.limit) || DEFAULT_LIMIT),
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Monta o objeto de metadados de paginação para a resposta da API,
 * a partir do total de itens encontrados no banco.
 *
 * Uso:
 *   const totalItems = await prisma.book.count();
 *   const meta = buildPaginationMeta({ page, limit, totalItems });
 */
export function buildPaginationMeta({
  page,
  limit,
  totalItems,
}: {
  page: number;
  limit: number;
  totalItems: number;
}): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * Atalho que já retorna data + meta juntos, pronto para a resposta.
 *
 * Uso:
 *   const [books, totalItems] = await Promise.all([
 *     prisma.book.findMany({ skip, take: limit }),
 *     prisma.book.count(),
 *   ]);
 *   return buildPaginatedResult(books, { page, limit, totalItems });
 */
export function buildPaginatedResult<T>(
  data: T[],
  params: { page: number; limit: number; totalItems: number },
): PaginatedResult<T> {
  return {
    data,
    meta: buildPaginationMeta(params),
  };
}

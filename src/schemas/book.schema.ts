import { z } from "zod";

export const createBookSchema = z.object({
    title: z.string().min(1, "Título é obrigatório").max(300),
    isbn: z.string().min(10).max(17),
    publishedYear: z.coerce.number().int().min(1000).max(new Date().getFullYear()),
    totalCopies: z.coerce.number().int().min(1, "Deve ter pelo menos 1 cópia"),
    avaiableCopies: z.coerce.number().int().min(0),
    authorId: z.coerce.number().int().positive(),
});

export const updateBookSchema = z.object({
    title: z.string().min(1).max(300).optional(),
    isbn: z.string().min(10).max(17).optional(),
    publishedYear: z.coerce.number().int().min(1000).max(new Date().getFullYear()).optional(),
    totalCopies: z.coerce.number().int().min(1).optional(),
    avaiableCopies: z.coerce.number().int().min(0).optional(),
    authorId: z.coerce.number().int().positive().optional(),
});

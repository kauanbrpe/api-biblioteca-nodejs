import { z } from "zod";

export const createReviewSchema = z.object({
    bookId: z.coerce.number().int().positive(),
    userId: z.coerce.number().int().positive(),
    rating: z.coerce.number().int().min(1, "Nota mínima é 1").max(5, "Nota máxima é 5"),
    comment: z.string().max(1000).optional(),
});

export const updateReviewSchema = z.object({
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().max(1000),
});
